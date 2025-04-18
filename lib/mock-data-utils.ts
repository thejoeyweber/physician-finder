/**
 * @description
 * Utilities for generating and managing mock data in the physician finder application.
 * This file centralizes all mock data generation to ensure consistency across components
 * and clearly distinguish between real NPPES data and mock/placeholder data.
 */

"use client"

import type { SelectPhysician } from "@/db/schema"
import type {
  MockMetrics,
  MockPatientReview,
  MockRatingsSummary,
  MockEnrichment,
  MockEducation,
  MockCertification,
  MockAward,
  MockHospitalAffiliation,
  MockOfficeHours,
  MockPatientDemographics
} from "@/types/shared-types"
import { InfoIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import type { ReactElement } from "react"
import { MockDataIndicator } from "@/components/ui/mock-data-indicator"

// Helper function to generate consistent mock metrics
export function getMockMetrics(physician: SelectPhysician): MockMetrics {
  // Use a deterministic "random" value based on NPI to ensure consistency
  const npiSeed = parseInt(physician.npi.slice(-4), 10)
  const baseYears = 5 + (npiSeed % 25) // 5-30 years experience
  const baseRating = 3.5 + (npiSeed % 15) / 10 // 3.5-5.0 rating

  return {
    yearsExperience: baseYears,
    rating: Math.round(baseRating * 10) / 10,
    reviewCount: 10 + (npiSeed % 90), // 10-100 reviews
    acceptingNewPatients: npiSeed % 4 !== 0, // 75% chance of accepting
    offersOnlineScheduling: npiSeed % 3 === 0, // 33% chance of online scheduling
    nextAvailable: ["Today", "Tomorrow", "Next Week"][npiSeed % 3]
  }
}

// Helper function to generate mock reviews
export function getMockReviews(
  physician: SelectPhysician
): MockPatientReview[] {
  const npiSeed = parseInt(physician.npi.slice(-4), 10)
  const metrics = getMockMetrics(physician)

  // Generate 3 reviews with ratings that average close to the overall rating
  return [
    {
      name: "Sarah J.",
      date: "March 15, 2025",
      rating: Math.min(5, Math.round(metrics.rating + 0.3)),
      comment: `Dr. ${physician.lastName} was very thorough and took the time to explain everything. I never felt rushed during my appointment.`
    },
    {
      name: "Michael T.",
      date: "February 28, 2025",
      rating: Math.max(1, Math.round(metrics.rating - 0.3)),
      comment: `Very knowledgeable doctor. The wait time was a bit long, but the care I received was worth it.`
    },
    {
      name: "Jessica L.",
      date: "January 10, 2025",
      rating: Math.round(metrics.rating),
      comment: `I've been seeing Dr. ${physician.lastName} for years and have always received excellent care. Highly recommend!`
    }
  ]
}

// Helper function to generate mock ratings summary
export function getMockRatings(physician: SelectPhysician): MockRatingsSummary {
  const metrics = getMockMetrics(physician)
  const baseRating = metrics.rating

  return {
    overall: baseRating,
    trustworthiness: Math.round((baseRating + 0.3) * 10) / 10,
    explainsConditions: Math.round((baseRating + 0.1) * 10) / 10,
    answersQuestions: Math.round((baseRating - 0.1) * 10) / 10,
    providesFollowUp: Math.round((baseRating - 0.2) * 10) / 10,
    staffFriendliness: Math.round((baseRating - 0.3) * 10) / 10
  }
}

// Helper function to generate specialty-specific mock data
export function getMockEnrichment(physician: SelectPhysician): MockEnrichment {
  const specialtyName =
    physician.primarySpecialty?.taxonomyDescription?.toLowerCase() || ""

  // Default mock data
  const defaultData: MockEnrichment = {
    education: [
      {
        type: "Medical School",
        institution: "University of Example Medicine",
        year: "2010"
      },
      {
        type: "Residency",
        institution: "General Example Hospital",
        year: "2013"
      },
      {
        type: "Fellowship",
        institution: "Specialty Example Clinic",
        year: "2015"
      }
    ],
    certifications: [
      {
        name: "American Board of Example Medicine",
        status: "Certified",
        year: "2015"
      },
      { name: "State Medical License", status: "Active", year: "2015" }
    ],
    awards: [
      { name: "Top Doctor Award", years: "2023, 2024" },
      { name: "Patient's Choice Award", years: "2022, 2023, 2024" },
      { name: "Compassionate Doctor Recognition", years: "2021, 2022, 2023" }
    ],
    publications: [
      "Example Publication Title 1 - Journal of Examples, 2023",
      "Example Publication Title 2 - Medical Example Review, 2022"
    ],
    researchInterests: [
      "Clinical Outcomes",
      "Patient Care Quality",
      "Treatment Innovation"
    ],
    hospitalAffiliations: [
      {
        name: "Memorial Hospital",
        address: "500 Medical Center Dr, Springfield, IL 62704"
      },
      {
        name: "University Medical Center",
        address: "1200 University Ave, Springfield, IL 62704"
      }
    ],
    officeHours: {
      weekdays: "9:00 AM - 5:00 PM",
      saturday: "9:00 AM - 12:00 PM",
      sunday: "Closed"
    },
    insuranceAccepted: [
      "Medicare",
      "Blue Cross Blue Shield",
      "Aetna",
      "UnitedHealthcare",
      "Cigna"
    ],
    patientDemographics: {
      treats: "Adults and Children",
      genders: "All genders welcome"
    },
    conditionsTreated: [
      "General Medical Conditions",
      "Chronic Disease Management",
      "Preventive Care"
    ],
    proceduresPerformed: [
      "Physical Examinations",
      "Health Screenings",
      "Diagnostic Tests"
    ]
  }

  // Specialty-specific overrides
  if (specialtyName.includes("cardio")) {
    defaultData.conditionsTreated = [
      "Heart Disease",
      "Hypertension",
      "Arrhythmia",
      "Heart Failure",
      "Coronary Artery Disease",
      "Valve Disorders"
    ]
    defaultData.proceduresPerformed = [
      "Echocardiogram",
      "Stress Test",
      "Cardiac Catheterization",
      "Pacemaker Implantation",
      "Cardioversion",
      "Holter Monitoring"
    ]
    defaultData.researchInterests = [
      "Preventive Cardiology",
      "Hypertension Management",
      "Heart Failure Treatment Outcomes"
    ]
  } else if (specialtyName.includes("pediatric")) {
    defaultData.conditionsTreated = [
      "Childhood Illnesses",
      "Developmental Disorders",
      "Asthma",
      "Allergies",
      "Growth and Development",
      "Behavioral Issues"
    ]
    defaultData.proceduresPerformed = [
      "Well-Child Visits",
      "Immunizations",
      "Growth Assessments",
      "Developmental Screenings"
    ]
    defaultData.patientDemographics.treats = "Children (0-18 years)"
  }

  return defaultData
}

// Helper function to check if a field is using mock data
export function isMockData(field: keyof MockEnrichment): boolean {
  return true // All fields in MockEnrichment are mock data
}

// Helper function to check if a metric is using mock data
export function isMockMetric(field: keyof MockMetrics): boolean {
  return true // All fields in MockMetrics are mock data
}

// Helper function to get a human-readable label for mock data
export function getMockDataLabel(field: string): string {
  return `Mock ${field}`
}
