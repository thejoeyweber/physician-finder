/*
<ai_context>
Contains the Stripe configuration for the app.
</ai_context>
*/

import Stripe from "stripe"

/**
 * @description Initializes the Stripe client with the secret key and API version.
 * It includes app information for Stripe's records.
 *
 * @dependencies
 * - stripe: Node.js library for the Stripe API.
 * - process.env.STRIPE_SECRET_KEY: Environment variable for the Stripe secret key.
 *
 * @notes
 * - Ensure the STRIPE_SECRET_KEY environment variable is set.
 * - The API version is pinned for stability.
 * - App info helps Stripe identify API usage patterns.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "Physician Finder", // Updated app name
    version: "0.1.0"
  }
})
