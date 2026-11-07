/**
 * Data and logic behind the search landing pages:
 *   /routes/:origin-to-:destination   (NCR city -> destination, real road data)
 *   /services/:service-in-:city       (vehicle / taxi services per NCR city)
 *   /holiday-packages/:collection     (packages grouped by trip type or state)
 *
 * Road distances and driving times come from OpenStreetMap routing (OSRM),
 * generated once into routeData.json — nothing here is typed in by hand.
 */
import routeData from './routeData.json'
import { tourPackages, vehicles } from '@/data'
import type { PackageCategory, TourPackage, Vehicle } from '@/types'

/* ─── types & raw data ───────────────────────────────────────────── */

export interface Origin { slug: string; name: string; label: string; lat: number; lon: number; areas: string[] }
export interface Destination {
  slug: string
  name: string
  state: string
  kind: PackageCategory
  places: string[]
  packageId: string | null
  lat: number
  lon: number
  road: Record<string, { km: number; hrs: number } | null>
}

export const origins = routeData.origins as Origin[]
export const destinations = routeData.destinations as Destination[]
const airport = routeData.airport as Record<string, { km: number; mins: number }>

/* ─── routes ─────────────────────────────────────────────────────── */

export const routeSlug = (o: string, d: string) => `${o}-to-${d}`

export interface RouteInfo {
  slug: string
  origin: Origin
  dest: Destination
  km: number
  hrs: number
  /** Realistic range: map time is the floor; breaks, traffic and hills add more. */
  hrsRange: [number, number]
  pkg?: TourPackage
}

const roundHalf = (n: number) => Math.round(n * 2) / 2

export function getRoute(slug: string): RouteInfo | undefined {
  const m = slug.match(/^(.+?)-to-(.+)$/)
  if (!m) return undefined
  const origin = origins.find((o) => o.slug === m[1])
  const dest = destinations.find((d) => d.slug === m[2])
  const r = origin && dest ? dest.road[origin.slug] : null
  if (!origin || !dest || !r) return undefined
  const hill = dest.kind === 'hill-station' || dest.state === 'Uttarakhand' || dest.state === 'Himachal Pradesh'
  const low = Math.max(1, roundHalf(r.hrs))
  const high = Math.max(low + 0.5, roundHalf(r.hrs * (hill ? 1.45 : 1.25)))
  return {
    slug,
    origin,
    dest,
    km: r.km,
    hrs: r.hrs,
    hrsRange: [low, high],
    pkg: dest.packageId ? tourPackages.find((p) => p.id === dest.packageId) : undefined,
  }
}

export const allRouteSlugs = () =>
  origins.flatMap((o) => destinations.filter((d) => d.road[o.slug]).map((d) => routeSlug(o.slug, d.slug)))

export function tripSuggestion(km: number) {
  if (km <= 180) return 'Easy same-day trip; a weekend stay is also popular.'
  if (km <= 320) return 'Works as a 2-day weekend trip, or a long same-day trip with an early start.'
  if (km <= 550) return 'Plan at least 3 days so the drive does not take over the holiday.'
  return 'Plan 4 days or more; start early, or break the journey on the way.'
}

const toRad = (x: number) => (x * Math.PI) / 180
function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

