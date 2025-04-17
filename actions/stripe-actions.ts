/**
 * @description
 * Contains server actions related to Stripe.
 * NOTE: These actions are currently non-functional as Stripe fields have been removed
 * from the user schema for the MVP. They are kept as placeholders for potential future integration.
 *
 * @dependencies
 * - @/actions/db/users-actions: Provides actions to update user data (currently incompatible).
 * - @/db/schema: Provides user schema types (currently incompatible).
 * - @/lib/stripe: Provides the initialized Stripe client.
 * - stripe: Stripe Node.js library.
 *
 * @notes
 * - This file requires significant updates if Stripe integration is reintroduced.
 * - Functions like `updateStripeCustomer` and `manageSubscriptionStatusChange` rely on
 *   fields (`stripeCustomerId`, `stripeSubscriptionId`, `membership`) that no longer exist
 *   in the `usersTable`.
 */
import { updateUserAction } from "@/actions/db/users-actions"
import { SelectUser } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

// Define a placeholder type as the original SelectProfile['membership'] is gone
type MembershipStatus = "free" | "pro" | string // Placeholder

const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free"
    default:
      return "free"
  }
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

// FIXME: This function needs rework as usersTable no longer has stripe fields.
export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  console.warn(
    "updateStripeCustomer action called, but usersTable schema lacks Stripe fields. Skipping update."
  )
  return null // Return null or handle appropriately
}

// FIXME: This function needs rework as usersTable no longer has stripe fields.
export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  console.warn(
    "manageSubscriptionStatusChange action called, but usersTable schema lacks Stripe fields. Skipping update."
  )
  return "free" // Placeholder return
}
