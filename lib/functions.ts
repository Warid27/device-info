"use client"

import FingerprintJS from "@fingerprintjs/fingerprintjs"

export const parseDeviceName = (userAgent: string): string => {
  console.log("USER AGENT:", userAgent)
  const iphoneMatch = userAgent.match(/iPhone\s?(\d+[,\d]*|\w+)/i)
  if (iphoneMatch) {
    const model = iphoneMatch[1].replace(/,/g, ".")
    return `iPhone ${model}`
  }

  const ipadMatch = userAgent.match(/iPad(\d+[,\d]*)?/i)
  if (ipadMatch) {
    return ipadMatch[1] ? `iPad ${ipadMatch[1].replace(/,/g, ".")}` : "iPad"
  }

  const samsungMatch = userAgent.match(/Samsung[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (samsungMatch) {
    return `Samsung ${samsungMatch[1].trim()}`
  }

  const xiaomiMatch = userAgent.match(/Xiaomi[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (xiaomiMatch) {
    return `Xiaomi ${xiaomiMatch[1].trim()}`
  }

  const vivoMatch = userAgent.match(/vivo[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (vivoMatch) {
    return `Vivo ${vivoMatch[1].trim()}`
  }

  const oppoMatch = userAgent.match(/OPPO[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (oppoMatch) {
    return `Oppo ${oppoMatch[1].trim()}`
  }

  const realmeMatch = userAgent.match(/realme[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (realmeMatch) {
    return `Realme ${realmeMatch[1].trim()}`
  }

  const huaweiMatch = userAgent.match(/Huawei[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (huaweiMatch) {
    return `Huawei ${huaweiMatch[1].trim()}`
  }

  const asusMatch = userAgent.match(/ASUS[\s_-]?([\w\s-]+?)(?:Build|\))/i)
  if (asusMatch) {
    return `ASUS ${asusMatch[1].trim()}`
  }

  const pocoMatch = userAgent.match(/POCO[\s_-]?([\w\s-]+?)(?:Build|\))/i)
  if (pocoMatch) {
    return `POCO ${pocoMatch[1].trim()}`
  }

  const oneplusMatch = userAgent.match(/OnePlus[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (oneplusMatch) {
    return `OnePlus ${oneplusMatch[1].trim()}`
  }

  const pixelMatch = userAgent.match(/Pixel[\s-]?([\w\s-]+?)(?:Build|\))/i)
  if (pixelMatch) {
    return `Youtube Pixel ${pixelMatch[1].trim()}`
  }

  // Generic Android device model fallback. Avoid capturing single letters like "K" or locale codes.
  const androidMatch = userAgent.match(/Android[^;]*;\s*([^;()]+?)(?:\s+Build|\))/i)
  if (androidMatch) {
    const rawModel = androidMatch[1].trim()
    const isNoise =
      /^(Android|Linux|Mobile|Tablet|U|K)$/i.test(rawModel) || // common noise tokens
      /^[a-z]{2}-[A-Z]{2}$/.test(rawModel) // locale like en-US

    const looksLikeModel = rawModel.length >= 3 && /[A-Za-z]/.test(rawModel)

    if (!isNoise && looksLikeModel) {
      return rawModel
    }
  }

  if (userAgent.includes("Windows")) {
    return "Windows PC"
  }

  if (userAgent.includes("Macintosh")) {
    return "Mac"
  }

  if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
    return "Linux PC"
  }

  return "Unknown Device"
}

export const collectDeviceInfo = async (sessionId: string) => {
  console.log("[collectDeviceInfo] start, navigator.userAgent:", navigator.userAgent)
  let anyResult: any = {}
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    anyResult = result as any
  } catch (e) {
    console.warn("[collectDeviceInfo] FingerprintJS unavailable:", e)
  }
  const deviceInfo: any = {
    sessionId,
    timestamp: new Date().toISOString(),
    locationType: "ip-based",
    apiEndpoint: `${window.location.origin}/api/collect`,

    deviceName: parseDeviceName(navigator.userAgent),

    fingerprint: {
      visitorId: anyResult.visitorId,
      confidence: anyResult.confidence?.score,
      requestId: anyResult.requestId,
      components: {
        fonts: anyResult.components?.fonts?.value || [],
        audio: anyResult.components?.audio?.value || "unavailable",
        canvas: anyResult.components?.canvas?.value || "unavailable",
        webgl: anyResult.components?.webgl?.value || "unavailable",
        plugins: anyResult.components?.plugins?.value || [],
        timezone: anyResult.components?.timezone?.value || "unknown",
        languages: anyResult.components?.languages?.value || [],
        colorDepth: anyResult.components?.colorDepth?.value || "unknown",
        deviceMemory: anyResult.components?.deviceMemory?.value || "unknown",
        hardwareConcurrency: anyResult.components?.hardwareConcurrency?.value || "unknown",
        screenResolution: anyResult.components?.screenResolution?.value || [],
        availableScreenResolution: anyResult.components?.availableScreenResolution?.value || [],
        touchSupport: anyResult.components?.touchSupport?.value || {},
        vendor: anyResult.components?.vendor?.value || "unknown",
        vendorFlavors: anyResult.components?.vendorFlavors?.value || [],
        cookiesEnabled: anyResult.components?.cookiesEnabled?.value || false,
        colorGamut: anyResult.components?.colorGamut?.value || "unknown",
        invertedColors: anyResult.components?.invertedColors?.value || false,
        forcedColors: anyResult.components?.forcedColors?.value || false,
        monochrome: anyResult.components?.monochrome?.value || 0,
        contrast: anyResult.components?.contrast?.value || 0,
        reducedMotion: anyResult.components?.reducedMotion?.value || false,
        hdr: anyResult.components?.hdr?.value || false,
        math: anyResult.components?.math?.value || {},
        architecture: anyResult.components?.architecture?.value || "unknown",
        applePay: anyResult.components?.applePay?.value || "unavailable",
      },
    },

    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || "unspecified",
    onlineStatus: navigator.onLine,

    screenResolution: `${window.screen.width}x${window.screen.height}`,
    availableScreenSize: `${window.screen.availWidth}x${window.screen.availHeight}`,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    pixelRatio: window.devicePixelRatio,
    orientation: (window.screen as any).orientation?.type || "unknown",

    hardwareConcurrency: (navigator as any).hardwareConcurrency || "unknown",
    deviceMemory: (navigator as any).deviceMemory || "unknown",
    maxTouchPoints: (navigator as any).maxTouchPoints,
    touchSupport: "ontouchstart" in window,

    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),

    referrer: document.referrer || "Direct",

    localStorage: typeof localStorage !== "undefined",
    sessionStorage: typeof sessionStorage !== "undefined",
    indexedDB: typeof indexedDB !== "undefined",
  }

  // Try User-Agent Client Hints for accurate model on Chromium browsers
  try {
    const uaData: any = (navigator as any).userAgentData
    if (uaData?.getHighEntropyValues) {
      const high = await uaData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "fullVersionList",
      ])
      if (high) {
        ;(deviceInfo as any).uaHints = {
          model: high.model,
          platform: high.platform,
          platformVersion: high.platformVersion,
          fullVersionList: high.fullVersionList,
          mobile: uaData.mobile,
          brands: uaData.brands,
        }
        if (high.model && typeof high.model === "string" && high.model.trim().length > 0) {
          deviceInfo.deviceName = high.model
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (connection) {
    deviceInfo.connection = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type,
    }
  }

  if ((navigator as any).getBattery) {
    try {
      const battery = await (navigator as any).getBattery()
      deviceInfo.battery = {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      }
    } catch (e) {
      deviceInfo.battery = "unavailable"
    }
  }

  try {
    const canvas = document.createElement("canvas")
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as any
    if (gl && typeof WebGLRenderingContext !== "undefined" && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      deviceInfo.webgl = {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      }
    }
  } catch (e) {
    deviceInfo.webgl = "unavailable"
  }

  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px 'Arial'"
      ctx.textBaseline = "alphabetic"
      ctx.fillStyle = "#f60"
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = "#069"
      ctx.fillText("DeviceTrack", 2, 15)
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
      ctx.fillText("DeviceTrack", 4, 17)
      deviceInfo.canvasFingerprint = canvas.toDataURL().slice(-50)
    }
  } catch (e) {
    deviceInfo.canvasFingerprint = "unavailable"
  }

  deviceInfo.plugins = Array.from(navigator.plugins).map((plugin) => ({
    name: plugin.name,
    description: plugin.description,
  }))

  deviceInfo.mediaDevices = {
    available: !!navigator.mediaDevices,
    enumerateDevices: !!navigator.mediaDevices?.enumerateDevices,
  }

  ;(deviceInfo as any).pdfViewerEnabled = (navigator as any).pdfViewerEnabled || false

  if ((navigator as any).permissions) {
    ;(deviceInfo as any).permissionsAPI = true
  }

  return deviceInfo
}

export const sendData = async (data: any) => {
  await fetch("/api/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export const collectPreciseLocation = async (sessionId: string): Promise<boolean> => {
  if (!navigator.geolocation) {
    return false
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const preciseLocation = {
            sessionId,
            timestamp: new Date().toISOString(),
            locationType: "gps-precise",
            gpsLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
          }

          await fetch("/api/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(preciseLocation),
          })

          resolve(true)
        } catch (error) {
          resolve(false)
        }
      },
      () => resolve(false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}


