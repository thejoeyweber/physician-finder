# Physician Finder

A web-based physician-locator platform ingesting the full U.S. NPPES registry, enriching records on demand with AI-generated context, and letting partner organizations curate branded finder instances on their own sub- or custom domains.

## Key Goals

1.  Make it trivial for patients to discover qualified doctors via search, filter, and map.
2.  Give pharma brands (or other orgs) a self-service portal to pre-filter / brand a directory and host it under their own domain.
3.  Keep data current and trustworthy with weekly NPPES syncs, selective AI enrichment, and clear provenance tags.

## Tech Stack

-   **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI, Mapbox GL JS
-   **Backend**: Supabase (PostgreSQL + PostGIS), Drizzle ORM, Next.js Server Actions, Supabase Edge Functions
-   **Workflows**: n8n (for ETL & enrichment)
-   **Authentication**: Clerk
-   **Analytics**: PostHog
-   **Deployment**: Vercel

## Prerequisites

You will need accounts for the following services. Most offer free tiers suitable for development:

-   [GitHub](https://github.com/)
-   [Supabase](https://supabase.com/) (Requires enabling `pg_trgm` and `postgis` extensions)
-   [Clerk](https://clerk.com/)
-   [Mapbox](https://www.mapbox.com/) (For maps and geocoding)
-   [n8n](https://n8n.io/) (Self-hosted or Cloud)
-   [PostHog](https://posthog.com/) (Self-hosted or Cloud)
-   [Vercel](https://vercel.com/)
-   (Optional) [Stripe](https://stripe.com/) - If implementing paid features for organizations later.
-   (Optional) AI Provider (e.g., Perplexity, Google Gemini/Vertex AI) - For AI enrichment.

## Environment Variables

Copy the `.env.example` file to `.env.local` and populate the required values:

```bash
# DB (Supabase)
DATABASE_URL= # Your Supabase Postgres connection string

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login # Or your desired sign-in path
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup # Or your desired sign-up path

# Mapping (Mapbox)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
MAPBOX_SECRET_KEY= # For server-side geocoding if needed

# Analytics (PostHog) - Optional
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# n8n Webhook URLs (For Enrichment, etc.) - Define as needed
N8N_ENRICHMENT_WEBHOOK_URL=

# AI Enrichment API Keys (Define based on chosen provider)
# Example: PERPLEXITY_API_KEY= or GOOGLE_API_KEY=

# Vercel API Token (For domain management) - Optional but recommended for automation
VERCEL_API_TOKEN=
VERCEL_TEAM_ID= # If using a Vercel team

# Stripe (Optional - for future billing)
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# NEXT_PUBLIC_STRIPE_PORTAL_LINK=
# NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
# NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=