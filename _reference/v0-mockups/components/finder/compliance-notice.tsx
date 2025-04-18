import { Alert, AlertDescription } from "@/components/ui/alert"

export function ComplianceNotice() {
  return (
    <Alert variant="default" className="bg-muted/50">
      <AlertDescription>
        <p className="text-muted-foreground text-xs">
          Data sourced from the National Plan and Provider Enumeration System
          (NPPES). Some information may be AI-generated for educational
          purposes. This application is not intended to provide medical advice.
          Always consult with a qualified healthcare provider for medical
          concerns.
        </p>
      </AlertDescription>
    </Alert>
  )
}