/** Other destinations close to this one, for "nearby trips" links. */
export function nearbyDestinations(dest: Destination, n = 6) {
  return destinations
    .filter((d) => d.slug !== dest.slug)
    .map((d) => ({ d, dist: haversine(dest, d) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map((x) => x.d)
}

/** Vehicles that fit common group sizes, smallest first. */
export function vehicleOptions(): { group: string; vehicles: Vehicle[] }[] {
  const by = (min: number, max: number) => vehicles.filter((v) => v.seats >= min && v.seats <= max)
  return [
    { group: '1–4 travellers', vehicles: by(4, 5).slice(0, 3) },
    { group: '5–7 travellers', vehicles: by(6, 7) },
    { group: '8–14 travellers', vehicles: by(8, 20) },
    { group: '15–40 travellers', vehicles: by(21, 60) },
  ].filter((g) => g.vehicles.length)
}

export function routeFaqs(r: RouteInfo) {
  const { origin: o, dest: d } = r
  return [
    {
      q: `What is the distance from ${o.name} to ${d.name} by road?`,
      a: `${d.name} is about ${r.km} km from central ${o.name} by road. Pickup from anywhere in ${o.name} (for example ${o.areas.slice(0, 3).join(', ')}) adds or removes a few kilometres.`,
    },
    {
      q: `How long does it take to drive from ${o.name} to ${d.name}?`,
      a: `Pure driving time is around ${r.hrsRange[0]} hours. With meal breaks, traffic and ${d.kind === 'hill-station' ? 'hill roads' : 'city stretches'}, most groups take ${r.hrsRange[0]}–${r.hrsRange[1]} hours.`,
    },
    {
      q: `Which vehicle should we book for ${o.name} to ${d.name}?`,
      a: 'Up to 4 people travel comfortably in a sedan, 5–7 in an Ertiga, Innova Crysta or Hycross, and 8–14 in the 12+2 Maharaja Tempo Traveller. Bigger groups can hire our whole 40-seater bus; we do not sell individual seats.',
    },
    {
      q: `Can you plan a full ${d.name} trip, not just the transport?`,
      a: r.pkg
        ? `Yes. Our ${r.pkg.title} (${r.pkg.duration}) includes the vehicle, 3–5 star hotels, breakfast and dinner, and you can customise it day by day.`
        : `Yes. Tell us your dates and group size and we will plan the route, stays and sightseeing around ${d.name}, then send a written quote.`,
    },
    {
      q: `How do I book a ${o.name} to ${d.name} cab or Tempo Traveller?`,
      a: 'Call or WhatsApp +91 85958 20300, or send an enquiry on this page. We confirm the vehicle and send a written quote; only 10% advance confirms the booking.',
    },
  ]
}

/* ─── city services ──────────────────────────────────────────────── */

export interface ServiceCity { slug: string; name: string; areas: string[]; routesFrom: string }

export const serviceCities: ServiceCity[] = [
  ...origins.map((o) => ({ slug: o.slug, name: o.name, areas: o.areas, routesFrom: o.slug })),
  { slug: 'manesar', name: 'Manesar', areas: ['IMT Manesar', 'NH-48', 'Sector 8', 'Kasan'], routesFrom: 'gurgaon' },
  { slug: 'sohna', name: 'Sohna', areas: ['Sohna Road', 'Badshahpur', 'Sector 33', 'Damdama Lake'], routesFrom: 'gurgaon' },
]

export interface ServiceType {
  slug: string
  title: (city: string) => string
  short: string
  intro: (city: string) => string
  vehicleIds: string[]
  /** booking form service option */
  bookingService: string
}

export const serviceTypes: ServiceType[] = [
  {
    slug: 'tour-and-travels',
    title: (c) => `Tour and Travels in ${c}`,
    short: 'Tour and travels',
    intro: (c) =>
      `Shubham Tour & Travels is a full-service travel agency for ${c}: holiday tour packages across India, Nepal and Thailand, Tempo Traveller and bus hire, outstation cabs, airport transfers, and wedding and corporate travel, all run with our own vehicles and drivers.`,
    vehicleIds: ['maharaja-12-tempo', 'innova-hycross', 'innova-crysta', 'ac-bus-40'],
    bookingService: 'Luxury Group Tour',
  },
  {
    slug: 'tempo-traveller-on-rent',
    title: (c) => `Tempo Traveller on Rent in ${c}`,
    short: 'Tempo Traveller hire',
    intro: (c) => `Hire our 12+2 Maharaja Luxury Tempo Traveller in ${c} for family trips, office outings, weddings and pilgrimages, with pushback seats, ambient lighting and a professional driver.`,
    vehicleIds: ['maharaja-12-tempo'],
    bookingService: 'Luxury Group Tour',
  },
  {
    slug: 'bus-on-rent',
    title: (c) => `40 Seater Bus Hire in ${c} (Full Charter)`,
    short: 'Full bus hire',
    intro: (c) => `Hire our whole 40-seater AC bus with driver in ${c} for your own group: school trips, corporate events, weddings and pilgrim groups. We do not sell individual seats or run scheduled routes.`,
    vehicleIds: ['ac-bus-40'],
    bookingService: 'Luxury Group Tour',
  },
  {
    slug: 'innova-on-rent',
    title: (c) => `Innova Crysta & Hycross on Rent in ${c}`,
    short: 'Innova hire',
    intro: (c) => `Rent a Toyota Innova Crysta or Innova Hycross with driver in ${c} for outstation trips, airport runs and business travel, with captain seats and room for 7.`,
    vehicleIds: ['innova-hycross', 'innova-crysta'],
    bookingService: 'Corporate Cab Service',
  },
  {
    slug: 'outstation-taxi',
    title: (c) => `Outstation Taxi Service in ${c}`,
    short: 'Outstation taxi',
    intro: (c) => `One-way and round-trip outstation cabs from ${c} to hill stations, pilgrim towns and cities across North India, in sedans, Ertiga or Innova with an experienced driver.`,
    vehicleIds: ['swift-dzire', 'maruti-ciaz', 'honda-city', 'ertiga', 'innova-crysta'],
    bookingService: 'Luxury Group Tour',
  },
  {
    slug: 'airport-taxi',
    title: (c) => `Airport Taxi in ${c} (IGI Delhi)`,
    short: 'Airport taxi',
    intro: (c) => `24×7 pickup and drop between ${c} and Indira Gandhi International Airport, with flight tracking, name-board pickup and help with luggage.`,
    vehicleIds: ['swift-dzire', 'ertiga', 'innova-crysta', 'innova-hycross', 'maharaja-12-tempo'],
    bookingService: 'Airport Transfer',
  },
  {
    slug: 'wedding-car-rental',
    title: (c) => `Wedding Car & Baraat Transport in ${c}`,
    short: 'Wedding transport',
    intro: (c) => `Wedding transport in ${c}: decorated cars for the couple, Tempo Travellers and buses for guests, and coordinated baraat convoys from baraat to bidaai.`,
    vehicleIds: ['honda-city', 'innova-hycross', 'maharaja-12-tempo', 'ac-bus-40'],
    bookingService: 'Wedding Transportation',
  },
  {
    slug: 'corporate-cab-service',
    title: (c) => `Corporate Cab Service in ${c}`,
    short: 'Corporate cabs',
    intro: (c) => `Corporate cab accounts in ${c} with GST billing, monthly invoicing and priority dispatch, plus Tempo Travellers and coaches for offsites and events.`,
    vehicleIds: ['maruti-ciaz', 'honda-city', 'innova-crysta', 'maharaja-12-tempo'],
    bookingService: 'Corporate Cab Service',
  },
]

export const serviceSlug = (s: string, c: string) => `${s}-in-${c}`

export function getService(slug: string) {
  for (const t of serviceTypes) {
    if (!slug.startsWith(t.slug + '-in-')) continue
    const city = serviceCities.find((c) => c.slug === slug.slice(t.slug.length + 4))
    if (city) {
      const v = t.vehicleIds.map((id) => vehicles.find((x) => x.id === id)).filter((x): x is Vehicle => !!x)
      return { slug, type: t, city, vehicles: v, airport: airport[city.slug] }
    }
  }
  return undefined
}

export const allServiceSlugs = () => serviceTypes.flatMap((t) => serviceCities.map((c) => serviceSlug(t.slug, c.slug)))

/** Shortest-first popular routes from a city (falls back to Gurgaon for Manesar/Sohna). */
export function popularRoutesFrom(originSlug: string, n = 12) {
  return destinations
    .filter((d) => d.road[originSlug])
    .sort((a, b) => (a.road[originSlug]!.km - b.road[originSlug]!.km))
    .filter((_, i) => i % 2 === 0 || i < 6)
    .slice(0, n)
    .map((d) => getRoute(routeSlug(originSlug, d.slug))!)
}

export function serviceFaqs(s: NonNullable<ReturnType<typeof getService>>) {
  const c = s.city.name
  if (s.type.slug === 'tour-and-travels') {
    return [
      {
        q: `Which is a good tour and travels agency in ${c}?`,
        a: `Shubham Tour & Travels serves ${c} and all of Delhi NCR from our base in Gurugram, with our own Tempo Travellers, buses and cars, ${tourPackages.length} customisable holiday packages, and 24×7 phone and WhatsApp support.`,
      },
      {
        q: `What services does your travel agency offer in ${c}?`,
        a: 'Holiday tour packages, Char Dham and pilgrimage yatras, Tempo Traveller and 40-seater bus hire, outstation and airport cabs, wedding transport and corporate travel.',
      },
      {
        q: `Do you pick up from my area in ${c}?`,
        a: `Yes. We pick up across ${c}, including ${s.city.areas.join(', ')}.`,
      },
      {
        q: 'Do you sell bus seats or take redBus bookings?',
        a: 'No. We are a private hire and tour agency: we rent the whole vehicle for your group and plan complete trips. We do not sell individual seats or run scheduled buses.',
      },
      {
        q: 'How do I book a tour or vehicle?',
        a: 'Call or WhatsApp +91 85958 20300, or send an enquiry on the website. We send a written quote; only 10% advance confirms the booking.',
      },
    ]
  }
  const faqs = [
    {
      q: `Do you provide ${s.type.short.toLowerCase()} anywhere in ${c}?`,
      a: `Yes. We pick up across ${c}, including ${s.city.areas.join(', ')}, and from neighbouring Delhi NCR cities.`,
    },
    {
      q: `Which vehicles are available for ${s.type.short.toLowerCase()} in ${c}?`,
      a: `${s.vehicles.map((v) => `${v.name} (${v.seats} seats)`).join(', ')}. All are our own vehicles with professional drivers.`,
    },
    {
      q: `How far is ${c} from Delhi airport?`,
      a: s.airport
        ? `About ${s.airport.km} km by road, roughly ${s.airport.mins} minutes without traffic. Allow extra time at peak hours.`
        : `It depends on your pickup point; we plan pickups with a traffic buffer.`,
    },
    {
      q: `How do I book ${s.type.short.toLowerCase()} in ${c}?`,
      a: 'Call or WhatsApp +91 85958 20300 or send an enquiry here. We reply with a written quote; only 10% advance confirms the booking.',
    },
  ]
  return faqs
}

/* ─── package collections ────────────────────────────────────────── */

export interface Collection { slug: string; title: string; heading: string; intro: string; packages: TourPackage[] }

const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const CATEGORY_TEXT: Record<PackageCategory, [string, string]> = {
  'hill-station': ['Hill Station Tour Packages from Delhi', 'Cool hill escapes from Delhi NCR in Himachal, Uttarakhand, Kashmir, the North East and the South.'],
  pilgrimage: ['Pilgrimage & Yatra Packages from Delhi', 'Char Dham, Kedarnath, Vaishno Devi, Varanasi, Ayodhya and more, planned around darshan timings and yatra rules.'],
  heritage: ['Heritage Tour Packages from Delhi', 'Forts, palaces and old cities: the Golden Triangle, Rajasthan, Odisha and beyond.'],
  wildlife: ['Wildlife Safari Packages from Delhi', 'Jungle safaris and national parks within reach of Delhi NCR.'],
  beach: ['Beach & Island Holiday Packages', 'Goa, Kerala, Andaman and Lakshadweep holidays with transfers, stays and meals included.'],
  international: ['International Tour Packages from Delhi', 'Nepal and Thailand holidays with hotels, private transfers and sightseeing.'],
}

export function collections(): Collection[] {
  const byCat = (Object.keys(CATEGORY_TEXT) as PackageCategory[]).map((cat) => ({
    slug: cat === 'beach' ? 'beach-holiday-packages' : `${cat}-tour-packages`,
    title: CATEGORY_TEXT[cat][0],
    heading: CATEGORY_TEXT[cat][0],
    intro: CATEGORY_TEXT[cat][1],
    packages: tourPackages.filter((p) => p.category === cat),
  }))
  const regions = [...new Set(tourPackages.map((p) => p.region))].filter((r) => r !== 'International')
  const byRegion = regions.map((r) => {
    const pk = tourPackages.filter((p) => p.region === r)
    const name = r.replace(/\s*·\s*/g, ', ')
    return {
      slug: `${slugify(r)}-tour-packages`,
      title: `${name} Tour Packages from Delhi`,
      heading: `${name} tour packages`,
      intro: `${pk.length} ${name} ${pk.length === 1 ? 'trip' : 'trips'} from Delhi NCR, each with vehicle, 3–5 star hotels, breakfast and dinner, and fully customisable.`,
      packages: pk,
    }
  })
  return [...byCat, ...byRegion].filter((c) => c.packages.length)
}

export const getCollection = (slug: string) => collections().find((c) => c.slug === slug)

/** Route pages that lead to this package's destination, for package pages. */
export function routesForPackage(pkgId: string) {
  const d = destinations.find((x) => x.packageId === pkgId)
  return d ? origins.map((o) => getRoute(routeSlug(o.slug, d.slug))).filter((r): r is RouteInfo => !!r) : []
}
