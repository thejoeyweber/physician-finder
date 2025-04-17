/*
<ai_context>
This server page returns the content for the "About" page in the (marketing) route group.
</ai_context>
*/

"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * @description Renders the About page content.
 * Provides information about the Physician Finder application, its mission, and data sources.
 *
 * @page
 * @returns {Promise<JSX.Element>} The rendered About page.
 */
export default async function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">
        About Physician Finder
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            Our mission is to empower patients by providing an easy-to-use,
            comprehensive, and trustworthy platform to find healthcare providers
            across the United States. We aim to bridge the information gap and
            make discovering the right physician a seamless experience.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg leading-relaxed">
            Physician Finder utilizes the National Plan and Provider Enumeration
            System (NPPES) NPI Registry, a public dataset maintained by the
            Centers for Medicare & Medicaid Services (CMS). This registry
            contains information about healthcare providers enrolled in Medicare
            and other government programs.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            We synchronize with the NPPES registry weekly to ensure our data is
            as current as possible. For select profiles, we may enrich the core
            NPPES data with publicly available information using AI tools to
            provide additional context, such as summaries of education or
            affiliations. All enriched data is clearly marked with its source
            and refresh date.
          </p>
          <p className="text-muted-foreground text-sm">
            Disclaimer: While we strive for accuracy, the information provided
            is based on publicly available data and may not be exhaustive or
            entirely up-to-date. Always verify information directly with the
            provider or relevant health plan. This platform does not store
            Protected Health Information (PHI) and is not a substitute for
            professional medical advice.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>For Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            We offer partner organizations (like pharmaceutical companies,
            hospital systems, or health tech firms) the ability to create
            custom, branded instances of the Physician Finder. These instances
            can be pre-filtered to specific specialties or criteria and hosted
            on your own domain, providing a valuable resource for your audience.
            Contact us to learn more about partnership opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
