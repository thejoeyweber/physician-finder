/**
 * @description
 * Contains server actions for managing user data in the `users` table.
 * These actions handle creating, retrieving, updating, and deleting user records,
 * primarily linking Clerk authentication IDs to internal platform roles and data.
 *
 * @dependencies
 * - @/db/db: Provides the Drizzle database instance.
 * - @/db/schema: Provides the `usersTable` schema and inferred types (`InsertUser`, `SelectUser`).
 * - @/types: Provides the `ActionState` type for standardized action responses.
 * - drizzle-orm: Used for database query building (e.g., `eq`).
 *
 * @notes
 * - Actions follow the `ActionState` pattern for returning success/failure status, messages, and data.
 * - Error handling is included to catch database operation failures.
 * - `getOrCreateUserAction` is crucial for ensuring a user record exists in the local DB after Clerk authentication.
 */
"use server"

import { db } from "@/db/db"
import { InsertUser, SelectUser, usersTable } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * @description Creates a new user record in the database.
 * Typically used internally by `getOrCreateUserAction`.
 * @param {InsertUser} data - The user data to insert (requires `userId`).
 * @returns {Promise<ActionState<SelectUser>>} Action result with the newly created user or error info.
 */
export async function createUserAction(
  data: InsertUser
): Promise<ActionState<SelectUser>> {
  try {
    // Check if userId is provided
    if (!data.userId) {
      return { isSuccess: false, message: "User ID is required to create user" }
    }

    const [newUser] = await db.insert(usersTable).values(data).returning()
    return {
      isSuccess: true,
      message: "User created successfully",
      data: newUser
    }
  } catch (error) {
    console.error("Error creating user:", error)
    // Handle potential unique constraint violation if needed
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return { isSuccess: false, message: "User already exists." }
    }
    return { isSuccess: false, message: "Failed to create user" }
  }
}

/**
 * @description Retrieves a user record by their Clerk User ID.
 * @param {string} userId - The Clerk User ID.
 * @returns {Promise<ActionState<SelectUser>>} Action result with the user data or error info.
 */
export async function getUserByIdAction(
  userId: string
): Promise<ActionState<SelectUser>> {
  try {
    if (!userId) {
      return { isSuccess: false, message: "User ID is required" }
    }
    const user = await db.query.users.findFirst({
      where: eq(usersTable.userId, userId)
    })
    if (!user) {
      return { isSuccess: false, message: "User not found" }
    }

    return {
      isSuccess: true,
      message: "User retrieved successfully",
      data: user
    }
  } catch (error) {
    console.error("Error getting user by user id", error)
    return { isSuccess: false, message: "Failed to get user" }
  }
}

/**
 * @description Retrieves a user record by Clerk User ID, creating one if it doesn't exist.
 * This should be called after a user signs in or signs up via Clerk.
 * @param {string} userId - The Clerk User ID.
 * @param {Partial<InsertUser>} [defaults] - Optional default values if creating a new user (e.g., platformRole).
 * @returns {Promise<ActionState<SelectUser>>} Action result with the user data or error info.
 */
export async function getOrCreateUserAction(
  userId: string,
  defaults?: Partial<InsertUser>
): Promise<ActionState<SelectUser>> {
  if (!userId) {
    return { isSuccess: false, message: "User ID is required" }
  }

  // Try to get the user first
  const getUserResult = await getUserByIdAction(userId)

  if (getUserResult.isSuccess) {
    return getUserResult // User found, return it
  }

  // If user not found, attempt to create
  if (getUserResult.message === "User not found") {
    console.log(`User ${userId} not found, creating new user record.`)
    const createUserResult = await createUserAction({
      userId,
      ...defaults // Apply defaults if provided
    })
    return createUserResult
  }

  // Return original error if it wasn't 'User not found'
  return getUserResult
}

/**
 * @description Updates an existing user record.
 * @param {string} userId - The Clerk User ID of the user to update.
 * @param {Partial<InsertUser>} data - The fields to update (e.g., `platformRole`).
 * @returns {Promise<ActionState<SelectUser>>} Action result with the updated user data or error info.
 */
export async function updateUserAction(
  userId: string,
  data: Partial<InsertUser>
): Promise<ActionState<SelectUser>> {
  try {
    if (!userId) {
      return { isSuccess: false, message: "User ID is required" }
    }
    // Ensure userId is not being updated
    const { userId: dataUserId, ...updateData } = data
    if (Object.keys(updateData).length === 0) {
      return { isSuccess: false, message: "No update data provided" }
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.userId, userId))
      .returning()

    if (!updatedUser) {
      return { isSuccess: false, message: "User not found to update" }
    }

    return {
      isSuccess: true,
      message: "User updated successfully",
      data: updatedUser
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return { isSuccess: false, message: "Failed to update user" }
  }
}

/**
 * @description Deletes a user record by their Clerk User ID.
 * @param {string} userId - The Clerk User ID of the user to delete.
 * @returns {Promise<ActionState<void>>} Action result indicating success or failure.
 */
export async function deleteUserAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    if (!userId) {
      return { isSuccess: false, message: "User ID is required" }
    }
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.userId, userId))
      .returning({ id: usersTable.userId })

    if (result.length === 0) {
      return { isSuccess: false, message: "User not found to delete" }
    }

    return {
      isSuccess: true,
      message: "User deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { isSuccess: false, message: "Failed to delete user" }
  }
}
