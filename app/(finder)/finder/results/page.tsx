"use client"

import { searchPhysiciansAction } from "@/actions/db/physicians-actions"
import { ResultsList } from "@/components/finder/results-list"
import { SearchBar } from "@/components/finder/search-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectPhysician } from "@/db/schema"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { ActionState } from "@/types"
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Heart,
  List,
  MapIcon,
  SlidersHorizontal
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useMediaQuery } from "@/lib/hooks/use-media-query"

// Placeholder for CollapsibleFilters component
const CollapsibleFiltersPlaceholder = ({
  isCollapsed,
  onToggle
}: {
  isCollapsed: boolean
  onToggle: () => void
}) => (
  <>
    {/* Mobile Collapsible */}
    <div className="lg:hidden">
      <Collapsible open={!isCollapsed} onOpenChange={open => onToggle()}>
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
              className={`size-4 transition-transform ${!isCollapsed ? "rotate-90" : ""}`}
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
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
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
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  </>
)

// Placeholder for ResultsMap component
const ResultsMapPlaceholder = () => (
  <div className="bg-muted flex h-[calc(100vh-200px)] w-full items-center justify-center rounded-lg border">
    <p className="text-muted-foreground">Map View Coming Soon</p>
  </div>
)

// Helper component to render results content
function ResultsContent() {
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const query = searchParams.get("query") || ""
  const location = searchParams.get("location") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const initialView = searchParams.get("view") || (!isMobile ? "split" : "list") // Default to split on desktop

  const [physicians, setPhysicians] = useState<SelectPhysician[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"list" | "map" | "split">(initialView as any)
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true)

  // Only adjust view on initial load or when switching between mobile/desktop
  useEffect(() => {
    if (isMobile && view === "split") {
      setView("list")
    } else if (!isMobile && !view) {
      setView("split")
    }
  }, [isMobile]) // Only run when mobile status changes

  // Fetch results when search params change
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)
      setPhysicians([])

      const result: ActionState<any> = await searchPhysiciansAction({
        query: query,
        filters: {
          ...(location && location.match(/^\d{5}$/)
            ? { zip: location }
            : location
              ? { state: location }
              : {})
        },
        page: currentPage
      })

      if (result.isSuccess) {
        setPhysicians(result.data.physicians)
        setTotalCount(result.data.totalCount)
        setTotalPages(result.data.totalPages)
        setCurrentPage(result.data.currentPage)
      } else {
        setError(result.message)
        setPhysicians([])
        setTotalCount(0)
        setTotalPages(0)
      }
      setIsLoading(false)
    }

    fetchResults()
  }, [query, location, currentPage])

  // Calculate result range display
  const resultsPerPage = 10
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = Math.min(startIndex + resultsPerPage, totalCount)

  // Mock related searches
  const relatedSearches = ["Cardiologists nearby", "Heart doctors", "Top rated"]

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filters Sidebar */}
      <div className="w-full shrink-0 lg:w-64">
        <CollapsibleFiltersPlaceholder
          isCollapsed={isFiltersCollapsed}
          onToggle={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
        />
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
          {query && (
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
          {!isLoading && !error && (
            <div className="text-muted-foreground text-sm">
              Showing {totalCount > 0 ? startIndex + 1 : 0}-
              {Math.min(endIndex, totalCount)} of {totalCount} results
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="size-20 rounded-md" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4 text-center">
              <p>Error loading results: {error}</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Results Views */}
          {!isLoading && !error && (
            <>
              {view === "list" && (
                <ResultsList physicians={physicians} totalCount={totalCount} />
              )}
              {view === "map" && <ResultsMapPlaceholder />}
              {view === "split" && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto">
                    <h3 className="mb-2 font-medium">Provider List</h3>
                    <ResultsList
                      physicians={physicians}
                      totalCount={totalCount}
                    />
                  </div>
                  <div className="sticky top-4">
                    <h3 className="mb-2 font-medium">Map View</h3>
                    <ResultsMapPlaceholder />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    alert(`Go to page ${currentPage - 1} (coming soon)`)
                  }
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="size-8">
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    alert(`Go to page ${currentPage + 1} (coming soon)`)
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
  )
}

// Main page component using Suspense for search params
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsPageSkeleton />}>
      <ResultsPageContent />
    </Suspense>
  )
}

// Separate component to access searchParams safely within Suspense boundary
function ResultsPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const location = searchParams.get("location") || ""

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <SearchBar initialQuery={query} initialLocation={location} />
      </div>
      <ResultsContent />
    </div>
  )
}

// Skeleton loader for the entire results page
function ResultsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mb-8 space-y-4 md:flex md:gap-2 md:space-y-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full md:w-24" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-64">
          <Skeleton className="h-64 w-full rounded-lg border" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-48" />
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="size-20 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Skeleton className="mx-auto h-9 w-48" />
        </div>
      </div>
    </div>
  )
}
