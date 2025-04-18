"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ResultsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mb-8 space-y-4 md:flex md:gap-2 md:space-y-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full md:w-24" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-64">
          <Skeleton className="h-64 w-full rounded-lg border" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-48" />
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="size-20 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Skeleton className="mx-auto h-9 w-48" />
        </div>
      </div>
    </div>
  )
}
