/**
 * @description
 * Database seed script for the Physician Finder application.
 * Populates the database with initial sample data for development and testing purposes.
 * Includes:
 * - One organization
 * - One user (linked to the organization)
 * - One finder instance for the organization
 * - Multiple physician records with realistic fake data, including geospatial points.
 *
 * @dependencies
 * - @faker-js/faker: Generates fake data for physicians.
 * - drizzle-orm: Used for database interactions and SQL generation.
 * - postgres: The underlying PostgreSQL client library.
 * - dotenv: Loads environment variables from `.env.local`.
 * - @/db/db: Provides the Drizzle database instance (`db`).
 * - @/db/schema: Provides table schema definitions and types.
 *
 * @notes
 * - **IMPORTANT**: Replace the placeholder `CLERK_USER_ID` with an actual Clerk User ID from your development Clerk instance.
 * - This script is designed to be idempotent, meaning it can be run multiple times without creating duplicate organizations or users (it checks for existence first). Physician data might be duplicated if NPIs collide, but uses faker's unique NPI generation.
 * - Requires the `DATABASE_URL` environment variable to be set.
 * - Requires `pg_trgm` and `postgis` extensions to be enabled in the database.
 * - Run using `npm run db:seed`.
 */

import { faker } from "@faker-js/faker"
import { config } from "dotenv"
import { sql } from "drizzle-orm"
import { db } from "@/db/db"
import {
  InsertFinderInstance,
  InsertOrganization,
  InsertOrganizationMembership,
  InsertPhysician,
  InsertUser,
  finderInstancesTable,
  organizationMembershipsTable,
  organizationsTable,
  physiciansTable,
  usersTable
} from "@/db/schema"
import { PracticeAddress, SpecialtyInfo } from "@/types/shared-types"
import postgres from "postgres"

// Load environment variables from .env.local
config({ path: ".env.local" })

// --- Configuration ---
const NUM_PHYSICIANS_TO_SEED = 15
// !!! REPLACE WITH A REAL CLERK USER ID FROM YOUR DEVELOPMENT INSTANCE !!!
const CLERK_USER_ID = "user_2vrwNKPnry2zGlmfAUvFJWkTuAX"
const ORGANIZATION_NAME = "Test Health Inc."
const FINDER_INSTANCE_NAME = "Default Test Finder"
const FINDER_INSTANCE_SLUG = "default-test"

// --- Helper Functions ---

/**
 * Generates a fake NPI (National Provider Identifier).
 * NPPES NPIs are 10 digits.
 * @returns {string} A 10-digit NPI string.
 */
function generateNpi(): string {
  return faker.string.numeric(10)
}

/**
 * Generates a fake US ZIP code (5 digits).
 * @returns {string} A 5-digit ZIP code string.
 */
function generateZipCode(): string {
  return faker.location.zipCode("#####")
}

/**
 * Generates a fake US state abbreviation.
 * @returns {string} A 2-letter state abbreviation (uppercase).
 */
function generateState(): string {
  return faker.location.state({ abbreviated: true })
}

/**
 * Generates a fake phone number in a common US format.
 * @returns {string} A phone number string.
 */
function generatePhoneNumber(): string {
  return faker.phone.number()
}

/**
 * Generates fake coordinates within the continental US.
 * @returns {{ latitude: number, longitude: number }} Latitude and longitude.
 */
function generateCoordinates(): { latitude: number; longitude: number } {
  return {
    latitude: faker.location.latitude({ min: 24, max: 49 }), // Continental US latitude range
    longitude: faker.location.longitude({ min: -125, max: -66 }) // Continental US longitude range
  }
}

/**
 * Generates a fake SpecialtyInfo object.
 * @param {boolean} [isPrimary=false] - Whether this specialty is primary.
 * @returns {SpecialtyInfo} A SpecialtyInfo object.
 */
function generateSpecialty(isPrimary: boolean = false): SpecialtyInfo {
  // Using faker's commerce department for plausible specialty names
  const specialtyName = faker.commerce.department()
  return {
    taxonomyCode: faker.string.alphanumeric(10).toUpperCase(), // Fake taxonomy code
    taxonomyDescription: specialtyName,
    primarySpecialty: isPrimary
    // licenseNumber, licenseState, boardCertified can be added if needed
  }
}

