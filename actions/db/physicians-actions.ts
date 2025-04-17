/**
 * @description
 * Contains server actions for querying physician data from the `physicians` table.
 * These actions handle searching, filtering, and retrieving individual physician profiles.
 *
 * @dependencies
 * - drizzle-orm: Used for database query building (e.g., `eq`, `and`, `or`, `sql`, `desc`, `asc`, `gt`, `ilike`, `count`).
 * - @/db/db: Provides the Drizzle database instance.
 * - @/db/schema: Provides the `physiciansTable` schema and inferred types (`SelectPhysician`).
 * - @/types: Provides the `ActionState` type for standardized action responses.
 * - @/lib/utils: Provides utility functions (currently unused here but potentially useful later).
 *
 * @notes
 * - Actions follow the `ActionState` pattern for returning success/failure status, messages, and data.
 * - Error handling is included to catch database operation failures.
 * - Search functionality utilizes PostgreSQL's `pg_trgm` extension for fuzzy matching on names.
 * - Geospatial searching (radius) is planned for a later step.
 * - Full-text search using `tsvector` is also planned for refinement.
 */
"use server"

import { db } from "@/db/db"
import { SelectPhysician, physiciansTable } from "@/db/schema"
import { ActionState } from "@/types"
import { cn } from "@/lib/utils" // Currently unused, but available
import { and, asc, count, desc, eq, gt, ilike, or, sql } from "drizzle-orm"

// Define the structure for search parameters
interface SearchParams {
  query?: string // Combined text query for name, specialty, location
  filters?: {
    state?: string
    zip?: string
    // Add other filters like language, telehealth later
  }
  page?: number
  limit?: number
  sortBy?: "name" | "specialty" // Add 'distance' later
  sortOrder?: "asc" | "desc"
}

// Define the structure for the search results, including pagination info
interface SearchResults {
  physicians: SelectPhysician[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const DEFAULT_PAGE_LIMIT = 10
const MIN_SIMILARITY_THRESHOLD = 0.1 // Adjust as needed for fuzzy search sensitivity

/**
 * @description Searches for physicians based on text query, filters, sorting, and pagination.
 * Uses fuzzy matching for names and basic filtering for location (state/zip).
 * @param {SearchParams} params - The search parameters including query, filters, pagination, and sorting.
 * @returns {Promise<ActionState<SearchResults>>} Action result with the list of matching physicians and pagination info, or error info.
 */
export async function searchPhysiciansAction(
  params: SearchParams
): Promise<ActionState<SearchResults>> {
  try {
    const {
      query,
      filters,
      page = 1,
      limit = DEFAULT_PAGE_LIMIT,
      sortBy,
      sortOrder = "asc"
    } = params
    const offset = (page - 1) * limit

    // --- Build WHERE conditions ---
    const conditions = []

    // Text Query (Fuzzy Name Search + Basic Location/Specialty)
    if (query && query.trim()) {
      const cleanedQuery = query.trim()
      // Use pg_trgm for fuzzy matching on first and last names
      // Use ILIKE for basic matching on specialty description and location (state/zip)
      conditions.push(
        or(
          // Fuzzy name match using similarity (requires pg_trgm extension)
          sql`similarity(physicians.first_name, ${cleanedQuery}) > ${MIN_SIMILARITY_THRESHOLD}`,
          sql`similarity(physicians.last_name, ${cleanedQuery}) > ${MIN_SIMILARITY_THRESHOLD}`,
          // Basic ILIKE matching for specialty (within JSONB) - might need refinement
          sql`physicians.primary_specialty ->> 'taxonomyDescription' ilike ${`%${cleanedQuery}%`}`,
          // Basic ILIKE matching for state/zip
          ilike(physiciansTable.addressState, `%${cleanedQuery}%`),
          ilike(physiciansTable.addressZip5, `%${cleanedQuery}%`)
          // TODO: Add full_name_tsv matching later
        )
      )
    }

    // Specific Filters
    if (filters?.state) {
      // Ensure state filter uses uppercase as stored in DB
      conditions.push(
        eq(physiciansTable.addressState, filters.state.toUpperCase())
      )
    }
    if (filters?.zip) {
      // Match 5-digit zip prefix
      conditions.push(
        sql`${physiciansTable.addressZip5} like ${`${filters.zip}%`}`
      )
    }
    // TODO: Add filters for language, telehealth, etc.

    // Combine conditions with AND
    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined

    // --- Build ORDER BY clause ---
    let orderByClause = []
    switch (sortBy) {
      case "name":
        orderByClause.push(
          sortOrder === "asc"
            ? asc(physiciansTable.lastName)
            : desc(physiciansTable.lastName)
        )
        orderByClause.push(
          sortOrder === "asc"
            ? asc(physiciansTable.firstName)
            : desc(physiciansTable.firstName)
        ) // Secondary sort by first name
        break
      case "specialty":
        // Sorting by JSONB field requires specific SQL or casting
        orderByClause.push(
          sql`physicians.primary_specialty ->> 'taxonomyDescription' ${sortOrder === "asc" ? sql`ASC` : sql`DESC`}`
        )
        break
      // case "distance": // Add distance sorting later with PostGIS
      //   break;
      default:
        // Default sort or handle no sort preference
        orderByClause.push(asc(physiciansTable.lastName)) // Default sort by last name A-Z
    }

    // --- Execute Queries ---
    // Query for the paginated results
    const physicians = await db.query.physicians.findMany({
      where: whereCondition,
      orderBy: orderByClause,
      limit: limit,
      offset: offset
    })

    // Query for the total count matching the criteria
    const totalResult = await db
      .select({ total: count() })
      .from(physiciansTable)
      .where(whereCondition)

    const totalCount = totalResult[0]?.total ?? 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      isSuccess: true,
      message: "Physicians retrieved successfully",
      data: {
        physicians,
        totalCount,
        currentPage: page,
        totalPages
      }
    }
  } catch (error) {
    console.error("Error searching physicians:", error)
    return {
      isSuccess: false,
      message: "Failed to search physicians. Please try again later."
    }
  }
}

/**
 * @description Retrieves a single physician record by their NPI.
 * @param {string} npi - The National Provider Identifier.
 * @returns {Promise<ActionState<SelectPhysician>>} Action result with the physician data or error info.
 */
export async function getPhysicianByNpiAction(
  npi: string
): Promise<ActionState<SelectPhysician>> {
  try {
    if (!npi) {
      return { isSuccess: false, message: "NPI is required" }
    }

    const physician = await db.query.physicians.findFirst({
      where: eq(physiciansTable.npi, npi)
    })

    if (!physician) {
      return { isSuccess: false, message: "Physician not found" }
    }

    return {
      isSuccess: true,
      message: "Physician retrieved successfully",
      data: physician
    }
  } catch (error) {
    console.error(`Error getting physician by NPI ${npi}:`, error)
    return {
      isSuccess: false,
      message: "Failed to retrieve physician details."
    }
  }
}
