export interface Location {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  phone: string
  fax?: string
}

export interface Physician {
  npi: string
  name: string
  specialties: string[]
  locations: Location[]
}