/**
 * Generates a fake PracticeAddress object.
 * @param {string} state - The state for the address.
 * @param {string} zipCode - The ZIP code for the address.
 * @param {boolean} [isPrimary=true] - Whether this address is primary.
 * @returns {PracticeAddress} A PracticeAddress object.
 */
function generateAddress(
  state: string,
  zipCode: string,
  isPrimary: boolean = true
): PracticeAddress {
  return {
    addressLine1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: state,
    zipCode: zipCode, // Use provided zip
    countryCode: "US",
    addressType: "LOCATION",
    addressPurpose: "PRACTICE",
    isPrimary: isPrimary
  }
}

/**
 * Generates a fake physician record.
 * @returns {InsertPhysician} A physician object ready for insertion.
 */
function createFakePhysician(): Omit<
  InsertPhysician,
  "createdAt" | "updatedAt"
> {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const state = generateState()
  const zipCode = generateZipCode()
  const primaryAddress = generateAddress(state, zipCode, true)
  const coordinates = generateCoordinates()

  return {
    npi: generateNpi(),
    firstName: firstName,
    lastName: lastName,
    credential: faker.helpers.arrayElement(["MD", "DO", "NP", "PA"]),
    gender: faker.helpers.arrayElement(["M", "F", null]), // Include null option
    status: "A", // Default to Active
    enumerationDate: faker.date.past({ years: 10 }).toISOString().split("T")[0], // Format as YYYY-MM-DD
    primarySpecialty: generateSpecialty(true),
    secondarySpecialties: faker.helpers.maybe(() => [generateSpecialty()], {
      probability: 0.3
    }), // Optional secondary
    addresses: [primaryAddress],
    phoneNumbers: [
      { number: generatePhoneNumber(), type: "PRACTICE", isPrimary: true }
    ],
    addressState: state, // Store derived state
    addressZip5: zipCode.substring(0, 5), // Store derived 5-digit zip
    // Use SQL function for PostGIS point creation
    location: sql`ST_SetSRID(ST_MakePoint(${coordinates.longitude}, ${coordinates.latitude}), 4326)`,
    languages: faker.helpers.maybe(
      () => [faker.helpers.arrayElement(["es", "fr", "de", "zh"])], // Example ISO 639-1 codes
      { probability: 0.2 }
    ),
    acceptsTelehealth: faker.datatype.boolean(0.4), // 40% chance of accepting telehealth
    // AI fields initially null
    aiBio: null,
    aiBioSource: null,
    aiBioVersion: null,
    aiBioEnrichedAt: null,
    geoEnrichedAt: null, // Will be set when geocoding happens
    // fullNameTsv will be populated by the database trigger
    fullNameTsv: null
  }
}

