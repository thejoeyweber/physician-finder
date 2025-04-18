import { SearchBar } from "@/components/finder/search-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  ArrowRight,
  Stethoscope,
  Activity,
  Pill,
  Clipboard,
  MapPin
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Find Healthcare Providers
        </h1>
        <p className="text-muted-foreground mb-8">
          Search for physicians by name, specialty, condition, or procedure to
          find the right healthcare provider for your needs.
        </p>

        <SearchBar />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/results" className="flex items-center gap-2">
              Browse All Providers <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="/results?specialty=Primary%20Care"
              className="flex items-center gap-2"
            >
              Primary Care Doctors
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="/results?specialty=Dentist"
              className="flex items-center gap-2"
            >
              Dentists
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Find Care By
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Stethoscope className="text-primary size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Specialty</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors by their area of expertise
              </p>
              <Link
                href="/results"
                className="text-primary text-sm font-medium hover:underline"
              >
                Browse Specialties
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Activity className="text-primary size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Condition</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors who treat specific conditions
              </p>
              <Link
                href="/conditions"
                className="text-primary text-sm font-medium hover:underline"
              >
                Browse Conditions
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Pill className="text-primary size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Procedure</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors who perform specific procedures
              </p>
              <Link
                href="/procedures"
                className="text-primary text-sm font-medium hover:underline"
              >
                Browse Procedures
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <MapPin className="text-primary size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Location</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Find doctors near you or in a specific area
              </p>
              <Link
                href="/locations"
                className="text-primary text-sm font-medium hover:underline"
              >
                Browse Locations
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Popular Specialties
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            "Cardiology",
            "Dermatology",
            "Family Medicine",
            "Gastroenterology",
            "Internal Medicine",
            "Neurology",
            "Obstetrics & Gynecology",
            "Orthopedic Surgery"
          ].map(specialty => (
            <Link
              key={specialty}
              href={`/results?specialty=${encodeURIComponent(specialty)}`}
              className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clipboard className="text-muted-foreground size-4" />
                <span>{specialty}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Common Conditions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            "Diabetes",
            "Hypertension",
            "Asthma",
            "Arthritis",
            "Depression",
            "Anxiety",
            "Back Pain",
            "Heart Disease"
          ].map(condition => (
            <Link
              key={condition}
              href={`/results?condition=${encodeURIComponent(condition)}`}
              className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Activity className="text-muted-foreground size-4" />
                <span>{condition}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Sample Physicians
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
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
          ].map(doctor => (
            <Link
              key={doctor.npi}
              href={`/profile/${doctor.npi}`}
              className="hover:bg-muted/50 block rounded-lg border p-6 transition-colors"
            >
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-muted-foreground text-sm">
                {doctor.specialty}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
