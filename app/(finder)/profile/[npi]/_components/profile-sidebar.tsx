"use client"

import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"
import {
  Calendar,
  MessageSquare,
  Phone,
  Users,
  User,
  Share,
  Printer,
  Flag,
  Edit
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileSidebarProps {
  physician: SelectPhysician
}

export function ProfileSidebar({ physician }: ProfileSidebarProps) {
  const { metrics, enrichment } = useMockData(physician)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">Contact & Appointments</h2>
          <div className="space-y-4">
            <Button className="w-full">
              <Calendar className="mr-2 size-4" /> Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 size-4" /> Send Message
            </Button>
            <Button variant="outline" className="w-full">
              <Phone className="mr-2 size-4" /> Call Office
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">Insurance</h2>
          <p className="mb-2 text-sm">This provider may accept:</p>
          <ul className="space-y-1 text-sm">
            {enrichment.insuranceAccepted.map((insurance, index) => (
              <li key={index}>• {insurance}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-xs">
            Please contact the provider's office to verify insurance coverage.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold">Patient Demographics</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground size-4" />
              <span>{enrichment.patientDemographics.treats}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground size-4" />
              <span>{enrichment.patientDemographics.genders}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="justify-start">
          <Share className="mr-2 size-4" /> Share Profile
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Printer className="mr-2 size-4" /> Print Profile
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Flag className="mr-2 size-4" /> Report Incorrect Information
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Edit className="mr-2 size-4" /> Claim This Profile
        </Button>
      </div>
    </div>
  )
}
