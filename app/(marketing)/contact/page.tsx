/*
<ai_context>
This server page returns the content for the "Contact" page in the (marketing) route group.
</ai_context>
*/

"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * @description Renders the Contact page content.
 * Provides information on how to get in touch regarding the Physician Finder application.
 *
 * @page
 * @returns {Promise<JSX.Element>} The rendered Contact page.
 */
export default async function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Contact Us</h1>

      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg leading-relaxed">
            Have questions about Physician Finder, partnership opportunities, or
            data inquiries?
          </p>
          <p className="text-lg leading-relaxed">
            Please reach out to us at:{" "}
            <a
              href="mailto:contact@physicianfinder.example.com" // Replace with actual contact email
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              contact@physicianfinder.example.com
            </a>
          </p>
          {/* Add a contact form component here later if needed */}
        </CardContent>
      </Card>
    </div>
  )
}
