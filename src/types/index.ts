export interface Vehicle {
  id: string
  name: string
  tagline: string
  category: 'tempo-traveller' | 'maharaja' | 'bus' | 'innova' | 'sedan' | 'suv' | 'corporate'
  seats: number
  /** Internal rate, shown only in the admin dashboard — never on public pages. */
  pricePerKm?: number
  pricePerDay?: number
  features: string[]
  amenities: string[]
  images: string[]
  /** Show the whole photo instead of cropping it to fill the card. */
  showFullPhoto?: boolean
  badge?: string
  popular?: boolean
  fuelType: string
  ac: boolean
}

export type PackageCategory =
  | 'hill-station'
  | 'pilgrimage'
  | 'heritage'
  | 'wildlife'
  | 'beach'
  | 'international'

export type TravellerType = 'family' | 'couple' | 'friends' | 'corporate'

export interface TourPackage {
  id: string
  title: string
  destination: string
  /** Short region label shown on destination cards, e.g. "Uttarakhand". */
  region: string
  duration: string
  summary: string
  /** Hotel / stay standard, e.g. "Standard / Deluxe hotels". */
  stay: string
  includes: string[]
  highlights: string[]
  itinerary: string[]
  image: string
  category: PackageCategory
  travellers: TravellerType[]
  /** Listed under "Group departures" as a fixed-departure trip. */
  group?: boolean
  popular?: boolean
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  startingPrice: number
  image: string
}

export interface BookingInquiry {
  name: string
  phone: string
  email: string
  service: string
  from: string
  to?: string
  date: string
  returnDate?: string
  passengers: number
  message?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  date: string
  readTime: string
  author: string
}
