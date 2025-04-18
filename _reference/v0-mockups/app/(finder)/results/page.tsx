"use client"

import { useState, useEffect } from "react"
import { ResultsList } from "@/components/finder/results-list"
import { SearchBar } from "@/components/finder/search-bar"
import { searchPhysicians } from "@/lib/actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  List,
  MapIcon,
  ChevronDown,
  Heart,
  ArrowLeftRight,
  Maximize2,
  Minimize2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ResultsMap } from "@/components/finder/results-map"
import { CollapsibleFilters } from "@/components/finder/collapsible-filters"
import { ResourceToast } from "@/components/finder/resource-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ResultsPageProps {
  searchParams?: {
    name?: string
    location?: string
    specialty?: string
    condition?: string
    procedure?: string
    page?: string
    sort?: string
    view?: string
  }
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const name =
    searchParams?.name ||
    searchParams?.specialty ||
    searchParams?.condition ||
    searchParams?.procedure ||
    ""
  const location = searchParams?.location || ""
  const page = Number.parseInt(searchParams?.page || "1")
  const sort = searchParams?.sort || "best_match"
  const initialView = searchParams?.view || "list"

  const [results, setResults] = useState<any[]>([])
  const [view, setView] = useState<"list" | "map" | "split">(initialView as any)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [isListExpanded, setIsListExpanded] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Set default view based on screen size
  useEffect(() => {
    if (isDesktop && view !== "split") {
      setView("split")
    } else if (!isDesktop && view === "split") {
      setView("list")
    }
  }, [isDesktop, view])

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      const data = await searchPhysicians(name, location)
      setResults(data)
    }

    fetchResults()
  }, [name, location])

  // Calculate total pages (assuming 10 per page)
  const totalResults = results.length
  const resultsPerPage = 10
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  // Get current page results
  const startIndex = (page - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentPageResults = results.slice(startIndex, endIndex)

  // Toggle expanded states
  const toggleMapExpanded = () => {
    if (view === "split") {
      setIsMapExpanded(!isMapExpanded)
      setIsListExpanded(false)
    }
  }

  const toggleListExpanded = () => {
    if (view === "split") {
      setIsListExpanded(!isListExpanded)
      setIsMapExpanded(false)
    }
  }

  // Reset expanded states when view changes
  useEffect(() => {
    setIsMapExpanded(false)
    setIsListExpanded(false)
  }, [view])

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Healthcare Providers
        </h1>
        <SearchBar initialName={name} initialLocation={location} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <div className="w-full shrink-0 lg:w-64">
          <CollapsibleFilters />
        </div>

        {/* Results area */}
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            {/* View toggle and sorting */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Tabs
                  value={view}
                  onValueChange={v => setView(v as "list" | "map" | "split")}
                  className="w-full sm:w-auto"
                >
                  <TabsList>
                    <TabsTrigger
                      value="list"
                      className="flex items-center gap-1"
                    >
                      <List className="size-4" /> List
                    </TabsTrigger>
                    <TabsTrigger
                      value="map"
                      className="flex items-center gap-1"
                    >
                      <MapIcon className="size-4" /> Map
                    </TabsTrigger>
                    {isDesktop && (
                      <TabsTrigger
                        value="split"
                        className="flex items-center gap-1"
                      >
                        <ArrowLeftRight className="size-4" /> Split
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Heart className="size-4" /> Favorites
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto flex items-center gap-1 sm:ml-0"
                >
                  Sort by: {getSortLabel(sort)}{" "}
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            {/* Related searches */}
            {name && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Related searches:</span>
                {getRelatedSearches(name).map((related, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-muted cursor-pointer"
                  >
                    {related}
                  </Badge>
                ))}
              </div>
            )}

            {/* Results count */}
            <div className="text-muted-foreground text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of{" "}
              {totalResults} results
            </div>

            {/* Results views */}
            {view === "list" && (
              <div className="space-y-4">
                <ResultsList physicians={currentPageResults} />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setView("map")}
                    className="flex items-center gap-2"
                  >
                    <MapIcon className="size-4" /> Show Map View
                  </Button>
                </div>
              </div>
            )}

            {view === "map" && (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border">
                  <ResultsMap physicians={results} />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setView("list")}
                    className="flex items-center gap-2"
                  >
                    <List className="size-4" /> Show List View
                  </Button>
                </div>
              </div>
            )}

            {view === "split" && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* List section */}
                <div
                  className={`${isMapExpanded ? "hidden" : isListExpanded ? "lg:col-span-2" : ""}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">Provider List</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleListExpanded}
                      className="size-8 p-0"
                    >
                      {isListExpanded ? (
                        <Minimize2 className="size-4" />
                      ) : (
                        <Maximize2 className="size-4" />
                      )}
                    </Button>
                  </div>
                  <ResultsList physicians={currentPageResults} />
                </div>

                {/* Map section */}
                <div
                  className={`${isListExpanded ? "hidden" : isMapExpanded ? "lg:col-span-2" : ""}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">Map View</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMapExpanded}
                      className="size-8 p-0"
                    >
                      {isMapExpanded ? (
                        <Minimize2 className="size-4" />
                      ) : (
                        <Maximize2 className="size-4" />
                      )}
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border">
                    <ResultsMap physicians={results} />
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => {
                      /* Navigation logic would go here */
                    }}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      className="size-8"
                    >
                      {i + 1}
                    </Button>
                  ))}

                  {totalPages > 5 && <span className="px-2">...</span>}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => {
                      /* Navigation logic would go here */
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resource Toast */}
      <ResourceToast specialty={name} condition={name} />
    </div>
  )
}

// Helper functions
function getSortLabel(sort: string): string {
  const sortOptions: Record<string, string> = {
    best_match: "Best Match",
    distance: "Distance",
    rating: "Highest Rated",
    availability: "Soonest Available",
    name_asc: "Name (A-Z)",
    name_desc: "Name (Z-A)"
  }
  return sortOptions[sort] || "Best Match"
}

function getRelatedSearches(query: string): string[] {
  // This would typically be generated based on the search query
  // For now, we'll return some static examples
  if (query.toLowerCase().includes("cardio")) {
    return [
      "Cardiologists",
      "Heart Specialists",
      "Cardiac Surgeons",
      "Heart Disease"
    ]
  } else if (query.toLowerCase().includes("pedia")) {
    return [
      "Pediatricians",
      "Child Specialists",
      "Family Doctors",
      "Pediatric Dentists"
    ]
  } else if (query.toLowerCase().includes("diabet")) {
    return [
      "Endocrinologists",
      "Diabetes Specialists",
      "Nutritionists",
      "Diabetes Educators"
    ]
  }

  return ["Primary Care", "Specialists", "Telehealth Providers", "Urgent Care"]
}
