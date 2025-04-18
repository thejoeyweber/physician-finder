"use client"

import Image from "next/image"
import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent } from "@/components/ui/card"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Briefcase, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileOverviewProps {
  physician: SelectPhysician
}

export function ProfileOverview({ physician }: ProfileOverviewProps) {
  const { enrichment, metrics } = useMockData(physician)

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3">
              <div className="bg-muted relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-md md:mx-0">
                <Image
                  src="/placeholder.svg"
                  alt={physician.firstName || ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Stethoscope className="size-5" /> About
              </h2>
              <div className="mb-3 flex items-center gap-2">
                <Briefcase className="text-muted-foreground size-4" />
                <span>{metrics.yearsExperience} years of experience</span>
                {metrics.yearsExperience && (
                  <MockDataIndicator field="yearsExperience" />
                )}
              </div>
              <p className="mb-4">
                Dr. {physician.lastName} is a {physician.taxonomyDescription}{" "}
                specialist with extensive experience in patient care.
              </p>
              <p className="text-muted-foreground italic">
                Dr. {physician.lastName} is dedicated to providing comprehensive
                care for patients with a wide range of conditions. With a
                patient-centered approach, they focus on preventive care and
                personalized treatment plans to help patients achieve optimal
                health outcomes.
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                (Source: AI Model, Last Refreshed: April 2025)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            Conditions Treated
            <MockDataIndicator field="conditionsTreated" />
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {enrichment.conditionsTreated.map((condition, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="text-primary size-4" />
                <span>{condition}</span>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 h-auto p-0">
            View all conditions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            Procedures Performed
            <MockDataIndicator field="proceduresPerformed" />
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {enrichment.proceduresPerformed.map((procedure, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="text-primary size-4" />
                <span>{procedure}</span>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 h-auto p-0">
            View all procedures
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
