/**
 * @description
 * Defines the Drizzle schema for the `physicians` table.
 * This table stores core information about healthcare providers, primarily sourced from the NPPES registry.
 * It includes fields for identification (NPI), names, credentials, specialties, practice locations,
 * contact information, and flags for telehealth availability and spoken languages.
 * Additionally, it contains fields for AI-generated biographical information and geocoding results,
 * along with timestamps to track when this enrichment occurred and when the base NPPES data was last updated.
 * Custom PostgreSQL types (`geography`, `tsvector`) are used for geospatial queries and full-text search.
 *
 * @dependencies
 * - drizzle-orm: Used for defining the table schema and types.
 * - @/types/shared-types: Provides interfaces for JSONB field structures (`PracticeAddress`, `PhoneNumber`, `SpecialtyInfo`).
 *
 * @notes
 * - Requires PostgreSQL extensions to be enabled: `pg_trgm` (for fuzzy text search) and `postgis` (for geospatial queries).
 *   Run `CREATE EXTENSION IF NOT EXISTS pg_trgm;` and `CREATE EXTENSION IF NOT EXISTS postgis;` in your DB.
 * - A database trigger is required to automatically populate the `fullNameTsv` column for full-text search.
 *   This trigger needs to be created manually in the database (see implementation plan Step 10 instructions).
 * - Indexes are defined to optimize common query patterns:
 *   - `location_idx`: GIST index for geospatial queries (PostGIS)
 *   - `last_name_trgm_idx`, `first_name_trgm_idx`: GIN indexes for trigram-based fuzzy name search
 *   - `full_name_tsv_idx`: GIN index for full-text search
 *   - `state_zip_idx`: BTREE index for filtering by state/zip
 */
import {
  boolean,
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  type AnyPgColumn,
  customType,
  integer
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import {
  PhoneNumber,
  PracticeAddress,
  SpecialtyInfo
} from "@/types/shared-types"
import { genderEnum, statusEnum } from "./enums"

// Define custom types for PostGIS geography and tsvector
const geographyType = customType<{ data: string }>({
  dataType() {
    return "geography(Point, 4326)"
  }
})

const tsvectorType = customType<{ data: string }>({
  dataType() {
    return "tsvector"
  }
})

export const physiciansTable = pgTable(
  "physicians",
  {
    // Primary identifier
    npi: text("npi").primaryKey(),

    // Basic information
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    middleName: text("middle_name"),
    suffix: text("suffix"),
    gender: text("gender"),

    // Contact information
    primaryPhone: text("primary_phone"),
    primaryFax: text("primary_fax"),

    // Primary practice location
    primaryAddress1: text("primary_address_1"),
    primaryAddress2: text("primary_address_2"),
    primaryCity: text("primary_city"),
    primaryState: text("primary_state"),
    primaryZip: text("primary_zip"),
    location: geographyType("location"), // PostGIS geography type

    // Specialty information
    primarySpecialty: text("primary_specialty"),
    taxonomyDescription: text("taxonomy_description"),

    // Search optimization
    fullNameTsv: tsvectorType("full_name_tsv"), // tsvector type for full-text search

    // Application-specific fields
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    viewCount: integer("view_count").default(0)
  },
  table => ({
    // PostGIS GIST index for spatial queries
    locationIdx: sql`CREATE INDEX IF NOT EXISTS physicians_location_idx ON physicians USING GIST (${table.location})`,

    // GIN index for full-text search
    fullNameIdx: sql`CREATE INDEX IF NOT EXISTS physicians_full_name_idx ON physicians USING GIN (${table.fullNameTsv})`,

    // B-tree index for specialty lookups
    specialtyIdx: sql`CREATE INDEX IF NOT EXISTS physicians_specialty_idx ON physicians (${table.primarySpecialty})`,

    // B-tree index for state filtering
    stateIdx: sql`CREATE INDEX IF NOT EXISTS physicians_state_idx ON physicians (${table.primaryState})`,

    // Trigram indexes for fuzzy name search
    lastNameTrgmIdx: sql`CREATE INDEX IF NOT EXISTS physicians_last_name_trgm_idx ON physicians USING GIN (${table.lastName} gin_trgm_ops)`,

    firstNameTrgmIdx: sql`CREATE INDEX IF NOT EXISTS physicians_first_name_trgm_idx ON physicians USING GIN (${table.firstName} gin_trgm_ops)`
  })
)

// Infer TypeScript types from the schema for insertion and selection
export type InsertPhysician = typeof physiciansTable.$inferInsert
export type SelectPhysician = typeof physiciansTable.$inferSelect
