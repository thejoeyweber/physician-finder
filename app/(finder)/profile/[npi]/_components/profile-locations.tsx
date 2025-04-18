"use client"

import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"
import { MapPin, Phone, Clock } from "lucide-react"

interface ProfileLocationsProps {
  physician: SelectPhysician
}

export function ProfileLocations({ physician }: ProfileLocationsProps) {
  const { enrichment } = useMockData(physician)

  return (
    <div className="space-y-8">
      {/* Primary Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Primary Location
            <MockDataIndicator field="primaryLocation" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 size-4" />
              <div>
                <div>{physician.primaryAddress1}</div>
                {physician.primaryAddress2 && (
                  <div>{physician.primaryAddress2}</div>
                )}
                <div>
                  {physician.primaryCity}, {physician.primaryState}{" "}
                  {physician.primaryZip}
                </div>
              </div>
            </div>

            {physician.primaryPhone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <div>{physician.primaryPhone}</div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4" />
              <div>
                <div>
                  <span className="font-medium">Weekdays:</span>{" "}
                  {enrichment.officeHours.weekdays}
                </div>
                <div>
                  <span className="font-medium">Saturday:</span>{" "}
                  {enrichment.officeHours.saturday}
                </div>
                <div>
                  <span className="font-medium">Sunday:</span>{" "}
                  {enrichment.officeHours.sunday}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Affiliations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Hospital Affiliations
            <MockDataIndicator field="hospitalAffiliations" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrichment.hospitalAffiliations.map((hospital, index) => (
              <div key={index} className="flex items-start gap-2">
                <MapPin className="mt-1 size-4" />
                <div>
                  <div className="font-medium">{hospital.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {hospital.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
