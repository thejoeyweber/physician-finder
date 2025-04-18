"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Locate } from "lucide-react"

interface SearchBarProps {
  initialQuery?: string
  initialLocation?: string
}

export function SearchBar({
  initialQuery = "",
  initialLocation = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [isLocating, setIsLocating] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set("query", query.trim())
    if (location.trim()) params.set("location", location.trim())

    router.push(`/finder/results?${params.toString()}`)
  }

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        position => {
          // For now, just set a placeholder text
          setLocation("Current Location")
          setIsLocating(false)
          console.log(
            "Geolocation success:",
            position.coords.latitude,
            position.coords.longitude
          )
        },
        error => {
          console.error("Error getting location:", error)
          alert(`Error getting location: ${error.message}`)
          setLocation("")
          setIsLocating(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:flex md:items-center md:gap-2 md:space-y-0"
      aria-label="Find healthcare providers"
    >
      {/* Name/Specialty/Condition/Procedure Input */}
      <div className="relative flex-1">
        <label htmlFor="search-query" className="sr-only">
          Search by Name, Specialty, Condition, or Procedure
        </label>
        <Search
          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          id="search-query"
          type="text"
          placeholder="Name, Specialty, Condition..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      {/* Location Input */}
      <div className="relative flex-1">
        <label htmlFor="search-location" className="sr-only">
          Search by City or ZIP Code
        </label>
        <MapPin
          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          id="search-location"
          type="text"
          placeholder="City or ZIP Code"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full pl-10 pr-32"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-8 -translate-y-1/2 gap-1 px-2 text-xs"
          onClick={useCurrentLocation}
          disabled={isLocating}
          aria-label="Use my current location"
        >
          <Locate className="size-3" />
          {isLocating ? "Locating..." : "Use Current Location"}
        </Button>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full md:w-auto">
        <Search className="mr-2 size-4 md:hidden" />
        Search
      </Button>
    </form>
  )
}
