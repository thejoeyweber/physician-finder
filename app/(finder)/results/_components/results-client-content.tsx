"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultsList } from "@/components/finder/results-list"
import { SearchBar } from "@/components/finder/search-bar"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { SelectPhysician } from "@/db/schema"
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Heart,
  List,
  MapIcon,
  SlidersHorizontal
} from "lucide-react"
import { useState } from "react"

interface ResultsClientContentProps {
  initialData: {
    physicians: SelectPhysician[]
    totalCount: number
    totalPages: number
    currentPage: number
  }
  searchParams: {
    query: string
    location: string
    view?: string
  }
}

// Placeholder for ResultsMap component
const ResultsMapPlaceholder = () => (
  <div className="bg-muted flex h-[calc(100vh-200px)] w-full items-center justify-center rounded-lg border">
    <p className="text-muted-foreground">Map View Coming Soon</p>
  </div>
)

export function ResultsClientContent({
  initialData,
  searchParams
}: ResultsClientContentProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const initialView = searchParams.view || (!isMobile ? "split" : "list")

  const [view, setView] = useState<"list" | "map" | "split">(initialView as any)
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true)

  // Calculate result range display
  const resultsPerPage = 10
  const startIndex = (initialData.currentPage - 1) * resultsPerPage
  const endIndex = Math.min(startIndex + resultsPerPage, initialData.totalCount)

  // Mock related searches
  const relatedSearches = ["Cardiologists nearby", "Heart doctors", "Top rated"]

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <SearchBar
          initialQuery={searchParams.query}
          initialLocation={searchParams.location}
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full shrink-0 lg:w-64">
          {/* Mobile Collapsible */}
          <div className="lg:hidden">
            <Collapsible
              open={!isFiltersCollapsed}
              onOpenChange={open => setIsFiltersCollapsed(!open)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-2 flex w-full items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </span>
                  <ChevronRight
                    className={`size-4 transition-transform ${
                      !isFiltersCollapsed ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="w-full rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <SlidersHorizontal className="size-4" /> Filters
                    </h2>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Reset
                    </Button>
                  </div>
                  {/* Filter content will go here */}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="w-full rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <SlidersHorizontal className="size-4" /> Filters
                </h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Reset
                </Button>
              </div>
              {/* Filter content will go here */}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            {/* Top Controls: View Toggle, Favorites, Sorting */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              {/* View Toggles */}
              <Tabs
                value={view}
                onValueChange={v => setView(v as "list" | "map" | "split")}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="size-4" /> List
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-1">
                    <MapIcon className="size-4" /> Map
                  </TabsTrigger>
                  {!isMobile && (
                    <TabsTrigger
                      value="split"
                      className="flex items-center gap-1"
                    >
                      <ArrowLeftRight className="size-4" /> Split
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => alert("Favorites functionality coming soon!")}
                >
                  <Heart className="size-4" /> Favorites
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => alert("Sorting functionality coming soon!")}
                >
                  Sort by: Best Match <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            {/* Related Searches */}
            {searchParams.query && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Related searches:</span>
                {relatedSearches.map((related, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => alert(`Search for: ${related}`)}
                  >
                    {related}
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="text-muted-foreground text-sm">
              Showing {initialData.totalCount > 0 ? startIndex + 1 : 0}-
              {Math.min(endIndex, initialData.totalCount)} of{" "}
              {initialData.totalCount} results
            </div>

            {/* Results Views */}
            {view === "list" && (
              <ResultsList
                physicians={initialData.physicians}
                totalCount={initialData.totalCount}
              />
            )}
            {view === "map" && <ResultsMapPlaceholder />}
            {view === "split" && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto">
                  <h3 className="mb-2 font-medium">Provider List</h3>
                  <ResultsList
                    physicians={initialData.physicians}
                    totalCount={initialData.totalCount}
                  />
                </div>
                <div className="sticky top-4">
                  <h3 className="mb-2 font-medium">Map View</h3>
                  <ResultsMapPlaceholder />
                </div>
              </div>
            )}

            {/* Pagination */}
            {initialData.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={initialData.currentPage <= 1}
                    onClick={() =>
                      alert(
                        `Go to page ${initialData.currentPage - 1} (coming soon)`
                      )
                    }
                  >
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="size-8">
                    {initialData.currentPage}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={initialData.currentPage >= initialData.totalPages}
                    onClick={() =>
                      alert(
                        `Go to page ${initialData.currentPage + 1} (coming soon)`
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
