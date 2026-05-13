export interface Vehicle {
  id: string
  name: string
  tagline: string
  category: 'tempo-traveller' | 'maharaja' | 'innova' | 'sedan' | 'suv' | 'corporate'
  seats: number
  pricePerKm: number
  pricePerDay?: number
  features: string[]
  amenities: string[]
  images: string[]
  badge?: string
  popular?: boolean
  rating: number
  reviews: number
  fuelType: string
  ac: boolean
}

export interface TourPackage {
  id: string
  title: string
  destination: string
  duration: string
  price: number
  originalPrice?: number
  includes: string[]
  highlights: string[]
  image: string
  category: 'hill-station' | 'religious' | 'heritage' | 'wildlife' | 'beach'
  rating: number
  reviews: number
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

export interface Review {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  date: string
  service: string
  avatar?: string
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
