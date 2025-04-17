/**
 * @description
 * Defines the Drizzle schema for the `users` table (previously `profiles`).
 * This table links authenticated users (managed by Clerk) to internal platform-specific data.
 * It stores the Clerk user ID as the primary key and includes platform-level roles
 * and standard timestamps.
 *
 * @dependencies
 * - drizzle-orm: Used for defining the table schema and types.
 * - ./enums: Provides the `userRoleEnum` for defining platform roles.
 *
 * @notes
 * - The `userId` corresponds to the ID provided by Clerk authentication.
 * - `platformRole` defines user permissions at the application level (e.g., 'admin' for platform administrators, 'member' for regular organization users).
 * - Stripe-related fields from the original `profilesTable` have been removed as per the spec.
 * - Timestamps track creation and last update times.
 */
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { userRoleEnum } from "./enums"

export const usersTable = pgTable("users", {
  // Primary key, corresponds to the Clerk user ID
  userId: text("user_id").primaryKey(),

  // Platform-level role for the user (e.g., admin, member)
  // Defaults to 'member'. Platform admins need to be updated manually or via seeding.
  platformRole: userRoleEnum("platform_role").notNull().default("member"),

  // Standard Timestamps (required by backend rules)
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Infer TypeScript types from the schema for insertion and selection
export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
