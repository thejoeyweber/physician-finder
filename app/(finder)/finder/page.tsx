"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  ArrowRight,
  Stethoscope,
  Activity,
  Pill,
  MapPin,
  Clipboard
} from "lucide-react"

// Placeholder for SearchBar component - will be implemented in Step 14
const SearchBar = () => (
  <div className="bg-muted text-muted-foreground flex h-12 items-center justify-center rounded-md border p-4">
    Search Bar Placeholder (Step 14)
  </div>
)

// Mock data for demonstration
const popularSpecialties = [
  "Cardiology",
  "Dermatology",
  "Family Medicine",
  "Gastroenterology",
  "Internal Medicine",
  "Neurology",
  "Obstetrics & Gynecology",
  "Orthopedic Surgery"
]

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Back Pain",
  "Heart Disease"
]

const samplePhysicians = [
  {
    name: "Dr. Evelyn Reed",
    npi: "1234567890",
    specialty: "Cardiology"
  },
  {
    name: "Dr. Kenji Tanaka",
    npi: "2345678901",
    specialty: "Pediatrics"
  }
]

export default function FinderHomePage() {
  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Find Healthcare Providers
        </h1>
        <p className="text-muted-foreground mb-8 text-lg md:text-xl">
          Search the nation's providers by name, specialty, condition, or
          location to find the right care for you.
        </p>

        <SearchBar />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/finder/results" className="flex items-center gap-2">
              Browse All Providers <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="/finder/results?query=Primary%20Care"
              className="flex items-center gap-2"
            >
              Primary Care Doctors
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="/finder/results?query=Dermatology"
              className="flex items-center gap-2"
            >
              Dermatologists
            </Link>
          </Button>
        </div>
      </div>

      {/* Find Care By Section */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Find Care By
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Specialty Card */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Stethoscope className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Specialty</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors by their area of expertise.
              </p>
              <Button variant="link" asChild className="text-sm">
                <Link href="/finder/results">Browse Specialties</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Condition Card */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Activity className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Condition</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Search for providers who treat specific conditions.
              </p>
              <Button variant="link" asChild className="text-sm">
                <Link href="/finder/results">Browse Conditions</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Procedure Card */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Pill className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Procedure</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Locate providers performing specific procedures.
              </p>
              <Button variant="link" asChild className="text-sm">
                <Link href="/finder/results">Browse Procedures</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <MapPin className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Location</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors near you or in a specific area.
              </p>
              <Button variant="link" asChild className="text-sm">
                <Link href="/finder/results">Browse Locations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Specialties Section */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Popular Specialties
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularSpecialties.map(specialty => (
            <Button
              key={specialty}
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <Link
                href={`/finder/results?query=${encodeURIComponent(specialty)}`}
              >
                <Clipboard className="text-muted-foreground size-4" />
                <span>{specialty}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Common Conditions Section */}
      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Common Conditions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {commonConditions.map(condition => (
            <Button
              key={condition}
              variant="outline"
              className="justify-start gap-2"
              asChild
            >
              <Link
                href={`/finder/results?query=${encodeURIComponent(condition)}`}
              >
                <Activity className="text-muted-foreground size-4" />
                <span>{condition}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Sample Physicians Section */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Featured Providers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {samplePhysicians.map(doctor => (
            <Link
              key={doctor.npi}
              href={`/finder/profile/${doctor.npi}`}
              className="hover:bg-muted/50 block rounded-lg border p-6 transition-colors"
            >
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-muted-foreground text-sm">
                {doctor.specialty}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/finder/results">View More Providers</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
