"use client"

import * as React from "react"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AuthButtons(): JSX.Element {
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-9 items-center gap-2">
        <div className="bg-muted h-9 w-20 animate-pulse rounded-md"></div>
        <div className="bg-muted h-9 w-20 animate-pulse rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="flex h-9 items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Sign Up</Button>
      </SignUpButton>
    </div>
  )
}
