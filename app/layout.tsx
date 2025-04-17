/*
<ai_context>
The root server layout for the app. It sets up Clerk authentication, providers (Theme, Tooltip, PostHog), Tailwind indicator, and Toaster notifications. It also ensures a user profile exists upon login.
</ai_context>
*/

import { getOrCreateUserAction } from "@/actions/db/users-actions"
import { Toaster } from "@/components/ui/sonner"
import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

/**
 * @description Metadata for the application, including title and description.
 * Used for SEO and browser tab information.
 */
export const metadata: Metadata = {
  title: "Physician Finder",
  description: "Find physicians across the U.S. with ease."
}

/**
 * @description The root layout component for the entire application.
 * It wraps all pages and provides global context and structure.
 * - Sets up Clerk authentication provider.
 * - Checks for and creates user records in the database upon login using `getOrCreateUserAction`.
 * - Includes providers for theme, tooltips, and PostHog analytics.
 * - Renders global UI elements like the Tailwind indicator (in dev) and Toaster.
 * - Applies global styles and fonts.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout structure.
 */
export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // Ensure a user record exists for the logged-in user
  if (userId) {
    // Use getOrCreateUserAction to find or create the user record
    const userResult = await getOrCreateUserAction(userId)
    if (!userResult.isSuccess) {
      // Log an error if the user record couldn't be fetched or created
      console.error(
        `Failed to get or create user record for ${userId}: ${userResult.message}`
      )
      // Depending on the desired behavior, you might want to handle this error more gracefully,
      // e.g., redirecting to an error page or showing a notification.
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false} // System theme preference disabled for explicit control
            disableTransitionOnChange
          >
            {/* PostHog analytics integration */}
            <PostHogUserIdentify />
            <PostHogPageview />

            {/* Main application content */}
            {children}

            {/* Utility components */}
            <TailwindIndicator />
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
