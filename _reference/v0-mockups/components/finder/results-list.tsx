import { PhysicianCard } from "@/components/finder/physician-card"
import type { Physician } from "@/lib/types"

interface ResultsListProps {
  physicians: Physician[]
}

export function ResultsList({ physicians }: ResultsListProps) {
  if (physicians.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">
          No physicians found matching your search criteria.
        </h2>
        <p className="text-muted-foreground">
          Please try different keywords or broaden your search.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {physicians.length} Providers Found
        </h2>
      </div>
      <div className="grid gap-4">
        {physicians.map(physician => (
          <PhysicianCard key={physician.npi} physician={physician} />
        ))}
      </div>
    </div>
  )
}
