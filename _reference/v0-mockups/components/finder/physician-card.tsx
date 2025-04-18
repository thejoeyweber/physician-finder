"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Calendar, Clock, Check } from "lucide-react"
import type { Physician } from "@/lib/types"

interface PhysicianCardProps {
  physician: Physician
}

export function PhysicianCard({ physician }: PhysicianCardProps) {
  // Mock data for enhanced display
  const yearsExperience = 15
  const rating = 4.2
  const reviewCount = 42
  const acceptingNewPatients = true
  const offersOnlineScheduling = true

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="bg-muted relative hidden size-20 shrink-0 overflow-hidden rounded-md sm:block">
            <Image
              src="/placeholder.svg"
              alt={physician.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/profile/${physician.npi}`}
                  className="hover:underline"
                >
                  <CardTitle className="mb-1">{physician.name}</CardTitle>
                </Link>
                <div className="mb-2 flex items-center gap-2">
                  {physician.specialties[0] && (
                    <Badge variant="secondary">
                      {physician.specialties[0]}
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-sm">
                    {yearsExperience} years experience
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`size-4 ${star <= Math.round(rating) ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm">{rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({reviewCount})
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    <p>
                      {physician.locations[0]?.city},{" "}
                      {physician.locations[0]?.state}
                    </p>
                  </div>
                  <div className="hidden items-center gap-1 sm:flex">
                    <Phone className="size-4" />
                    <p>{physician.locations[0]?.phone}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={e => {
                  e.preventDefault()
                  // Save functionality will be implemented in Phase 2
                }}
              >
                <Star className="size-4" />
                <span className="sr-only">Save to favorites</span>
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {acceptingNewPatients && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 flex items-center gap-1 text-xs"
                >
                  <Check className="size-3" /> Accepting new patients
                </Badge>
              )}
              {offersOnlineScheduling && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 flex items-center gap-1 text-xs"
                >
                  <Calendar className="size-3" /> Online scheduling
                </Badge>
              )}
              <Badge
                variant="outline"
                className="bg-primary/10 flex items-center gap-1 text-xs"
              >
                <Clock className="size-3" /> Next available: Today
              </Badge>
            </div>

            <div className="mt-3 flex justify-between border-t pt-3">
              <Link
                href={`/profile/${physician.npi}`}
                className="text-primary text-sm hover:underline"
              >
                View profile
              </Link>
              <Button size="sm" className="h-8">
                <Calendar className="mr-1 size-4" /> Schedule
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
