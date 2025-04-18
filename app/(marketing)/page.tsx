/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

"use server"

import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"

export default async function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
      {/* social proof */}
      <FeaturesSection />
      {/* Add a link to the finder */}
      <div className="mt-12 text-center">
        <a href="/finder" className="text-primary hover:underline">
          Go to Provider Search →
        </a>
      </div>
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}
