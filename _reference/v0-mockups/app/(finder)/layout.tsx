import type React from "react"
import Link from "next/link"
import { ComplianceNotice } from "@/components/finder/compliance-notice"
import { MainNav } from "@/components/finder/main-nav"

export default function FinderLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">HealthFinder</span>
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
            © 2025 HealthFinder |
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
