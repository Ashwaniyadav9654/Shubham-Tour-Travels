/**
 * Real driving distances.
 *
 * Two providers, tried in order:
 *   1. Google Distance Matrix  — if GOOGLE_MAPS_API_KEY is set. Best accuracy,
 *      production SLA, understands Indian road names and tolls.
 *   2. Nominatim + OSRM        — free, no key. Geocode both endpoints from
 *      OpenStreetMap, then route between them.
 *
 * There is deliberately NO hardcoded distance table any more: the previous
 * version shipped hand-typed figures which were only ever approximations and
 * covered ~30 destinations. This resolves any destination, for real.
 */

const UA = 'ShubhamTourTravels/1.0 (contact@shubhamtourtravels.in)'

export interface RouteLeg {
  km: number
  hours: number
  originLabel: string
  destinationLabel: string
  provider: 'google' | 'osrm'
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
  ])
}

/* ── Provider 1: Google Distance Matrix ──────────────────────────── */

async function googleRoute(from: string, to: string, key: string): Promise<RouteLeg | null> {
  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}` +
    `&mode=driving&region=in&key=${key}`

  const res = await withTimeout(fetch(url), 12_000)
  if (!res.ok) return null
  const data: any = await res.json()

  const el = data?.rows?.[0]?.elements?.[0]
  if (data?.status !== 'OK' || el?.status !== 'OK') return null

  return {
    km: Math.round(el.distance.value / 1000),
    hours: +(el.duration.value / 3600).toFixed(1),
    originLabel: data.origin_addresses?.[0] || from,
    destinationLabel: data.destination_addresses?.[0] || to,
    provider: 'google',
  }
}

/* ── Provider 2: Nominatim geocode + OSRM route ──────────────────── */

interface Place { lat: number; lon: number; label: string }

async function geocode(q: string): Promise<Place | null> {
  // Bias to India — "Manali" alone also matches places in other countries
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=in`

  const res = await withTimeout(fetch(url, { headers: { 'User-Agent': UA } }), 12_000)
  if (!res.ok) return null
  const rows: any[] = await res.json()
  if (!rows?.length) return null

  return {
    lat: parseFloat(rows[0].lat),
    lon: parseFloat(rows[0].lon),
    label: rows[0].display_name?.split(',').slice(0, 2).join(',').trim() || q,
  }
}

async function osrmRoute(from: string, to: string): Promise<RouteLeg | null> {
  const a = await geocode(from)
  if (!a) return null
  // Nominatim asks for max 1 request/second
  await new Promise(r => setTimeout(r, 1100))
  const b = await geocode(to)
  if (!b) return null

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`

  const res = await withTimeout(fetch(url), 15_000)
  if (!res.ok) return null
  const data: any = await res.json()
  if (data?.code !== 'Ok' || !data.routes?.length) return null

  return {
    km: Math.round(data.routes[0].distance / 1000),
    hours: +(data.routes[0].duration / 3600).toFixed(1),
    originLabel: a.label,
    destinationLabel: b.label,
    provider: 'osrm',
  }
}

/**
 * One-way driving distance between two places.
 * Throws when neither provider can resolve the route — the caller must not
 * invent a number.
 */
export async function drivingDistance(from: string, to: string): Promise<RouteLeg> {
  const googleKey = process.env.GOOGLE_MAPS_API_KEY

  if (googleKey) {
    try {
      const leg = await googleRoute(from, to, googleKey)
      if (leg) return leg
    } catch { /* fall through to OSRM */ }
  }

  const leg = await osrmRoute(from, to)
  if (leg) return leg

  throw new Error(
    `Could not find a driving route from "${from}" to "${to}". ` +
    `Please check the spelling of the destination.`
  )
}
