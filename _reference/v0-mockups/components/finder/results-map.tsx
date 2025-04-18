"use client"

import { useEffect, useRef } from "react"
import type { Physician } from "@/lib/types"

interface ResultsMapProps {
  physicians: Physician[]
}

export function ResultsMap({ physicians }: ResultsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Mapbox, Google Maps, or Leaflet
    if (mapRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a simple map background
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some roads
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3

        // Horizontal roads
        for (let y = 50; y < canvas.height; y += 100) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        // Vertical roads
        for (let x = 50; x < canvas.width; x += 100) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        // Draw pins for each physician
        physicians.forEach((physician, index) => {
          // Calculate a position based on the index (in a real app, this would be based on geocoded coordinates)
          const x = 50 + ((index * 70) % (canvas.width - 100))
          const y = 50 + Math.floor((index * 70) / (canvas.width - 100)) * 70

          // Draw pin
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()

          // Draw pin shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
          ctx.beginPath()
          ctx.ellipse(x, y + 12, 8, 3, 0, 0, Math.PI * 2)
          ctx.fill()

          // Draw label
          ctx.fillStyle = "#000000"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`Dr. ${physician.name.split(" ")[1]}`, x, y + 25)
        })

        // Add a "Map data placeholder" text
        ctx.fillStyle = "#999999"
        ctx.font = "12px Arial"
        ctx.textAlign = "right"
        ctx.fillText(
          "Map data placeholder © 2025",
          canvas.width - 10,
          canvas.height - 10
        )
      }

      return () => {
        if (mapRef.current && canvas.parentNode === mapRef.current) {
          mapRef.current.removeChild(canvas)
        }
      }
    }
  }, [physicians])

  return (
    <div className="bg-muted/30 relative h-[500px] w-full" ref={mapRef}>
      <div className="absolute left-4 top-4 z-10 rounded-md bg-white p-2 shadow-md">
        <h3 className="text-sm font-medium">Map View</h3>
        <p className="text-muted-foreground text-xs">
          Showing {physicians.length} providers
        </p>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md">
          <button className="hover:bg-muted rounded p-1">+</button>
          <button className="hover:bg-muted rounded p-1">−</button>
        </div>
      </div>
    </div>
  )
}
