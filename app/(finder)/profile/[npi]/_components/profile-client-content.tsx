"use client"

import * as React from "react"
import { Share, Heart, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { SelectPhysician } from "@/db/schema"
import {
  getMockMetrics,
  getMockRatings,
  getMockReviews,
  getMockEnrichment,
  isMockData,
  isMockMetric,
  getMockDataLabel
} from "@/lib/mock-data-utils"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { GraduationCap, Star, Check } from "lucide-react"

interface ProfileClientContentProps {
  physician: SelectPhysician
  error?: string
}

export function ProfileClientContent({
  physician,
  error
}: ProfileClientContentProps) {
  if (error) {
    return (
      <div className="bg-muted/30 rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Dr. ${physician.lastName}'s Profile`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Profile link copied to clipboard")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share profile")
    }
  }

  const handlePrint = () => {
    try {
      window.print()
    } catch (error) {
      console.error("Error printing:", error)
      toast.error("Failed to print profile")
    }
  }

  const handleFavorite = () => {
    // TODO: Implement favorite functionality
    toast.info("Favorite feature coming soon")
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share className="size-4" />
        <span className="sr-only">Share Profile</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleFavorite}>
        <Heart className="size-4" />
        <span className="sr-only">Add to Favorites</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handlePrint}>
        <Printer className="size-4" />
        <span className="sr-only">Print Profile</span>
      </Button>
    </div>
  )
}

interface ProfileDataProps {
  physician: SelectPhysician
}

export function ProfileData({ physician }: ProfileDataProps) {
  // Get mock data using utilities
  const mockMetrics = getMockMetrics(physician)
  const mockRatingsSummary = getMockRatings(physician)
  const mockPatientReviews = getMockReviews(physician)
  const mockEnrichment = getMockEnrichment(physician)

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2">
        <GraduationCap className="text-muted-foreground size-4" />
        <span className="text-muted-foreground">
          {mockMetrics.yearsExperience} years experience
          {isMockMetric("yearsExperience") && (
            <MockDataIndicator field="yearsExperience" />
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="text-muted-foreground size-4" />
        <span className="text-muted-foreground">
          {mockMetrics.rating} ({mockMetrics.reviewCount} reviews)
          {isMockMetric("rating") && <MockDataIndicator field="rating" />}
        </span>
      </div>
      {mockMetrics.acceptingNewPatients && (
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-500" />
          <span className="text-muted-foreground">
            Accepting new patients
            {isMockMetric("acceptingNewPatients") && (
              <MockDataIndicator field="acceptingNewPatients" />
            )}
          </span>
        </div>
      )}
    </div>
  )
}

// Export mock data for use in other components
export function useMockData(physician: SelectPhysician) {
  return {
    metrics: getMockMetrics(physician),
    ratings: getMockRatings(physician),
    reviews: getMockReviews(physician),
    enrichment: getMockEnrichment(physician),
    isMockData,
    isMockMetric
  }
}
