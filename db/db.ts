/*
<ai_context>
Initializes the database connection using Drizzle ORM and Postgres.js.
It defines the schema object that Drizzle uses for queries.
</ai_context>
*/

import { profilesTable } from "@/db/schema" // Removed todosTable import
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Load environment variables from .env.local
config({ path: ".env.local" })

/**
 * @description Defines the database schema structure for Drizzle ORM.
 * Maps table names to their corresponding schema definitions.
 */
const schema = {
  profiles: profilesTable
  // Removed todos: todosTable
}

/**
 * @description Creates the PostgreSQL client connection using the DATABASE_URL environment variable.
 *
 * @throws {Error} If DATABASE_URL is not set in the environment variables.
 */
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.")
}
const client = postgres(process.env.DATABASE_URL)

/**
 * @description The Drizzle ORM database instance.
 * Used throughout the application to interact with the database.
 * It's configured with the Postgres.js client and the defined schema.
 */
export const db = drizzle(client, { schema })
