import { pgEnum } from "drizzle-orm/pg-core"

// User roles for platform and organization access
export const userRoleEnum = pgEnum("user_role", ["admin", "member"])

// Membership tiers (from starter template)
export const membershipEnum = pgEnum("membership", ["free", "pro"])

// Physician status in NPPES registry
export const statusEnum = pgEnum("status", ["A", "I", "D", "R"]) // Active, Inactive, Deactivated, Retired

// Physician gender in NPPES registry
export const genderEnum = pgEnum("gender", ["M", "F", "X"])

// Domain verification status for finder instances
export const finderDomainStatusEnum = pgEnum("finder_domain_status", [
  "pending",
  "verified",
  "failed",
  "inactive"
])
