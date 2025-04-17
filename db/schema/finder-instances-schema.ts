/**
 * @description
 * Defines the Drizzle schema for the `finder_instances` table.
 * This table stores configuration details for each specific physician finder instance
 * created by a partner organization. It links to the organization, defines how the
 * finder behaves (filters, displayed fields), and manages its hosting details
 * (slug, custom domain, Vercel integration).
 *
 * @dependencies
 * - drizzle-orm: Used for defining the table schema, types, and indexes.
 * - ./organizations-schema: Defines the `organizationsTable` referenced by the `organizationId` foreign key.
 * - ./enums: Provides the `finderDomainStatusEnum` for the `domainStatus` column.
 * - @/types/shared-types: Provides the `FinderConfiguration` interface for the `configuration` JSONB field.
 */
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core"
import { organizationsTable } from "./organizations-schema"
import { finderDomainStatusEnum } from "./enums"
import { FinderConfiguration } from "@/types/shared-types"

export const finderInstancesTable = pgTable(
  "finder_instances",
  {
    // Unique identifier for the finder instance
    id: uuid("id").primaryKey().defaultRandom(),

    // Foreign key linking to the owning organization
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),

    // User-friendly name for the finder instance (e.g., "Endocrinology Finder - West Coast")
    name: text("name").notNull(),

    // Unique slug for path-based routing (e.g., "endo-west")
    slug: text("slug").notNull(),

    // The primary host where this finder instance should be served.
    // Can be a custom domain (e.g., "findadoc.partner.com") or a platform subdomain (e.g., "endo-west.ourplatform.com").
    // Used for host-based routing lookups in middleware.
    canonicalHost: text("canonical_host"),

    // JSONB field storing the configuration object (filters, UI settings, etc.)
    // Typed using the FinderConfiguration interface. Defaults to an empty object.
    configuration: jsonb("configuration")
      .$type<FinderConfiguration>()
      .notNull()
      .default({}),

    // The custom domain name (CNAME target) provided by the organization (e.g., "physicians.brand.com")
    customDomain: text("custom_domain"),

    // ID returned by Vercel API when adding the custom domain, used for status polling.
    vercelDomainId: text("vercel_domain_id"),

    // Status of the custom domain verification process (e.g., pending, verified, failed)
    domainStatus: finderDomainStatusEnum("domain_status"),

    // Unique ID used to generate the embed script URL (e.g., /api/embed/[scriptId].js)
    embedScriptId: text("embed_script_id"),

    // Standard Timestamps (required by backend rules)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  table => ({
    // Unique indexes to prevent conflicts and optimize lookups
    slugIdx: uniqueIndex("slug_idx").on(table.slug),
    canonicalHostIdx: uniqueIndex("canonical_host_idx").on(table.canonicalHost),
    customDomainIdx: uniqueIndex("custom_domain_idx").on(table.customDomain),
    embedScriptIdIdx: uniqueIndex("embed_script_id_idx").on(table.embedScriptId)
  })
)

// Infer TypeScript types from the schema for insertion and selection
export type InsertFinderInstance = typeof finderInstancesTable.$inferInsert
export type SelectFinderInstance = typeof finderInstancesTable.$inferSelect
