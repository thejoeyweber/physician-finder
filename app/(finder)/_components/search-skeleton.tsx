"use client"

import * as React from "react"

export function SearchSkeleton(): JSX.Element {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex gap-2">
        <div className="bg-muted h-10 flex-1 animate-pulse rounded-md"></div>
        <div className="bg-muted h-10 w-24 animate-pulse rounded-md"></div>
      </div>
    </div>
  )
}
