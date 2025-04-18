"use client"

import * as React from "react"
import { InfoIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface MockDataIndicatorProps {
  field: string
}

export function MockDataIndicator({
  field
}: MockDataIndicatorProps): JSX.Element {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <InfoIcon className="ml-1 size-3.5 text-amber-500" />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">This is mock data</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
