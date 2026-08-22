/**
 * Fleet pricing engine.
 *
 * IMPORTANT: every number a customer sees is computed here, in code — never
 * by the language model. LLMs are unreliable at arithmetic and this output is
 * a price quote. The model only writes the day-by-day narrative; the maths
 * below owns the money.
 */

export interface VehicleClass {
  id: string
  name: string
  /** Inclusive passenger range this vehicle is offered for. */
  minPax: number
  maxPax: number
  ratePerKm: number
  blurb: string
}

/**
 * Rates as supplied by Shubham Tour & Travels.
 * All-inclusive (fuel, driver, tolls, state tax) — parking is extra.
 */
export const VEHICLE_CLASSES: VehicleClass[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    minPax: 1,
    maxPax: 4,
    ratePerKm: 14,
    blurb: 'Dzire · Aura · Honda City · Ciaz. Comfortable for up to 4 guests.',
  },
  {
    id: 'ertiga',
    name: 'Ertiga',
    minPax: 5,
    maxPax: 6,
    ratePerKm: 17,
    blurb: 'Maruti Ertiga, a 6-seater MPV with room for luggage.',
  },
  {
    id: 'innova',
    name: 'Innova',
    minPax: 5,
    maxPax: 6,
    ratePerKm: 21,
    blurb: 'Toyota Innova, the executive choice, with captain seats and extra legroom.',
  },
  {
    id: 'tempo-9',
    name: 'Tempo Traveller',
    minPax: 7,
    maxPax: 10,
    ratePerKm: 28,
    blurb: 'Standard Tempo Traveller with pushback seats for a small group.',
  },
  {
    id: 'tempo-luxury',
    name: 'Luxury Tempo Traveller',
    minPax: 11,
    maxPax: 16,
    ratePerKm: 32,
    blurb: '12+2 Maharaja Luxury Tempo Traveller with sleeper sofa, ambient LED and dual AC.',
  },
  {
    id: 'tempo-20',
    name: '20 Seater Tempo Traveller',
    minPax: 17,
    maxPax: 20,
    ratePerKm: 40,
    blurb: '16–20 seater Tempo Traveller for larger groups.',
  },
]

/** Minimum kilometres billed per day on an outstation trip. */
export const MIN_KM_PER_DAY = 250

/** Share of the total payable up front to confirm a booking. */
export const ADVANCE_PERCENT = 10

/**
 * Every vehicle that can carry `pax`, cheapest first.
 *
 * The brief left two gaps in the published brackets (7–8 and 11–12 guests).
 * Rather than refuse a quote, the ranges above bridge them upward to the next
 * vehicle that genuinely seats the party — a group of 8 gets the 10-seater
 * Tempo, a group of 12 gets the 16-seater Luxury Tempo.
 */
export function vehiclesFor(pax: number): VehicleClass[] {
  const n = Math.max(1, Math.round(pax || 1))
  return VEHICLE_CLASSES
    .filter(v => n >= v.minPax && n <= v.maxPax)
    .sort((a, b) => a.ratePerKm - b.ratePerKm)
}

export interface Quote {
  vehicle: VehicleClass
  days: number
  /** Estimated road distance for the whole trip, both ways plus sightseeing. */
  estimatedKm: number
  /** days × 250 — billed even when the route comes in shorter. */
  minimumKm: number
  /** Kilometres actually billed: whichever of the two is larger. */
  chargeableKm: number
  /** minimumKm × rate */
  baseFare: number
  /** Kilometres beyond the minimum, and what they cost. */
  extraKm: number
  extraFare: number
  total: number
  advance: number
  balance: number
}

/**
 * Quote one vehicle for a trip.
 *
 * The minimum is a floor, not a separate charge: a 4-day trip bills at least
 * 1,000 km. If the route runs longer, the excess is billed at the same rate
 * and shown separately so the customer can see how the number was built.
 */
export function quoteVehicle(
  vehicle: VehicleClass,
  days: number,
  estimatedKm: number
): Quote {
  const d = Math.max(1, Math.round(days || 1))
  const km = Math.max(0, Math.round(estimatedKm || 0))

  const minimumKm = d * MIN_KM_PER_DAY
  const chargeableKm = Math.max(minimumKm, km)

  const baseFare = minimumKm * vehicle.ratePerKm
  const extraKm = Math.max(0, chargeableKm - minimumKm)
  const extraFare = extraKm * vehicle.ratePerKm
  const total = baseFare + extraFare

  return {
    vehicle,
    days: d,
    estimatedKm: km,
    minimumKm,
    chargeableKm,
    baseFare,
    extraKm,
    extraFare,
    total,
    advance: Math.round((total * ADVANCE_PERCENT) / 100),
    balance: total - Math.round((total * ADVANCE_PERCENT) / 100),
  }
}

/** Quote every vehicle that fits the party, cheapest first. */
export function quoteAll(pax: number, days: number, estimatedKm: number): Quote[] {
  return vehiclesFor(pax).map(v => quoteVehicle(v, days, estimatedKm))
}

/** Inclusive day count between two ISO dates; falls back to 1. */
export function daysBetween(start: string, end?: string): number {
  if (!start) return 1
  if (!end) return 1
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 1
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1)
}

export const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
