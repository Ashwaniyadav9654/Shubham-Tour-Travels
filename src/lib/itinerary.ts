/**
 * Client side of the itinerary flow.
 *
 * Deliberately thin: the plan is built, priced, rendered to PDF and emailed
 * entirely on the server. Nothing about the itinerary comes back for display —
 * only a confirmation. There is no offline fallback; if the server cannot
 * produce a real plan the visitor is told so rather than shown a template.
 */

export interface TripRequest {
  name: string
  phone: string
  email?: string
  from: string
  to: string
  startDate: string
  endDate?: string
  passengers: number
  service?: string
  notes?: string
}

export interface ItineraryReceipt {
  ok: true
  /** Address the PDF actually reached, or null if it could not be sent. */
  emailedTo: string | null
  teamNotified: boolean
  mailConfigured: boolean
  mailError?: string
  days: number
  totalKm: number
  oneWayKm: number
  distanceProvider: 'google' | 'osrm'
  /** True when the group exceeds a single vehicle; the team quotes manually. */
  quoteOnRequest: boolean
  vehicle: string | null
  total: number | null
  advance: number | null
}

export class ItineraryError extends Error {}

export async function requestItinerary(req: TripRequest): Promise<ItineraryReceipt> {
  let res: Response
  try {
    res = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
  } catch {
    throw new ItineraryError(
      'We could not reach our planning service. Please check your connection and try again.'
    )
  }

  let data: any
  try { data = await res.json() } catch { data = {} }

  if (!res.ok || !data?.ok) {
    throw new ItineraryError(
      data?.error || 'We could not build your itinerary just now. Please try again in a moment.'
    )
  }

  return data as ItineraryReceipt
}
