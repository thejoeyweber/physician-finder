"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function ComplianceNotice() {
  return (
    <Alert variant="default" className="bg-muted/50">
      <Info className="size-4" />
      <AlertDescription>
        <p className="text-muted-foreground text-xs">
          Data primarily sourced from the National Plan and Provider Enumeration
          System (NPPES), updated weekly. Some information may be AI-generated
          for context and is marked accordingly. This tool is for informational
          purposes only and does not constitute medical advice or an endorsement
          of any provider. Please verify all information directly with the
          provider or your health plan.
        </p>
      </AlertDescription>
    </Alert>
  )
}