// --- Main Seeding Logic ---
async function seed() {
  console.log("🌱 Starting database seed...")

  // Ensure the database connection is available
  if (!db) {
    console.error("❌ Database connection is not available.")
    process.exit(1)
  }

  // 1. Seed Organization
  let organization: InsertOrganization | undefined
  try {
    const existingOrg = await db.query.organizations.findFirst({
      where: (org, { eq }) => eq(org.name, ORGANIZATION_NAME)
    })

    if (existingOrg) {
      console.log(`ℹ️ Organization "${ORGANIZATION_NAME}" already exists.`)
      organization = existingOrg
    } else {
      ;[organization] = await db
        .insert(organizationsTable)
        .values({ name: ORGANIZATION_NAME })
        .returning()
      console.log(
        `✅ Seeded organization: ${organization!.name} (ID: ${organization!.id})`
      )
    }
  } catch (error) {
    console.error("❌ Error seeding organization:", error)
    process.exit(1) // Exit if core seeding fails
  }

  // Ensure organization was found or created
  if (!organization?.id) {
    console.error("❌ Failed to get organization ID.")
    process.exit(1)
  }
  const organizationId = organization.id

  // 2. Seed User
  let user: InsertUser | undefined
  try {
    if (!CLERK_USER_ID) {
      console.warn(
        "⚠️ Skipping user seeding: CLERK_USER_ID is a placeholder. Please replace it in scripts/seed.ts and re-run."
      )
    } else {
      const existingUser = await db.query.users.findFirst({
        where: (usr, { eq }) => eq(usr.userId, CLERK_USER_ID)
      })

      if (existingUser) {
        console.log(`ℹ️ User "${CLERK_USER_ID}" already exists.`)
        user = existingUser
      } else {
        ;[user] = await db
          .insert(usersTable)
          .values({ userId: CLERK_USER_ID, platformRole: "admin" }) // Make seed user an admin
          .returning()
        console.log(
          `✅ Seeded user: ${user!.userId} (Platform Role: ${user!.platformRole})`
        )
      }
    }
  } catch (error) {
    console.error("❌ Error seeding user:", error)
    // Continue seeding other data even if user fails, but log error
  }

  // 3. Seed Organization Membership (if user was seeded)
  if (user?.userId) {
    try {
      const existingMembership =
        await db.query.organizationMemberships.findFirst({
          where: (mem, { and, eq }) =>
            and(
              eq(mem.userId, user!.userId),
              eq(mem.organizationId, organizationId)
            )
        })

      if (existingMembership) {
        console.log(
          `ℹ️ Membership for user "${user.userId}" in organization "${organizationId}" already exists.`
        )
      } else {
        const [membership]: InsertOrganizationMembership[] = await db
          .insert(organizationMembershipsTable)
          .values({
            userId: user.userId,
            organizationId: organizationId,
            role: "admin" // Make user admin of the org too
          })
          .returning()
        console.log(
          `✅ Seeded membership: User ${membership.userId} as ${membership.role} in Org ${membership.organizationId}`
        )
      }
    } catch (error) {
      console.error("❌ Error seeding organization membership:", error)
      // Continue seeding other data
    }
  }

  // 4. Seed Finder Instance
  let finderInstance: InsertFinderInstance | undefined
  try {
    const existingFinder = await db.query.finderInstances.findFirst({
      where: (finder, { eq }) => eq(finder.slug, FINDER_INSTANCE_SLUG)
    })

    if (existingFinder) {
      console.log(
        `ℹ️ Finder instance with slug "${FINDER_INSTANCE_SLUG}" already exists.`
      )
      finderInstance = existingFinder
    } else {
      ;[finderInstance] = await db
        .insert(finderInstancesTable)
        .values({
          organizationId: organizationId,
          name: FINDER_INSTANCE_NAME,
          slug: FINDER_INSTANCE_SLUG,
          configuration: {
            // Basic default config
            theme: {},
            search: { defaultRadius: 10, maxRadius: 50, filters: {} },
            display: { showMap: true, showFilters: true, resultsPerPage: 10 }
          }
        })
        .returning()
      console.log(
        `✅ Seeded finder instance: ${finderInstance!.name} (Slug: ${finderInstance!.slug})`
      )
    }
  } catch (error) {
    console.error("❌ Error seeding finder instance:", error)
    // Continue seeding physicians
  }

  // 5. Seed Physicians
  console.log(`🌱 Seeding ${NUM_PHYSICIANS_TO_SEED} physicians...`)
  const physiciansToInsert: InsertPhysician[] = []
  for (let i = 0; i < NUM_PHYSICIANS_TO_SEED; i++) {
    physiciansToInsert.push(createFakePhysician())
  }

  try {
    // Use insert with onConflictDoNothing to handle potential NPI collisions if script runs multiple times
    // Note: This requires NPI to be the primary key or have a unique constraint.
    const result = await db
      .insert(physiciansTable)
      .values(physiciansToInsert)
      .onConflictDoNothing() // Skip insertion if NPI already exists
      .returning({ npi: physiciansTable.npi }) // Return NPIs of inserted rows

    console.log(`✅ Successfully seeded ${result.length} physicians.`)
    if (result.length < NUM_PHYSICIANS_TO_SEED) {
      console.log(
        `ℹ️ Skipped ${NUM_PHYSICIANS_TO_SEED - result.length} physicians due to existing NPIs.`
      )
    }
  } catch (error) {
    console.error("❌ Error seeding physicians:", error)
  }

  console.log("🏁 Database seed finished.")
}

// Run the seed function and handle exit
seed()
  .catch(error => {
    console.error("❌ Unhandled error during seeding:", error)
    process.exit(1)
  })
  .finally(async () => {
    // Ensure the script exits even if there are pending promises/timers
    // We need to explicitly end the postgres connection
    const sql = postgres(process.env.DATABASE_URL!)
    await sql.end()
    process.exit(0)
  })
