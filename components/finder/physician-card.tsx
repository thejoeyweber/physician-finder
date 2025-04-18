/**
 * @description
 * Displays a summary card for a single physician in search results.
 * It shows key information like name, specialty, location, and provides links/buttons
 * for viewing the full profile, scheduling (placeholder), and saving to favorites (placeholder).
 * Uses data from the `SelectPhysician` type and incorporates mock data for fields
 * not yet available in the initial phase.
 *
 * @component
 * @param {PhysicianCardProps} props - Props containing the physician data.
 * @returns {JSX.Element} The rendered physician card component.
 *
 * @dependencies
 * - react: Core React library.
 * - next/link: For client-side navigation to the profile page.
 * - next/image: For displaying the physician's placeholder image.
 * - lucide-react: For icons (Star, MapPin, Phone, Calendar, Clock, Check).
 * - @/components/ui/card: Card layout components.
 * - @/components/ui/badge: Badge component for displaying specialty and features.
 * - @/components/ui/button: Button component for actions.
 * - @/db/schema: Provides the `SelectPhysician` type definition.
 * - @/lib/mock-data: Provides centralized mock data.
 *
 * @notes
 * - This component uses `"use client"` because it includes interactive elements (buttons with onClick).
 * - Mock data is used for: image, years experience, rating, review count, phone number, availability badges.
 * - Functionality for "Schedule" and "Save to favorites" buttons is deferred.
 * - Assumes the physician has a primary address and phone number for displaying location.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Star,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Check,
  Briefcase
} from "lucide-react"
import type { SelectPhysician } from "@/db/schema"
import {
  mockYearsExperience,
  mockRating,
  mockReviewCount,
  mockAcceptingNewPatients,
  mockOffersTelehealth
} from "@/lib/mock-data"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"

interface PhysicianCardProps {
  /** The physician data object conforming to the SelectPhysician type. */
  physician: SelectPhysician
}

export function PhysicianCard({ physician }: PhysicianCardProps): JSX.Element {
  // --- Event Handlers ---
  const handleSaveFavorite = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent link navigation if inside a link wrapper
    // TODO: Implement save to favorites functionality (Step 22)
    console.log("Save to favorites clicked for NPI:", physician.npi)
    alert("Save to favorites functionality not yet implemented.")
  }

  const handleSchedule = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    // TODO: Implement scheduling functionality (Future Phase)
    console.log("Schedule clicked for NPI:", physician.npi)
    alert("Scheduling functionality not yet implemented.")
  }

  // --- Render Logic ---
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Physician Image (Placeholder) */}
          <div className="bg-muted relative hidden size-20 shrink-0 overflow-hidden rounded-md sm:block">
            <Image
              src="/placeholder.svg"
              alt={`Placeholder image for ${physician.firstName} ${physician.lastName}`}
              fill
              className="object-cover"
              priority={false} // Optimization: Only prioritize above-the-fold images
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              {/* Name, Specialty, Rating, Location */}
              <div>
                <Link href={`/profile/${physician.npi}`}>
                  <CardTitle className="mb-1 hover:underline">
                    {/* Display name, handling potential nulls */}
                    {`${physician.firstName || ""} ${physician.lastName || ""}`.trim() ||
                      "Unnamed Provider"}{" "}
                    {physician.suffix}
                  </CardTitle>
                </Link>
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {/* Primary Specialty */}
                  {physician.taxonomyDescription && (
                    <Badge variant="secondary">
                      {physician.taxonomyDescription}
                    </Badge>
                  )}
                  {/* Years Experience */}
                  <div className="flex items-center gap-1">
                    <Briefcase className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      {mockYearsExperience} years experience
                      <MockDataIndicator field="yearsExperience" />
                    </span>
                  </div>
                </div>
                {/* Rating */}
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(mockRating)
                            ? "fill-primary text-primary" // Use primary color for filled stars
                            : "text-muted" // Use muted color for empty stars
                        }`}
                        aria-hidden="true" // Hide decorative stars from screen readers
                      />
                    ))}
                  </div>
                  <span
                    className="ml-1 text-sm"
                    aria-label={`Rating: ${mockRating} out of 5 stars`}
                  >
                    {mockRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({mockReviewCount} reviews)
                  </span>
                </div>
                {/* Location and Phone */}
                <div className="text-muted-foreground flex flex-col gap-x-2 gap-y-1 text-sm sm:flex-row sm:items-center">
                  {/* Location */}
                  {physician.primaryCity && physician.primaryState && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4 shrink-0" aria-hidden="true" />
                      <span>
                        {physician.primaryCity}, {physician.primaryState}
                      </span>
                    </div>
                  )}
                  {/* Phone (hidden on small screens) */}
                  {physician.primaryPhone && (
                    <div className="hidden items-center gap-1 sm:flex">
                      <Phone className="size-4 shrink-0" aria-hidden="true" />
                      <span>{physician.primaryPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <Button
                variant="ghost"
                size="icon" // Use icon size for better spacing
                className="size-8 shrink-0" // Adjust size
                onClick={handleSaveFavorite}
                aria-label="Save to favorites"
              >
                <Star className="size-4" />
              </Button>
            </div>

            {/* Availability Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {mockAcceptingNewPatients && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-green-300 bg-green-50 text-xs text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300"
                >
                  <Check className="size-3" /> Accepting new patients
                </Badge>
              )}
              {mockOffersTelehealth && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-blue-300 bg-blue-50 text-xs text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  <Calendar className="size-3" /> Online scheduling available
                </Badge>
              )}
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                <Clock className="size-3" /> Next available: Today
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="default"
                className="flex-1 sm:flex-none"
                onClick={handleSchedule}
              >
                <Calendar className="mr-2 size-4" />
                Schedule
              </Button>
              <Link
                href={`/profile/${physician.npi}`}
                className="flex-1 sm:flex-none"
              >
                <Button variant="outline" className="w-full">
                  View profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
