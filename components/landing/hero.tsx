/*
<ai_context>
This client component provides the hero section for the landing page.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

/**
 * @description The Hero section component for the marketing landing page.
 * Displays the main headline, tagline, call-to-action button, and an optional video preview.
 * Uses Framer Motion for animations and PostHog for tracking CTA clicks.
 *
 * @component
 * @returns {JSX.Element} The rendered hero section.
 *
 * @dependencies
 * - framer-motion: For animations.
 * - posthog-js: For analytics event tracking.
 * - lucide-react: For icons.
 * - @/components/ui/button: Button component.
 * - @/components/magicui/animated-gradient-text: Animated text component.
 * - @/components/magicui/hero-video-dialog: Video dialog component.
 * - @/lib/utils: Utility functions (e.g., cn).
 *
 * @notes
 * - The "Get Started" button click is tracked via PostHog.
 * - The video dialog can be configured with video source and thumbnail.
 * - Placeholder text and links should be updated for the specific application.
 */
export const HeroSection = () => {
  /**
   * @description Handles the click event for the "Find a Doctor" button.
   * Captures an event in PostHog.
   */
  const handleFindDoctorClick = () => {
    posthog.capture("clicked_find_doctor_hero")
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      {/* Optional: Animated link (e.g., for announcements or key links) */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link href="#"> // Update link if needed
          <AnimatedGradientText>
            🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Announcing our new feature! // Update text if needed
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </motion.div> */}

      <div className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6">
        <div className="text-balance text-6xl font-bold">
          Find the Right Physician, Faster.
        </div>

        <div className="max-w-xl text-balance text-xl">
          Search the comprehensive NPPES registry to discover qualified doctors
          near you. Filter by specialty, location, and more.
        </div>

        <div>
          <Link href="/finder" onClick={handleFindDoctorClick}>
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Search className="mr-2 size-5" />
              Find a Doctor →
            </Button>
          </Link>
        </div>
      </div>

      {/* Optional Video Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mx-auto mt-20 flex w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/your_video_id" // Replace with actual video ID
          thumbnailSrc="/placeholder-video-thumb.png" // Replace with actual thumbnail path
          thumbnailAlt="Physician Finder Overview Video"
        />
      </motion.div> */}
    </div>
  )
}
