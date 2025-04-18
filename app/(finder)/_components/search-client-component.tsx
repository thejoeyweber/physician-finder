"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchClientComponent(): JSX.Element {
  const router = useRouter()
  const [query, setQuery] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search by name, specialty, or location..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-2 size-4" />
          Search
        </Button>
      </div>
    </form>
  )
}
