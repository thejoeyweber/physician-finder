"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Locate } from "lucide-react"

interface SearchBarProps {
  initialName?: string
  initialLocation?: string
}

export function SearchBar({
  initialName = "",
  initialLocation = ""
}: SearchBarProps) {
  const [name, setName] = useState(initialName)
  const [location, setLocation] = useState(initialLocation)
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Build query string
    const params = new URLSearchParams()
    if (name) params.set("name", name)
    if (location) params.set("location", location)

    // Navigate to search results
    router.push(`/results?${params.toString()}`)
  }

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // In a real app, we would convert coordinates to a city/zip
          // For now, just set a placeholder
          setLocation("Current Location")
        },
        error => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:flex md:gap-4 md:space-y-0"
    >
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Name, Specialty, Condition, or Procedure"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="City or ZIP Code"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full pl-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 h-7 -translate-y-1/2 text-xs"
          onClick={useCurrentLocation}
        >
          <Locate className="mr-1 size-3" /> Current Location
        </Button>
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Search
      </Button>
    </form>
  )
}
