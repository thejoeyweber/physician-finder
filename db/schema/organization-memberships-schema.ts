/**
 * @description
 * Defines the Drizzle schema for the `organization_memberships` table.
 * This is a join table connecting users (`usersTable`) to organizations (`organizationsTable`),
 * establishing a many-to-many relationship. It also assigns a role to the user within
 * the context of that specific organization (e.g., 'admin' or 'member' of the organization).
 *
 * @dependencies
 * - drizzle-orm: Used for defining the table schema and types.
 * - ./users-schema: Defines the `usersTable` referenced by the `userId` foreign key.
 * - ./organizations-schema: Defines the `organizationsTable` referenced by the `organizationId` foreign key.
 * - ./enums: Provides the `userRoleEnum` for defining organization roles.
 *
 * @notes
 * - A composite primary key is defined on `userId` and `organizationId` to ensure uniqueness of memberships.
 * - Foreign key constraints enforce referential integrity.
 * - `onDelete: 'cascade'` ensures that if a user or organization is deleted, their corresponding memberships are also removed.
 * - Timestamps track creation and last update times for the membership record itself.
 */
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { usersTable } from "./users-schema"
import { organizationsTable } from "./organizations-schema"
import { userRoleEnum } from "./enums"

export const organizationMembershipsTable = pgTable(
  "organization_memberships",
  {
    // Foreign key referencing the user's ID in the users table
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.userId, { onDelete: "cascade" }),

    // Foreign key referencing the organization's ID in the organizations table
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),

    // Role of the user within this specific organization (e.g., admin, member)
    role: userRoleEnum("role").notNull().default("member"),

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
    // Composite primary key to ensure a user can only have one role per organization
    pk: primaryKey({ columns: [table.userId, table.organizationId] })
  })
)

// Infer TypeScript types from the schema for insertion and selection
export type InsertOrganizationMembership =
  typeof organizationMembershipsTable.$inferInsert
export type SelectOrganizationMembership =
  typeof organizationMembershipsTable.$inferSelect
