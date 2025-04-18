"use server"

import type { Physician } from "./types"

// Mock data for demonstration purposes
// In a real application, this would connect to a database or API
const mockPhysicians: Physician[] = [
  {
    npi: "1234567890",
    name: "Dr. Evelyn Reed",
    specialties: ["Cardiology", "Internal Medicine"],
    locations: [
      {
        name: "Springfield Medical Center",
        address1: "123 Health St, Suite 400",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        phone: "(555) 123-4567",
        fax: "(555) 123-4568"
      }
    ]
  },
  {
    npi: "2345678901",
    name: "Dr. Kenji Tanaka",
    specialties: ["Pediatrics"],
    locations: [
      {
        name: "Springfield Children's Clinic",
        address1: "456 Wellness Ave",
        city: "Springfield",
        state: "IL",
        zip: "62704",
        phone: "(555) 234-5678"
      }
    ]
  },
  {
    npi: "3456789012",
    name: "Dr. Anya Sharma",
    specialties: ["Endocrinology", "Internal Medicine"],
    locations: [
      {
        name: "Chicago Medical Group",
        address1: "789 Healthcare Blvd",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        phone: "(555) 345-6789"
      }
    ]
  }
]

export async function searchPhysicians(
  name: string,
  location: string
): Promise<Physician[]> {
  // In a real application, this would query a database or API
  // For now, we'll filter our mock data

  // Convert search terms to lowercase for case-insensitive matching
  const nameLower = name.toLowerCase()
  const locationLower = location.toLowerCase()

  return mockPhysicians.filter(physician => {
    // Match on name or specialty
    const nameMatch =
      name === "" ||
      physician.name.toLowerCase().includes(nameLower) ||
      physician.specialties.some(s => s.toLowerCase().includes(nameLower))

    // Match on city, state, or zip
    const locationMatch =
      location === "" ||
      physician.locations.some(
        loc =>
          loc.city.toLowerCase().includes(locationLower) ||
          loc.state.toLowerCase().includes(locationLower) ||
          loc.zip.includes(location)
      )

    return nameMatch && locationMatch
  })
}

export async function getPhysicianByNpi(
  npi: string
): Promise<Physician | null> {
  // In a real application, this would query a database or API
  const physician = mockPhysicians.find(p => p.npi === npi)
  return physician || null
}
