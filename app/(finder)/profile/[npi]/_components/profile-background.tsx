"use client"

import type { SelectPhysician } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"
import { useMockData } from "./profile-client-content"

interface ProfileBackgroundProps {
  physician: SelectPhysician
}

export function ProfileBackground({ physician }: ProfileBackgroundProps) {
  const { enrichment } = useMockData(physician)

  return (
    <div className="space-y-8">
      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Education
            <MockDataIndicator field="education" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrichment.education.map((edu, index) => (
              <div key={index}>
                <div className="font-medium">{edu.type}</div>
                <div className="text-muted-foreground text-sm">
                  {edu.institution}, {edu.year}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Certifications
            <MockDataIndicator field="certifications" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrichment.certifications.map((cert, index) => (
              <div key={index}>
                <div className="font-medium">{cert.name}</div>
                <div className="text-muted-foreground text-sm">
                  {cert.status}, {cert.year}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Awards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Awards
            <MockDataIndicator field="awards" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrichment.awards.map((award, index) => (
              <div key={index}>
                <div className="font-medium">{award.name}</div>
                <div className="text-muted-foreground text-sm">
                  {award.years}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Research */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Research & Publications
            <MockDataIndicator field="publications" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Research Interests</h3>
              <ul className="list-disc space-y-1 pl-4">
                {enrichment.researchInterests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Publications</h3>
              <ul className="list-disc space-y-1 pl-4">
                {enrichment.publications.map((pub, index) => (
                  <li key={index}>{pub}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
