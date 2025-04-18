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
  locationId?: string // Optional reference to a specific practice location
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

// Mock data interfaces for consistent usage across components
export interface MockMetrics {
  yearsExperience: number
  rating: number
  reviewCount: number
  acceptingNewPatients: boolean
  offersOnlineScheduling: boolean
  nextAvailable: string
}

export interface MockRatingsSummary {
  overall: number
  trustworthiness: number
  explainsConditions: number
  answersQuestions: number
  providesFollowUp: number
  staffFriendliness: number
}

export interface MockPatientReview {
  name: string
  date: string
  rating: number
  comment: string
}

export interface MockHospitalAffiliation {
  name: string
  address: string
}

export interface MockOfficeHours {
  weekdays: string
  saturday: string
  sunday: string
}

export interface MockEducation {
  type: string
  institution: string
  year?: string
}

export interface MockCertification {
  name: string
  status: string
  year?: string
}

export interface MockAward {
  name: string
  years: string
}

export interface MockPatientDemographics {
  treats: string
  genders: string
}

export interface MockEnrichment {
  education: MockEducation[]
  certifications: MockCertification[]
  awards: MockAward[]
  publications: string[]
  researchInterests: string[]
  hospitalAffiliations: MockHospitalAffiliation[]
  officeHours: MockOfficeHours
  insuranceAccepted: string[]
  patientDemographics: MockPatientDemographics
  conditionsTreated: string[]
  proceduresPerformed: string[]
}

// Finder instance configuration structure
export interface FinderConfiguration {
  // UI/UX settings
  theme: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    logoUrl?: string
  }
  // Search settings
  search: {
    defaultRadius?: number // in miles
    maxRadius?: number
    defaultLocation?: {
      lat: number
      lng: number
      address?: string
    }
    filters: {
      specialties?: string[] // Taxonomy codes to filter by
      languages?: string[] // ISO language codes
      acceptingNewPatients?: boolean
      telehealth?: boolean
      gender?: "M" | "F" | "X"
      boardCertified?: boolean
    }
  }
  // Display settings
  display: {
    showMap?: boolean
    showFilters?: boolean
    resultsPerPage?: number
    sortOptions?: ("distance" | "name" | "specialty")[]
    fields?: {
      showNPI?: boolean
      showSpecialties?: boolean
      showLanguages?: boolean
      showAcceptingPatients?: boolean
      showTelehealth?: boolean
      showAddress?: boolean
      showPhone?: boolean
    }
  }
}
