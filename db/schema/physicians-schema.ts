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
 * - Indexes are defined to optimize common query patterns, including geospatial search (`location_idx`),
 *   fuzzy name search (`last_name_trgm_idx`, `first_name_trgm_idx`), full-text search (`full_name_tsv_idx`),
 *   and filtering by state/zip (`state_zip_idx`).
 */
import {
  boolean,
  date,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  type AnyPgColumn
} from "drizzle-orm/pg-core"
import {
  PhoneNumber,
  PracticeAddress,
  SpecialtyInfo
} from "@/types/shared-types"

// Define custom PostgreSQL types
const geographyPoint = (name: string) => text(name).notNull() // We'll cast this to geography in the DB
const tsvector = (name: string) => text(name) // We'll cast this to tsvector in the DB

// Enums for standardized fields
export const genderEnum = pgEnum("gender", ["M", "F", "X"])
export const statusEnum = pgEnum("status", ["A", "I", "D", "R"]) // Active, Inactive, Deactivated, Retired

export const physiciansTable = pgTable(
  "physicians",
  {
    // Core NPPES Fields
    npi: text("npi").primaryKey(), // National Provider Identifier
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    middleName: text("middle_name"),
    suffix: text("suffix"), // e.g., Jr., Sr., III
    credential: text("credential"), // e.g., M.D., D.O.
    gender: genderEnum("gender"),
    status: statusEnum("status").notNull().default("A"),

    // NPPES Enumeration Details
    enumerationDate: date("enumeration_date").notNull(),
    lastUpdatedNPPES: date("last_updated_nppes"),
    deactivationDate: date("deactivation_date"),
    deactivationReason: text("deactivation_reason"),
    reactivationDate: date("reactivation_date"),

    // Specialties (Stored as JSONB for flexibility)
    primarySpecialty: jsonb("primary_specialty").$type<SpecialtyInfo>(),
    secondarySpecialties: jsonb("secondary_specialties")
      .$type<SpecialtyInfo[]>()
      .default([]), // Array of secondary specialties

    // Practice Locations and Contact Info (Stored as JSONB)
    addresses: jsonb("addresses").$type<PracticeAddress[]>().default([]), // Array of practice addresses
    phoneNumbers: jsonb("phone_numbers").$type<PhoneNumber[]>().default([]), // Array of phone numbers

    // Derived/Normalized Address Fields for Indexing/Filtering
    // These should be populated during the ETL process
    addressState: text("address_state"), // Primary practice address state (uppercased)
    addressZip5: text("address_zip5"), // Primary practice address 5-digit ZIP

    // Geospatial Data
    location: geographyPoint("location"), // PostGIS geography point for primary practice location

    // Additional Filters
    languages: text("languages").array(), // Array of ISO 639-1 language codes spoken
    acceptsTelehealth: boolean("accepts_telehealth").default(false),

    // AI Enrichment Fields
    aiBio: text("ai_bio"), // AI-generated biography/summary
    aiBioSource: text("ai_bio_source"), // Source used for AI bio (e.g., model name)
    aiBioVersion: text("ai_bio_version"), // Identifier for the prompt/model version used ("modelName_promptHash")
    aiBioEnrichedAt: timestamp("ai_bio_enriched_at", { withTimezone: true }), // Timestamp of AI bio enrichment

    // Geocoding Enrichment Fields
    geoEnrichedAt: timestamp("geo_enriched_at", { withTimezone: true }), // Timestamp of geocoding enrichment

    // Standard Timestamps (required by backend rules)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),

    // Full-Text Search Field
    fullNameTsv: tsvector("full_name_tsv") // TSVector for full-name search (populated by trigger)
  },
  table => ({
    // Indexes
    // Note: The actual index types (GIST, GIN) will be created in the migration SQL
    locationIdx: index("location_idx").on(table.location),
    lastNameTrgmIdx: index("last_name_trgm_idx").on(table.lastName),
    firstNameTrgmIdx: index("first_name_trgm_idx").on(table.firstName),
    fullNameTsvIdx: index("full_name_tsv_idx").on(table.fullNameTsv),
    stateZipIdx: index("state_zip_idx").on(
      table.addressState,
      table.addressZip5
    ),
    npiIdx: index("npi_idx").on(table.npi)
  })
)

// Infer TypeScript types from the schema for insertion and selection
export type InsertPhysician = typeof physiciansTable.$inferInsert
export type SelectPhysician = typeof physiciansTable.$inferSelect
