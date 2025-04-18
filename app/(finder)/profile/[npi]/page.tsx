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

interface ProfilePageProps {
  params: {
    npi: string
  }
}

export default async function ProfilePage({
  params
}: ProfilePageProps): Promise<JSX.Element> {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent params={params} />
    </Suspense>
  )
}

async function ProfilePageContent({
  params
}: ProfilePageProps): Promise<JSX.Element> {
  // Fetch physician data using the server action
  const result = await getPhysicianByNpiAction(params.npi)

  // Handle case where physician is not found or action fails
  if (!result.isSuccess || !result.data) {
    console.warn(
      `Physician profile not found or error fetching NPI ${params.npi}: ${result.message}`
    )
    notFound() // Render the Next.js 404 page
  }

  const physician: SelectPhysician = result.data

  // Helper to format full name
  const getFullName = (p: SelectPhysician): string => {
    return (
      `${p.firstName || ""} ${p.middleName || ""} ${p.lastName || ""}${p.suffix ? `, ${p.suffix}` : ""}`
        .replace(/\s+/g, " ")
        .trim() || "Unnamed Provider"
    )
  }

  const fullName = getFullName(physician)

  // Safely access primary address and phone
  const primaryAddress =
    physician.addresses && physician.addresses.length > 0
      ? physician.addresses[0]
      : null
  const primaryPhoneNumber =
    physician.phoneNumbers && physician.phoneNumbers.length > 0
      ? physician.phoneNumbers.find(p => p.isPrimary) ||
        physician.phoneNumbers[0]
      : null

  // Mock data for the profile
  const mockYearsExperience = 15
  const mockRating = 4.2
  const mockReviewCount = 42
  const mockAcceptingNewPatients = true
  const mockOffersTelehealth = true

  const mockConditionsTreated = [
    "Heart Disease",
    "Hypertension",
    "Arrhythmia",
    "Heart Failure",
    "Coronary Artery Disease",
    "Valve Disorders"
  ]

  const mockProceduresPerformed = [
    "Echocardiogram",
    "Stress Test",
    "Cardiac Catheterization",
    "Pacemaker Implantation",
    "Cardioversion",
    "Holter Monitoring"
  ]

  const mockHospitalAffiliations = [
    {
      name: "Memorial Hospital",
      address: "500 Medical Center Dr, Springfield, IL 62704"
    },
    {
      name: "University Medical Center",
      address: "1200 University Ave, Springfield, IL 62704"
    }
  ]

  const mockOfficeHours = {
    weekdays: "9:00 AM - 5:00 PM",
    saturday: "9:00 AM - 12:00 PM",
    sunday: "Closed"
  }

  const mockRatingsSummary = {
    overall: 4.2,
    trustworthiness: 4.5,
    explainsConditions: 4.3,
    answersQuestions: 4.1,
    providesFollowUp: 4.0,
    staffFriendliness: 3.9
  }

  const mockPatientReviews = [
    {
      name: "Sarah J.",
      date: "March 15, 2025",
      rating: 5,
      comment:
        "Dr. Reed was very thorough and took the time to explain everything to me. I never felt rushed during my appointment."
    },
    {
      name: "Michael T.",
      date: "February 28, 2025",
      rating: 4,
      comment:
        "Very knowledgeable doctor. The wait time was a bit long, but the care I received was worth it."
    },
    {
      name: "Jessica L.",
      date: "January 10, 2025",
      rating: 5,
      comment:
        "I've been seeing Dr. Reed for years and have always received excellent care. Highly recommend!"
    }
  ]

  const mockEducation = [
    { type: "Medical School", institution: "University of Example Medicine" },
    { type: "Residency", institution: "General Example Hospital" },
    { type: "Fellowship", institution: "Specialty Example Clinic" }
  ]

  const mockCertifications = [
    { name: "American Board of Example Medicine", status: "Certified" },
    { name: "State Medical License (XX)", status: "Active" }
  ]

  const mockAwards = [
    { name: "Top Doctor Award", years: "2023, 2024" },
    { name: "Patient's Choice Award", years: "2022, 2023, 2024" },
    { name: "Compassionate Doctor Recognition", years: "2021, 2022, 2023" }
  ]

  const mockPublications = [
    "Example Publication Title 1 - Journal of Examples, 2023",
    "Example Publication Title 2 - Medical Example Review, 2022"
  ]

  const mockResearchInterests = [
    "Preventive Cardiology",
    "Hypertension Management",
    "Heart Failure Treatment Outcomes"
  ]

  const mockInsuranceAccepted = [
    "Medicare",
    "Blue Cross Blue Shield",
    "Aetna",
    "UnitedHealthcare",
    "Cigna"
  ]

  const mockPatientDemographics = {
    treats: "Adults and Children",
    genders: "All genders welcome"
  }

  return (
    <main className="container py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
            <p className="text-muted-foreground">
              {physician.primarySpecialty?.taxonomyDescription}
            </p>
          </div>
          <ProfileClientContent physician={physician} />
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Placeholder Image */}
                    <div className="flex justify-center md:w-1/3">
                      <div className="bg-muted relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg" // Placeholder image
                          alt={`Placeholder image for ${fullName}`}
                          fill
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    </div>
                    {/* About Section */}
                    <div className="md:w-2/3">
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                        <Stethoscope className="size-5" /> About
                      </h2>
                      <div className="mb-3 flex items-center gap-2">
                        <Briefcase className="text-muted-foreground size-4" />
                        <span>{mockYearsExperience} years of experience</span>
                      </div>
                      {/* AI Bio Placeholder */}
                      <p className="text-muted-foreground mb-4 italic">
                        {physician.aiBio ? (
                          physician.aiBio
                        ) : (
                          <>
                            [AI-generated bio placeholder] Dr.{" "}
                            {physician.lastName || "Provider"} is a dedicated{" "}
                            {physician.primarySpecialty?.taxonomyDescription ||
                              "healthcare professional"}{" "}
                            committed to providing excellent patient care.
                            Further details about their approach and focus areas
                            will be available soon.
                          </>
                        )}
                      </p>
                      <p className="text-muted-foreground mt-4 text-xs">
                        {physician.aiBioSource && physician.aiBioEnrichedAt ? (
                          `(Source: ${physician.aiBioSource}, Last Refreshed: ${new Date(physician.aiBioEnrichedAt).toLocaleDateString()})`
                        ) : (
                          <em>(AI enrichment pending)</em>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditions Treated (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Activity className="size-5" /> Conditions Treated (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    {mockConditionsTreated
                      .slice(0, 6)
                      .map((condition, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="text-primary size-4 shrink-0" />
                          <span>{condition}</span>
                        </li>
                      ))}
                  </ul>
                  {mockConditionsTreated.length > 6 && (
                    <Button
                      variant="link"
                      className="mt-4 h-auto p-0 text-sm"
                      disabled
                    >
                      View all conditions
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Procedures Performed (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Pill className="size-5" /> Procedures Performed (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    {mockProceduresPerformed
                      .slice(0, 6)
                      .map((procedure, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="text-primary size-4 shrink-0" />
                          <span>{procedure}</span>
                        </li>
                      ))}
                  </ul>
                  {mockProceduresPerformed.length > 6 && (
                    <Button
                      variant="link"
                      className="mt-4 h-auto p-0 text-sm"
                      disabled
                    >
                      View all procedures
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="mt-6 space-y-6">
              {/* Practice Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="size-5" /> Practice Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {physician.addresses && physician.addresses.length > 0 ? (
                    physician.addresses.map((location, index) => (
                      <div
                        key={index}
                        className="mb-6 border-b pb-6 last:mb-0 last:border-b-0 last:pb-0"
                      >
                        <h3 className="mb-2 font-medium">
                          {location.isPrimary
                            ? "Primary Location"
                            : `Location ${index + 1}`}
                        </h3>
                        {/* Address Details */}
                        <p>{location.addressLine1}</p>
                        {location.addressLine2 && (
                          <p>{location.addressLine2}</p>
                        )}
                        <p>
                          {location.city}, {location.state} {location.zipCode}
                        </p>
                        {/* Phone Number for this Location (Find matching phone) */}
                        {(() => {
                          const locPhone = physician.phoneNumbers?.find(
                            p => p.type === "PRACTICE" && p.isPrimary
                          ) // Simple logic, might need refinement based on actual data structure
                          return locPhone ? (
                            <div className="mt-2 flex items-center gap-2">
                              <Phone className="text-muted-foreground size-4" />
                              <p>{locPhone.number}</p>
                            </div>
                          ) : null
                        })()}
                        {/* Fax Number (Placeholder/Mock) */}
                        {/* <div className="mt-1 flex items-center gap-2">
                          <Mail className="text-muted-foreground size-4" />
                          <p>Fax: (555) 123-4568</p>
                        </div> */}

                        {/* Action Buttons (Placeholders) */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" disabled>
                            <MapPin className="mr-1 size-4" /> Get Directions
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <Phone className="mr-1 size-4" /> Call
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No practice locations listed.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Hospital Affiliations (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building className="size-5" /> Hospital Affiliations (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHospitalAffiliations.map((hospital, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Building className="text-muted-foreground mt-1 size-4 shrink-0" />
                        <div>
                          <p className="font-medium">{hospital.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {hospital.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="size-5" /> Office Hours (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>{mockOfficeHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>{mockOfficeHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>{mockOfficeHours.sunday}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4 text-xs">
                    Hours are approximate and may vary. Please call to confirm.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6 space-y-6">
              {/* Ratings Summary (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="size-5" /> Ratings & Reviews (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Overall Rating */}
                    <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg p-4 text-center md:w-1/3">
                      <div className="mb-2 text-5xl font-bold">
                        {mockRatingsSummary.overall.toFixed(1)}
                      </div>
                      <div className="mb-2 flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`size-5 ${star <= Math.round(mockRatingsSummary.overall) ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Based on {mockReviewCount} reviews
                      </div>
                    </div>
                    {/* Rating Breakdown */}
                    <div className="md:w-2/3">
                      <div className="space-y-3">
                        {(
                          [
                            [
                              "Trustworthiness",
                              mockRatingsSummary.trustworthiness
                            ],
                            [
                              "Explains conditions well",
                              mockRatingsSummary.explainsConditions
                            ],
                            [
                              "Takes time to answer questions",
                              mockRatingsSummary.answersQuestions
                            ],
                            [
                              "Provides follow-up as needed",
                              mockRatingsSummary.providesFollowUp
                            ],
                            [
                              "Staff friendliness",
                              mockRatingsSummary.staffFriendliness
                            ]
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{label}</span>
                              <span className="text-sm font-medium">
                                {value.toFixed(1)}
                              </span>
                            </div>
                            <Progress
                              value={(value / 5) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Reviews List (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockPatientReviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{review.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {review.date}
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`size-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            disabled
                          >
                            <ThumbsUp className="size-4" /> Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            disabled
                          >
                            <Flag className="size-4" /> Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full" disabled>
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Background Tab */}
            <TabsContent value="background" className="mt-6 space-y-6">
              {/* Education (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="size-5" /> Education & Training
                    (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEducation.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-medium">{edu.type}</h3>
                        <p>{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="size-5" /> Certifications & Licensure
                    (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCertifications.map((cert, index) => (
                      <div key={index}>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {cert.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Awards (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="size-5" /> Awards & Recognition (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockAwards.map((award, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Award className="text-primary mt-0.5 size-4 shrink-0" />
                        <div>
                          <p className="font-medium">{award.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {award.years}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Publications (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="size-5" /> Publications & Research
                    (Mock)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Journal Articles</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
                        {mockPublications.map((pub, index) => (
                          <li key={index}>{pub}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium">Research Interests</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
                        {mockResearchInterests.map((interest, index) => (
                          <li key={index}>{interest}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Contact & Appointments Card (Placeholders) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact & Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled>
                <Calendar className="mr-2 size-4" /> Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <MessageSquare className="mr-2 size-4" /> Send Message
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Phone className="mr-2 size-4" /> Call Office
              </Button>
            </CardContent>
          </Card>

          {/* Insurance Card (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Insurance (Mock)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">This provider may accept:</p>
              <ul className="space-y-1 text-sm">
                {mockInsuranceAccepted.map((plan, index) => (
                  <li key={index}>• {plan}</li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4 text-xs">
                Please contact the provider's office to verify insurance
                coverage.
              </p>
            </CardContent>
          </Card>

          {/* Patient Demographics Card (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Patient Demographics (Mock)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground size-4" />
                <span>{mockPatientDemographics.treats}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground size-4" />
                <span>{mockPatientDemographics.genders}</span>
              </div>
              {mockAcceptingNewPatients && (
                <div className="flex items-center gap-2">
                  <Check className="text-primary size-4" />
                  <span>Accepting new patients</span>
                </div>
              )}
              {mockOffersTelehealth && (
                <div className="flex items-center gap-2">
                  <Check className="text-primary size-4" />
                  <span>Offers telehealth appointments</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar Action Buttons (Placeholders) */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              disabled
            >
              <Share className="mr-2 size-4" /> Share Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              disabled
            >
              <Printer className="mr-2 size-4" /> Print Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              disabled
            >
              <Flag className="mr-2 size-4" /> Report Incorrect Information
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              disabled
            >
              <Edit className="mr-2 size-4" /> Claim This Profile
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
