/**
 * @description
 * Centralized mock data for use across components.
 * This data simulates information that will be available in future phases
 * or from external integrations. All mock data is properly typed using
 * interfaces from @/types/shared-types.
 */

import type {
  MockRatingsSummary,
  MockPatientReview,
  MockHospitalAffiliation,
  MockOfficeHours,
  MockEducation,
  MockCertification,
  MockAward
} from "@/types/shared-types"

// Basic mock values
export const mockYearsExperience = 15
export const mockRating = 4.2
export const mockReviewCount = 42
export const mockAcceptingNewPatients = true
export const mockOffersTelehealth = true

// Common conditions and procedures (example for a cardiologist)
export const mockConditionsTreated: string[] = [
  "Heart Disease",
  "Hypertension",
  "Arrhythmia",
  "Heart Failure",
  "Coronary Artery Disease",
  "Valve Disorders"
]

export const mockProceduresPerformed: string[] = [
  "Echocardiogram",
  "Stress Test",
  "Cardiac Catheterization",
  "Pacemaker Implantation",
  "Cardioversion",
  "Holter Monitoring"
]

// Structured mock data
export const mockHospitalAffiliations: MockHospitalAffiliation[] = [
  {
    name: "Memorial Hospital",
    address: "500 Medical Center Dr, Springfield, IL 62704"
  },
  {
    name: "University Medical Center",
    address: "1200 University Ave, Springfield, IL 62704"
  }
]

export const mockOfficeHours: MockOfficeHours = {
  weekdays: "9:00 AM - 5:00 PM",
  saturday: "9:00 AM - 12:00 PM",
  sunday: "Closed"
}

export const mockRatingsSummary: MockRatingsSummary = {
  overall: 4.2,
  trustworthiness: 4.5,
  explainsConditions: 4.3,
  answersQuestions: 4.1,
  providesFollowUp: 4.0,
  staffFriendliness: 3.9
}

export const mockPatientReviews: MockPatientReview[] = [
  {
    name: "Sarah J.",
    date: "March 15, 2025",
    rating: 5,
    comment:
      "Dr. Reed was very thorough and took the time to explain everything to me. I never felt rushed during my appointment."
  },
  {
    name: "Michael T.",
    date: "February 28, 2025",
    rating: 4,
    comment:
      "Very knowledgeable doctor. The wait time was a bit long, but the care I received was worth it."
  },
  {
    name: "Jessica L.",
    date: "January 10, 2025",
    rating: 5,
    comment:
      "I've been seeing Dr. Reed for years and have always received excellent care. Highly recommend!"
  }
]

export const mockEducation: MockEducation[] = [
  {
    type: "Medical School",
    institution: "University of Example Medicine",
    year: "2005"
  },
  {
    type: "Residency",
    institution: "General Example Hospital",
    year: "2009"
  },
  {
    type: "Fellowship",
    institution: "Specialty Example Clinic",
    year: "2011"
  }
]

export const mockCertifications: MockCertification[] = [
  {
    name: "American Board of Example Medicine",
    status: "Certified",
    year: "2012"
  },
  {
    name: "State Medical License (XX)",
    status: "Active",
    year: "2012"
  }
]

export const mockAwards: MockAward[] = [
  { name: "Top Doctor Award", years: "2023, 2024" },
  { name: "Patient's Choice Award", years: "2022, 2023, 2024" },
  { name: "Compassionate Doctor Recognition", years: "2021, 2022, 2023" }
]
