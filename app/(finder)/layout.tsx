"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { MainNav } from "@/components/finder/main-nav"
import { ComplianceNotice } from "@/components/shared/compliance-notice"
import { HeartPulse } from "lucide-react"

interface FinderLayoutProps {
  children: ReactNode
}

export default function FinderLayout({ children }: FinderLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/finder" className="flex items-center gap-2">
              <HeartPulse className="text-primary size-6" />
              <span className="text-xl font-bold">Physician Finder</span>
            </Link>
          </div>
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-12">{children}</div>
      </main>

      <footer className="border-t py-6">
        <div className="container">
          <ComplianceNotice />
          <div className="text-muted-foreground mt-4 text-center text-sm">
            © {new Date().getFullYear()} Physician Finder |
            <Link href="/privacy" className="ml-1 hover:underline">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="ml-1 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
