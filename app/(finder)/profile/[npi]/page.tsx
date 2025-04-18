/**
 * @description
 * Server component page for displaying a detailed physician profile.
 * Fetches physician data based on the NPI provided in the URL.
 * Renders information using data from the NPPES registry where available,
 * and uses mock data or placeholders for sections like AI bio, reviews,
 * affiliations, education, insurance, and scheduling, as these are not
 * implemented in the initial phase or rely on future data sources/integrations.
 */
"use server"

import * as React from "react"
import type { JSX } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  Activity,
  Award,
  BookOpen,
  Building,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Edit,
  Flag,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Pill,
  Printer,
  Share,
  Star,
  Stethoscope,
  ThumbsUp,
  User,
  Users
} from "lucide-react"
import { Suspense } from "react"

import { getPhysicianByNpiAction } from "@/actions/db/physicians-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SelectPhysician } from "@/db/schema"
import { ProfileClientContent } from "./_components/profile-client-content"
import { ProfileSkeleton } from "./_components/profile-skeleton"
import { ProfileData } from "./_components/profile-client-content"
import { ProfileOverview } from "./_components/profile-overview"
import { ProfileRatings } from "./_components/profile-ratings"
import { ProfileReviews } from "./_components/profile-reviews"
import { ProfileBackground } from "./_components/profile-background"
import { ProfileLocations } from "./_components/profile-locations"
import { ProfileSidebar } from "./_components/profile-sidebar"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"

interface ProfilePageProps {
  params: {
    npi: string
  }
}

export default async function ProfilePage({
  params
}: ProfilePageProps): Promise<JSX.Element> {
  // Ensure params are properly handled before passing to the content component
  const { npi } = await Promise.resolve(params)

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent npi={npi} />
    </Suspense>
  )
}

interface ProfilePageContentProps {
  npi: string
}

async function ProfilePageContent({
  npi
}: ProfilePageContentProps): Promise<JSX.Element> {
  // Fetch physician data using the server action
  const result = await getPhysicianByNpiAction(npi)

  // Handle case where physician is not found or action fails
  if (!result.isSuccess || !result.data) {
    console.warn(
      `Physician profile not found or error fetching NPI ${npi}: ${result.message}`
    )
    notFound() // Render the Next.js 404 page
  }

  const physician: SelectPhysician = result.data
  const fullName = getFullName(physician)

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <div className="text-muted-foreground mb-1 flex items-center gap-2">
            <Link href="/results" className="text-sm hover:underline">
              Back to results
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {physician.taxonomyDescription ||
                "Specialty information unavailable"}
            </Badge>
          </div>
        </div>
        <ProfileClientContent physician={physician} />
      </div>

      <div className="flex flex-wrap gap-4">
        <ProfileData physician={physician} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex-1">
                Locations
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="background" className="flex-1">
                Background
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <ProfileOverview physician={physician} />
            </TabsContent>

            <TabsContent value="locations" className="mt-6 space-y-6">
              <ProfileLocations physician={physician} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              <ProfileRatings physician={physician} />
              <ProfileReviews physician={physician} />
            </TabsContent>

            <TabsContent value="background" className="mt-6 space-y-6">
              <ProfileBackground physician={physician} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ProfileSidebar physician={physician} />
        </div>
      </div>
    </div>
  )
}

// Helper to format full name
const getFullName = (p: SelectPhysician): string => {
  return (
    `${p.firstName || ""} ${p.middleName || ""} ${p.lastName || ""}${p.suffix ? `, ${p.suffix}` : ""}`
      .replace(/\s+/g, " ")
      .trim() || "Unnamed Provider"
  )
}
