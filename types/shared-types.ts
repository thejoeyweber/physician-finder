/**
 * Shared type definitions for the physician finder application
 */

// Address structure following NPPES format
export interface PracticeAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string // Two-letter state code
  zipCode: string // Full ZIP+4 format
  countryCode: string // ISO 3166-1 alpha-2
  addressType: "LOCATION" | "MAILING"
  addressPurpose: "PRACTICE" | "HOME" | "ADMINISTRATIVE"
  isPrimary: boolean
}

// Phone number structure following NPPES format
export interface PhoneNumber {
  number: string // E.164 format
  type: "PRACTICE" | "FAX" | "DIRECT" | "MOBILE"
  isPrimary: boolean
}

// Specialty information structure
export interface SpecialtyInfo {
  taxonomyCode: string // NUCC taxonomy code
  taxonomyDescription: string
  licenseNumber?: string
  licenseState?: string
  primarySpecialty: boolean
  boardCertified?: boolean
}
