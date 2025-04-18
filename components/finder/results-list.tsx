"use client"

import { PhysicianCard } from "@/components/finder/physician-card"
import { SelectPhysician } from "@/db/schema"

interface ResultsListProps {
  physicians: SelectPhysician[]
  totalCount: number
}

export function ResultsList({ physicians, totalCount }: ResultsListProps) {
  if (!physicians || physicians.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">No Providers Found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search terms or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {physicians.map(physician => (
          <PhysicianCard key={physician.npi} physician={physician} />
        ))}
      </div>
    </div>
  )
}
