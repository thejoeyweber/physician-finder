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
const MIN_SIMILARITY_THRESHOLD = 0.1 // For fuzzy matching fallback
const MIN_RANK_THRESHOLD = 0.01 // Minimum ts_rank threshold for full-text search

/**
 * @description Searches for physicians based on text query, filters, sorting, and pagination.
 * Uses full-text search (tsvector) for names with fuzzy matching fallback,
 * and basic filtering for location (state/zip).
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

    // Text Query (Full-text Search + Fuzzy Name Search + Basic Location/Specialty)
    if (query && query.trim()) {
      const cleanedQuery = query.trim()

      // Convert search query to tsquery format
      const tsQuery = cleanedQuery
        .split(/\s+/)
        .filter(Boolean)
        .map(term => `${term}:*`) // Add prefix matching
        .join(" & ")

      conditions.push(
        or(
          // Full-text search on names using ts_rank for relevance
          sql`${physiciansTable.fullNameTsv} @@ to_tsquery('english', ${tsQuery})`,

          // Fuzzy name match using similarity as a fallback
          sql`(
            similarity(physicians.first_name, ${cleanedQuery}) > ${MIN_SIMILARITY_THRESHOLD} OR
            similarity(physicians.last_name, ${cleanedQuery}) > ${MIN_SIMILARITY_THRESHOLD}
          )`,

          // Basic matching for specialty
          sql`physicians.primary_specialty ilike ${`%${cleanedQuery}%`}`,
          sql`physicians.taxonomy_description ilike ${`%${cleanedQuery}%`}`,

          // Basic matching for location
          ilike(physiciansTable.primaryState, `%${cleanedQuery}%`),
          ilike(physiciansTable.primaryZip, `%${cleanedQuery}%`)
        )
      )
    }

    // Specific Filters
    if (filters?.state) {
      // Ensure state filter uses uppercase as stored in DB
      conditions.push(
        eq(physiciansTable.primaryState, filters.state.toUpperCase())
      )
    }
    if (filters?.zip) {
      // Match 5-digit zip prefix
      conditions.push(
        sql`${physiciansTable.primaryZip} like ${`${filters.zip}%`}`
      )
    }

    // Combine conditions with AND
    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined

    // --- Build ORDER BY clause ---
    let orderByClause = []

    // If there's a search query, prioritize results by relevance
    if (query?.trim()) {
      const tsQuery = query
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(term => `${term}:*`)
        .join(" & ")

      orderByClause.push(
        // Rank results by full-text match score
        sql`ts_rank(${physiciansTable.fullNameTsv}, to_tsquery('english', ${tsQuery})) DESC`,
        // Then by similarity score for fuzzy matching
        sql`GREATEST(
          similarity(physicians.first_name, ${query}),
          similarity(physicians.last_name, ${query})
        ) DESC`
      )
    }

    // Add user-specified sorting as secondary criteria
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
        )
        break
      case "specialty":
        orderByClause.push(
          sql`physicians.primary_specialty ${sortOrder === "asc" ? sql`ASC` : sql`DESC`}`
        )
        break
      default:
        if (!query?.trim()) {
          // Only use default sort if no search query (otherwise use relevance)
          orderByClause.push(asc(physiciansTable.lastName))
        }
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
