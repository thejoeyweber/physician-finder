/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { membershipEnum } from "./enums"

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect
