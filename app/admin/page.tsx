"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  RefreshCw,
  Monitor,
  MapPin,
  Globe,
  Clock,
  Wifi,
  Cpu,
  HardDrive,
  Battery,
  Eye,
  Fingerprint,
  Plug,
  Database,
  Smartphone,
  Shield,
} from "lucide-react"

interface DeviceData {
  sessionId?: string
  timestamp: string
  apiEndpoint?: string // Added apiEndpoint field to interface
  deviceName?: string // Added device name field
  locationType?: "ip-based" | "gps-precise" // Added location type
  uaModel?: string
  uaPlatform?: string
  uaPlatformVersion?: string
  uaFullVersionList?: string
  uaHints?: {
    model?: string
    platform?: string
    platformVersion?: string
    fullVersionList?: Array<{ brand: string; version: string }>
    mobile?: boolean
    brands?: Array<{ brand: string; version: string }>
  }
  fingerprint?: {
    visitorId: string
    confidence: number
    requestId: string
    components: {
      fonts: string[]
      audio: any
      canvas: any
      webgl: any
      plugins: any[]
      timezone: string
      languages: string[]
      colorDepth: number | string
      deviceMemory: number | string
      hardwareConcurrency: number | string
      screenResolution: number[]
      availableScreenResolution: number[]
      touchSupport: any
      vendor: string
      vendorFlavors: string[]
      cookiesEnabled: boolean
      colorGamut: string
      invertedColors: boolean
      forcedColors: boolean
      monochrome: number
      contrast: number
      reducedMotion: boolean
      hdr: boolean
      math: any
      architecture: string
      applePay: string
    }
  }
  gpsLocation?: {
    latitude: number
    longitude: number
    accuracy: number
    altitude: number | null
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
  }
  userAgent: string
  language: string
  languages: string[]
  platform: string
  screenResolution: string
  availableScreenSize: string
  windowSize: string
  colorDepth: number
  pixelDepth: number
  pixelRatio: number
  orientation: string
  timezone: string
  timezoneOffset: number
  cookiesEnabled: boolean
  doNotTrack: string
  onlineStatus: boolean
  referrer: string
  hardwareConcurrency: number | string
  deviceMemory: number | string
  maxTouchPoints: number
  touchSupport: boolean
  localStorage: boolean
  sessionStorage: boolean
  indexedDB: boolean
  pdfViewerEnabled: boolean
  permissionsAPI: boolean
  canvasFingerprint: string
  plugins: Array<{ name: string; description: string }>
  connection?: {
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
    type: string
  }
  battery?:
    | {
        level: number
        charging: boolean
        chargingTime: number
        dischargingTime: number
      }
    | string
  webgl?:
    | {
        vendor: string
        renderer: string
        version: string
        shadingLanguageVersion: string
      }
    | string
  mediaDevices?: {
    available: boolean
    enumerateDevices: boolean
  }
  location?: {
    ip: string
    city: string
    region: string
    regionCode: string
    country: string
    countryCode: string
    countryCapital: string
    latitude: number
    longitude: number
    timezone: string
    isp: string
    asn: string
    postal: string
    continentCode: string
    fullLocation: string
  }
}

function buildGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.youtube.com/maps?q=${latitude},${longitude}`
}

export default function AdminView() {
  const [data, setData] = useState<DeviceData[]>([])
  const [loading, setLoading] = useState(true)
  const [origin, setOrigin] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/collect")
      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (sessionId?: string) => {
    if (!sessionId) return
    try {
      await fetch(`/api/collect?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      })
      await fetchData()
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Device Tracking Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive device information monitoring</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono" suppressHydrationWarning>
                API Endpoint: {origin ? `${origin}/api/collect` : "/api/collect"}
              </p>
            </div>
            <Button onClick={fetchData} disabled={loading} variant="outline" size="lg">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Total Visits: {data.length}
          </Badge>
        </div>

        <div className="space-y-6">
          {data.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No device data collected yet</p>
              </CardContent>
            </Card>
          )}

          {data.map((device, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Visit #{data.length - index}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      {new Date(device.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.location && (
                      <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {device.location.fullLocation || `${device.location.city}, ${device.location.countryCode}`}
                      </Badge>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(device.sessionId)}
                      disabled={!device.sessionId}
                      title={device.sessionId ? `Delete session ${device.sessionId}` : "Session ID missing"}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {device.deviceName && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      Device Information
                    </h3>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Device Name</div>
                      <div className="text-lg font-semibold text-primary">{device.deviceName}</div>
                    </div>
                    {(device.uaModel || device.uaHints?.model || device.uaPlatform || device.uaPlatformVersion) && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <InfoItem label="UA Model" value={device.uaModel || device.uaHints?.model} />
                        <InfoItem label="UA Platform" value={device.uaPlatform} />
                        <InfoItem label="UA Platform Version" value={device.uaPlatformVersion} />
                      </div>
                    )}
                  </div>
                )}

                {device.apiEndpoint && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      API Information
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <InfoItem label="API Endpoint" value={device.apiEndpoint} fullWidth />
                    </div>
                  </div>
                )}

                {/* Device Fingerprint Information section */}
                {device.fingerprint && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Device Fingerprint Information
                      </h3>
                      <div className="space-y-4">
                        {/* Main Fingerprint Data */}
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Visitor ID (Unique Fingerprint)</div>
                            <div className="text-lg font-mono font-semibold text-primary break-all">
                              {device.fingerprint.visitorId}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                              <div className="text-sm font-mono">
                                {(device.fingerprint.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Request ID</div>
                              <div className="text-sm font-mono break-all">{device.fingerprint.requestId}</div>
                            </div>
                          </div>
                        </div>

                        {/* Fingerprint Components */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
                            Fingerprint Components
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <InfoItem
                              label="Timezone"
                              value={device.fingerprint.components.timezone}
                              icon={<Clock className="w-3 h-3" />}
                            />
                            <InfoItem
                              label="Color Depth"
                              value={
                                device.fingerprint.components.colorDepth !== "unknown"
                                  ? `${device.fingerprint.components.colorDepth} bit`
                                  : undefined
                              }
                            />
                            <InfoItem label="Color Gamut" value={device.fingerprint.components.colorGamut} />
                            <InfoItem label="Vendor" value={device.fingerprint.components.vendor} />
                            <InfoItem label="Architecture" value={device.fingerprint.components.architecture} />
                            <InfoItem
                              label="Cookies Enabled"
                              value={device.fingerprint.components.cookiesEnabled ? "Yes" : "No"}
                            />
                            <InfoItem
                              label="Inverted Colors"
                              value={device.fingerprint.components.invertedColors ? "Yes" : "No"}
                            />
                            <InfoItem
                              label="Forced Colors"
                              value={device.fingerprint.components.forcedColors ? "Yes" : "No"}
                            />
                            <InfoItem
                              label="Reduced Motion"
                              value={device.fingerprint.components.reducedMotion ? "Yes" : "No"}
                            />
                            <InfoItem label="HDR Support" value={device.fingerprint.components.hdr ? "Yes" : "No"} />
                            <InfoItem label="Monochrome" value={device.fingerprint.components.monochrome} />
                            <InfoItem label="Contrast" value={device.fingerprint.components.contrast} />
                            <InfoItem label="Apple Pay" value={device.fingerprint.components.applePay} />
                            <InfoItem
                              label="Screen Resolution"
                              value={
                                Array.isArray(device.fingerprint.components.screenResolution)
                                  ? device.fingerprint.components.screenResolution.join("x")
                                  : undefined
                              }
                            />
                            <InfoItem
                              label="Available Screen"
                              value={
                                Array.isArray(device.fingerprint.components.availableScreenResolution)
                                  ? device.fingerprint.components.availableScreenResolution.join("x")
                                  : undefined
                              }
                            />
                          </div>

                          {/* Languages */}
                          {device.fingerprint.components.languages &&
                            device.fingerprint.components.languages.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs text-muted-foreground mb-2">Languages</div>
                                <div className="text-sm font-mono">
                                  {device.fingerprint.components.languages.join(", ")}
                                </div>
                              </div>
                            )}

                          {/* Vendor Flavors */}
                          {device.fingerprint.components.vendorFlavors &&
                            device.fingerprint.components.vendorFlavors.length > 0 && (
                              <div className="mt-4">
                                <div className="text-xs text-muted-foreground mb-2">Vendor Flavors</div>
                                <div className="text-sm font-mono">
                                  {device.fingerprint.components.vendorFlavors.join(", ")}
                                </div>
                              </div>
                            )}

                          {/* Fonts */}
                          {device.fingerprint.components.fonts && device.fingerprint.components.fonts.length > 0 && (
                            <div className="mt-4">
                              <div className="text-xs text-muted-foreground mb-2">
                                Detected Fonts ({device.fingerprint.components.fonts.length})
                              </div>
                              <div className="text-xs font-mono text-muted-foreground max-h-20 overflow-y-auto">
                                {device.fingerprint.components.fonts.slice(0, 20).join(", ")}
                                {device.fingerprint.components.fonts.length > 20 && "..."}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {device.location && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Geographic Location
                      </h3>
                      <Badge variant={device.locationType === "gps-precise" ? "default" : "secondary"}>
                        {device.locationType === "gps-precise" ? "GPS Precise" : "IP-Based Approximate"}
                      </Badge>
                    </div>
                    <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Full Location</div>
                      <div className="text-lg font-semibold text-primary">
                        {device.location.fullLocation ||
                          `${device.location.country || "-"} / ${device.location.region || "-"} / ${device.location.city || "-"}`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                      <InfoItem label="IP Address" value={device.location.ip || "-"} />
                      <InfoItem label="City" value={device.location.city || "-"} />
                      <InfoItem label="Region" value={device.location.region || "-"} />
                      <InfoItem label="Region Code" value={device.location.regionCode || "-"} />
                      <InfoItem label="Country" value={device.location.country || "-"} />
                      <InfoItem label="Country Code" value={device.location.countryCode || "-"} />
                      <InfoItem label="Country Capital" value={device.location.countryCapital || "-"} />
                      <InfoItem label="Continent" value={device.location.continentCode || "-"} />
                      <InfoItem label="Postal Code" value={device.location.postal || "-"} />
                      <InfoItem
                        label="Coordinates"
                        value={
                          device.location.latitude && device.location.longitude
                            ? `${device.location.latitude.toFixed(4)}, ${device.location.longitude.toFixed(4)}`
                            : "-"
                        }
                      />
                      <InfoItem label="ISP" value={device.location.isp || "-"} icon={<Wifi className="w-3 h-3" />} />
                      <InfoItem label="ASN" value={device.location.asn || "-"} />
                      <InfoItem label="Location Timezone" value={device.location.timezone || "-"} />
                      <div className="col-span-full">
                        <div className="text-xs text-muted-foreground mb-1">Location Link</div>
                        {device.location.latitude && device.location.longitude ? (
                          <a
                            href={buildGoogleMapsUrl(device.location.latitude, device.location.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-primary hover:underline break-all"
                          >
                            {buildGoogleMapsUrl(device.location.latitude, device.location.longitude)}
                          </a>
                        ) : (
                          <div className="text-sm font-mono">-</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {device.gpsLocation && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Precise GPS Location (User Consented)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <InfoItem
                          label="Latitude"
                          value={device.gpsLocation.latitude.toFixed(6)}
                          icon={<MapPin className="w-3 h-3" />}
                        />
                        <InfoItem
                          label="Longitude"
                          value={device.gpsLocation.longitude.toFixed(6)}
                          icon={<MapPin className="w-3 h-3" />}
                        />
                        <InfoItem label="Accuracy" value={`±${device.gpsLocation.accuracy.toFixed(2)}m`} />
                        <InfoItem
                          label="Altitude"
                          value={
                            device.gpsLocation.altitude !== null ? `${device.gpsLocation.altitude.toFixed(2)}m` : "-"
                          }
                        />
                        <InfoItem
                          label="Altitude Accuracy"
                          value={
                            device.gpsLocation.altitudeAccuracy !== null
                              ? `±${device.gpsLocation.altitudeAccuracy.toFixed(2)}m`
                              : "-"
                          }
                        />
                        <InfoItem
                          label="Heading"
                          value={
                            device.gpsLocation.heading !== null ? `${device.gpsLocation.heading.toFixed(2)}°` : "-"
                          }
                        />
                        <InfoItem
                          label="Speed"
                          value={device.gpsLocation.speed !== null ? `${device.gpsLocation.speed.toFixed(2)} m/s` : "-"}
                        />
                        <div className="col-span-full">
                          <div className="text-xs text-muted-foreground mb-1">Location Link</div>
                          <a
                            href={buildGoogleMapsUrl(device.gpsLocation.latitude, device.gpsLocation.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-primary hover:underline break-all"
                          >
                            {buildGoogleMapsUrl(device.gpsLocation.latitude, device.gpsLocation.longitude)}
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Hardware Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Hardware Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <InfoItem
                      label="CPU Cores"
                      value={device.hardwareConcurrency !== undefined ? device.hardwareConcurrency : undefined}
                      icon={<Cpu className="w-3 h-3" />}
                    />
                    <InfoItem
                      label="Device Memory"
                      value={
                        device.deviceMemory !== undefined && device.deviceMemory !== "unknown"
                          ? `${device.deviceMemory} GB`
                          : undefined
                      }
                      icon={<HardDrive className="w-3 h-3" />}
                    />
                    <InfoItem
                      label="Max Touch Points"
                      value={device.maxTouchPoints !== undefined ? device.maxTouchPoints : undefined}
                    />
                    <InfoItem
                      label="Touch Support"
                      value={device.touchSupport !== undefined ? (device.touchSupport ? "Yes" : "No") : undefined}
                      icon={device.touchSupport ? <Plug className="w-3 h-3" /> : undefined}
                    />
                  </div>
                </div>

                {/* Battery Section */}
                {device.battery && typeof device.battery === "object" && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Battery className="w-4 h-4 text-primary" />
                        Battery Status
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                        <InfoItem label="Battery Level" value={`${device.battery.level}%`} />
                        <InfoItem
                          label="Charging"
                          value={device.battery.charging ? "Yes" : "No"}
                          icon={device.battery.charging ? <Plug className="w-3 h-3" /> : undefined}
                        />
                        <InfoItem
                          label="Charging Time"
                          value={
                            device.battery.chargingTime === Number.POSITIVE_INFINITY
                              ? "N/A"
                              : `${device.battery.chargingTime}s`
                          }
                        />
                        <InfoItem
                          label="Discharging Time"
                          value={
                            device.battery.dischargingTime === Number.POSITIVE_INFINITY
                              ? "N/A"
                              : `${device.battery.dischargingTime}s`
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Display Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    Display & Screen
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <InfoItem
                      label="Screen Resolution"
                      value={device.screenResolution !== undefined ? device.screenResolution : undefined}
                    />
                    <InfoItem
                      label="Available Screen"
                      value={device.availableScreenSize !== undefined ? device.availableScreenSize : undefined}
                    />
                    <InfoItem
                      label="Window Size"
                      value={device.windowSize !== undefined ? device.windowSize : undefined}
                    />
                    <InfoItem
                      label="Color Depth"
                      value={device.colorDepth !== undefined ? `${device.colorDepth} bit` : undefined}
                    />
                    <InfoItem
                      label="Pixel Depth"
                      value={device.pixelDepth !== undefined ? `${device.pixelDepth} bit` : undefined}
                    />
                    <InfoItem
                      label="Pixel Ratio"
                      value={device.pixelRatio !== undefined ? `${device.pixelRatio}x` : undefined}
                    />
                    <InfoItem
                      label="Orientation"
                      value={device.orientation !== undefined ? device.orientation : undefined}
                    />
                  </div>
                </div>

                {/* Connection Section */}
                {device.connection && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-primary" />
                        Network Connection
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                        <InfoItem label="Effective Type" value={device.connection.effectiveType} />
                        <InfoItem label="Downlink" value={`${device.connection.downlink} Mbps`} />
                        <InfoItem label="RTT" value={`${device.connection.rtt} ms`} />
                        <InfoItem label="Save Data" value={device.connection.saveData ? "Enabled" : "Disabled"} />
                        <InfoItem label="Connection Type" value={device.connection.type || "Unknown"} />
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Browser Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Browser Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <InfoItem label="Platform" value={device.platform !== undefined ? device.platform : undefined} />
                    <InfoItem label="Language" value={device.language !== undefined ? device.language : undefined} />
                    <InfoItem
                      label="Cookies Enabled"
                      value={device.cookiesEnabled !== undefined ? (device.cookiesEnabled ? "Yes" : "No") : undefined}
                    />
                    <InfoItem
                      label="Do Not Track"
                      value={device.doNotTrack !== undefined ? device.doNotTrack : undefined}
                    />
                    <InfoItem
                      label="Online Status"
                      value={
                        device.onlineStatus !== undefined ? (device.onlineStatus ? "Online" : "Offline") : undefined
                      }
                    />
                    <InfoItem
                      label="PDF Viewer"
                      value={
                        device.pdfViewerEnabled !== undefined
                          ? device.pdfViewerEnabled
                            ? "Enabled"
                            : "Disabled"
                          : undefined
                      }
                    />
                    <InfoItem
                      label="Browser Timezone"
                      value={device.timezone !== undefined ? device.timezone : undefined}
                    />
                    <InfoItem
                      label="Timezone Offset"
                      value={device.timezoneOffset !== undefined ? `${device.timezoneOffset} min` : undefined}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <InfoItem
                      label="User Agent"
                      value={device.userAgent !== undefined ? device.userAgent : undefined}
                      fullWidth
                    />
                  </div>
                </div>

                <Separator />

                {/* Storage Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Storage Capabilities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <InfoItem
                      label="Local Storage"
                      value={
                        device.localStorage !== undefined
                          ? device.localStorage
                            ? "Available"
                            : "Unavailable"
                          : undefined
                      }
                    />
                    <InfoItem
                      label="Session Storage"
                      value={
                        device.sessionStorage !== undefined
                          ? device.sessionStorage
                            ? "Available"
                            : "Unavailable"
                          : undefined
                      }
                    />
                    <InfoItem
                      label="IndexedDB"
                      value={
                        device.indexedDB !== undefined ? (device.indexedDB ? "Available" : "Unavailable") : undefined
                      }
                    />
                    <InfoItem
                      label="Permissions API"
                      value={
                        device.permissionsAPI !== undefined
                          ? device.permissionsAPI
                            ? "Available"
                            : "Unavailable"
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* WebGL Section */}
                {device.webgl && typeof device.webgl === "object" && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        WebGL Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <InfoItem label="Vendor" value={device.webgl.vendor} />
                        <InfoItem label="Renderer" value={device.webgl.renderer} />
                        <InfoItem label="Version" value={device.webgl.version} />
                        <InfoItem label="Shading Language" value={device.webgl.shadingLanguageVersion} />
                      </div>
                    </div>
                  </>
                )}

                {/* Canvas Fingerprint Section */}
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    Canvas Fingerprint Hash
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <InfoItem label="Canvas Fingerprint Hash" value={device.canvasFingerprint} fullWidth />
                  </div>
                </div>

                {/* Plugins Section */}
                {device.plugins && device.plugins.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Plugins</h3>
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        {device.plugins.map((plugin, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-mono font-semibold">{plugin.name}</span>
                            {plugin.description && (
                              <span className="text-muted-foreground ml-2">- {plugin.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Referrer Section */}
                {device.referrer && device.referrer !== "Direct" && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Referrer</h3>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <InfoItem label="Referrer URL" value={device.referrer} fullWidth />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoItem({
  label,
  value,
  icon,
  fullWidth = false,
}: {
  label: string
  value: string | number | boolean | null | undefined
  icon?: React.ReactNode
  fullWidth?: boolean
}) {
  // Convert value to string, handling null/undefined
  const displayValue = value === null || value === undefined || value === "" ? "-" : String(value)

  return (
    <div className={`space-y-1 ${fullWidth ? "col-span-full" : ""}`}>
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-mono break-all">{displayValue}</div>
    </div>
  )
}
