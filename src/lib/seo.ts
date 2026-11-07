/**
 * Single source of truth for every page's <title>, description, canonical URL,
 * social image and structured data.
 *
 * Used twice: by <RouteSeo> in the browser, and by scripts/prerender.mjs at
 * build time, which writes these tags into a static HTML file per route so
 * search engines get them without running JavaScript.
 */
import { tourPackages, vehicles, bookingTerms } from '@/data'
import type { TourPackage, Vehicle } from '@/types'
import {
  getRoute, routeFaqs, allRouteSlugs, getService, serviceFaqs, allServiceSlugs, collections, getCollection,
} from '@/data/seoPages'

export const SITE = 'https://shubhamtourtravels.in'
export const BRAND = 'Shubham Tour & Travels'
const SHORT = 'Shubham Travels'
const PHONE = '+918595820300'
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`

export interface PageSeo {
  title: string
  description: string
  canonical: string
  image: string
  noindex?: boolean
  jsonLd: object[]
}

type Static = { title: string; description: string; noindex?: boolean }

/** Titles stay within ~60 characters and descriptions within ~160 so Google shows them whole. */
const STATIC: Record<string, Static> = {
  '/': {
    title: 'Tempo Traveller & Tour Packages in Gurgaon | Shubham Travels',
    description:
      'Book Tempo Traveller hire, cabs and holiday tour packages from Gurgaon & Delhi NCR. 35 customisable trips, 3–5 star hotels, own fleet, only 10% advance.',
  },
  '/tours': {
    title: 'Holiday Tour Packages from Delhi & Gurgaon | Shubham Travels',
    description:
      'Customisable tour packages from Delhi NCR: Kashmir, Kerala, Ladakh, Rajasthan, Char Dham, Andaman, Nepal and Thailand. Vehicle, hotels and meals included.',
  },
  '/fleet': {
    title: 'Tempo Traveller, Bus & Car Rental Gurgaon | Shubham Travels',
    description:
      'Rent a 12+2 Maharaja Tempo Traveller, 40-seater AC bus, Innova Hycross, Crysta, Ertiga or sedan in Gurgaon & Delhi NCR. Own fleet, GPS tracked, 24×7 support.',
  },
  '/customize': {
    title: 'Build Your Own Trip | Custom Tour Packages | Shubham Travels',
    description:
      'Customise any holiday package: choose 3, 4 or 5 star hotels, add days and local sightseeing, pick your vehicle and get a free written quote from our team.',
  },
  '/booking': {
    title: 'Get a Free Trip Quote & Itinerary | Shubham Tour & Travels',
    description:
      'Share your destination, dates and group size to get a free day-by-day itinerary and written quote for Tempo Traveller, cab or tour bookings from Gurgaon.',
  },
  '/airport-transfer': {
    title: 'Airport Taxi & Transfers in Gurgaon, Delhi NCR | Shubham',
    description:
      'Reliable IGI airport pickup and drop across Gurgaon and Delhi NCR, 24×7. Sedans, Innova and Tempo Travellers with flight tracking and professional drivers.',
  },
  '/corporate': {
    title: 'Corporate Cab Service & Employee Transport Gurgaon | Shubham',
    description:
      'Corporate cab and employee transport in Gurgaon with GST billing, monthly invoicing, priority dispatch and coaches for offsites and events across Delhi NCR.',
  },
  '/wedding': {
    title: 'Wedding Car Rental & Baraat Transport Delhi NCR | Shubham',
    description:
      'Wedding car rental, baraat convoys and guest shuttles across Delhi NCR: decorated cars, Tempo Travellers and AC buses coordinated from baraat to bidaai.',
  },
  '/gallery': {
    title: 'Gallery: Our Tempo Travellers & Trips | Shubham Travels',
    description:
      'Photos of our Maharaja Tempo Travellers, AC coaches, luxury interiors and the group journeys we have driven across North India from Gurgaon.',
  },
  '/about': {
    title: 'About Shubham Tour & Travels | Gurgaon Travel Company',
    description:
      'Gurgaon-based travel company running our own Tempo Travellers, AC buses and cars for group tours, corporate travel, weddings and holiday packages.',
  },
  '/contact': {
    title: 'Contact Shubham Tour & Travels | Call or WhatsApp 24×7',
    description:
      'Contact Shubham Tour & Travels in Gurgaon: call or WhatsApp +91 85958 20300, email us, or visit us at Ashok Vihar Phase 3. Replies within minutes, 24×7.',
  },
  '/blog': {
    title: 'Travel Guides & Road Trip Tips from Delhi | Shubham Travels',
    description:
      'Route guides, packing tips and destination advice for family and group road trips from Delhi NCR by private Tempo Traveller or cab.',
  },
  '/routes': {
    title: 'Tempo Traveller & Taxi Routes from Delhi NCR | Shubham',
    description: 'Distance, travel time and the right vehicle from Gurgaon, Delhi, Noida, Faridabad and Ghaziabad to 74 hill stations, pilgrim towns and heritage cities.',
  },
  '/services': {
    title: 'Tempo Traveller, Bus & Cab Services in Delhi NCR | Shubham',
    description: 'Tempo Traveller, 40-seater bus, Innova, outstation taxi, airport, wedding and corporate cabs in Gurgaon, Delhi, Noida, Faridabad, Ghaziabad and more.',
  },
  '/photo-credits': {
    title: 'Photo Credits | Shubham Tour & Travels',
    description: 'Licences and attribution for the destination photographs used on the Shubham Tour & Travels website.',
  },
  '/login': { title: 'Login | Shubham Tour & Travels', description: 'Account login.', noindex: true },
  '/admin': { title: 'Admin | Shubham Tour & Travels', description: 'Admin dashboard.', noindex: true },
}

const NOT_FOUND: Static = {
  title: 'Page Not Found | Shubham Tour & Travels',
  description: 'The page you were looking for has moved. Explore our tour packages, fleet and travel services from Gurgaon.',
  noindex: true,
}

/* ─── helpers ─────────────────────────────────────────────────────── */

const abs = (src: string) => (src.startsWith('http') ? src : SITE + src)

/** "5 Nights / 6 Days" -> "5N/6D"; "Same Day" stays. */
const shortDuration = (d: string) => {
  const m = d.match(/(\d+)\s*Nights?\s*\/\s*(\d+)\s*Days?/i)
  return m ? `${m[1]}N/${m[2]}D` : d
}

const clip = (s: string, max: number) => (s.length <= max ? s : s.slice(0, max - 1).replace(/[\s,;–-]+\S*$/, '') + '…')

function fitTitle(...candidates: string[]) {
  return candidates.find((t) => t.length <= 60) ?? clip(candidates[candidates.length - 1], 60)
}

function breadcrumb(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: SITE + path,
    })),
  }
}

function packageSeo(pkg: TourPackage, path: string): PageSeo {
  const d = shortDuration(pkg.duration)
  const title = fitTitle(
    `${pkg.title} Package ${d} | ${SHORT}`,
    `${pkg.title} Tour Package ${d} | Shubham`,
    `${pkg.title} ${d} | Shubham`,
  )
  const incl = pkg.sameDay ? 'Vehicle, tolls and parking included.' : 'Vehicle, hotels, breakfast & dinner included.'
  const description = [
    `${pkg.title} ${d}: ${pkg.summary} ${incl} Free quote.`,
    `${pkg.title} ${d}: ${pkg.summary} ${incl}`,
    `${pkg.title} ${d}: ${pkg.summary}`,
  ].find((x) => x.length <= 160) ?? clip(`${pkg.title} ${d}: ${pkg.summary}`, 160)
  const image = abs(pkg.image)
  return {
    title,
    description,
    canonical: SITE + path,
    image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: `${pkg.title} (${pkg.duration})`,
        description: pkg.summary,
        image,
        url: SITE + path,
        touristType: pkg.travellers,
        itinerary: {
          '@type': 'ItemList',
          numberOfItems: pkg.itinerary.length,
          itemListElement: pkg.itinerary.map((day, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `Day ${i + 1}`,
            description: day,
          })),
        },
        provider: { '@id': `${SITE}/#organization` },
      },
      breadcrumb([
        ['Home', '/'],
        ['Tour Packages', '/tours'],
        [pkg.title, path],
      ]),
    ],
  }
}

function vehicleSeo(v: Vehicle, path: string): PageSeo {
  const title = fitTitle(
    `${v.name} on Rent in Gurgaon | ${SHORT}`,
    `${v.name} Hire in Gurgaon | Shubham`,
    `${v.name} | Shubham`,
  )
  const description = clip(
    `Hire the ${v.name} (${v.seats} seats, ${v.ac ? 'AC' : 'non-AC'}, ${v.fuelType}) in Gurgaon & Delhi NCR with a professional driver. ${v.features.slice(0, 3).join(', ')}. Enquire now.`,
    160,
  )
  const image = abs(v.images[0])
  return {
    title,
    description,
    canonical: SITE + path,
    image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Vehicle rental with driver',
        name: `${v.name} rental`,
        description: `${v.tagline}. ${v.seats} seats, ${v.fuelType}, ${v.ac ? 'air-conditioned' : 'non-AC'}.`,
        image,
        areaServed: ['Gurugram', 'Delhi', 'Noida', 'Faridabad'],
        provider: { '@id': `${SITE}/#organization` },
      },
      breadcrumb([
        ['Home', '/'],
        ['Fleet', '/fleet'],
        [v.name, path],
      ]),
    ],
  }
}

/** Shown on the home page and exported as FAQPage structured data. */
export const homeFaqs: { q: string; a: string }[] = [
  {
    q: 'How do I book a Tempo Traveller in Gurgaon?',
    a: 'Call or WhatsApp us on +91 85958 20300, or send your dates and group size through the website. We confirm the vehicle and send a written quote; only ' +
      `${bookingTerms.advancePercent}% advance is needed to confirm the booking.`,
  },
  {
    q: 'Which vehicles can I hire for a group trip from Delhi NCR?',
    a: 'Our own fleet includes the 12+2 Maharaja Tempo Traveller, a 40-seater AC bus, Toyota Innova Hycross and Crysta, Maruti Ertiga and sedans such as Dzire, Ciaz and Honda City, all with professional drivers.',
  },
  {
    q: 'What is included in your tour packages?',
    a: 'Every package includes the vehicle for the full itinerary, your choice of 3, 4 or 5 star hotels, breakfast and dinner, toll and state tax, and parking (except in Kashmir). Lunch, entry tickets and extra sightseeing taxis are not included.',
  },
  {
    q: 'Can I customise a holiday package?',
    a: 'Yes. Open any package and choose Customise trip to change dates, hotel category for each night, add or remove days, add local sightseeing and pick a vehicle. We then send a written quote for exactly that trip.',
  },
  {
    q: 'Do you provide airport transfers and corporate cabs in Gurgaon?',
    a: 'Yes. We run 24×7 IGI airport pickups and drops and corporate cab accounts with GST billing and monthly invoicing across Gurgaon, Delhi, Noida and Faridabad.',
  },
  {
    q: 'Which destinations do your packages cover?',
    a: 'We run trips across India, including Himachal, Uttarakhand and the Char Dham, Kashmir, Ladakh, Rajasthan, Kerala, Goa, the North East, Odisha, Andaman and Lakshadweep, plus Nepal and Thailand.',
  },
]

function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

function routeSeo(slug: string): PageSeo | undefined {
  const r = getRoute(slug)
  if (!r) return undefined
  const { origin: o, dest: d } = r
  const path = `/routes/${slug}`
  const title = fitTitle(
    `${o.name} to ${d.name} Tempo Traveller & Taxi | Shubham`,
    `${o.name} to ${d.name} Tempo Traveller | Shubham`,
    `${o.name} to ${d.name} Taxi | Shubham`,
  )
  const description = clip(
    `${o.name} to ${d.name} by road: ${r.km} km, about ${r.hrsRange[0]}–${r.hrsRange[1]} hrs. Private cab, Innova or Tempo Traveller with driver for your group. Free quote.`,
    160,
  )
  const image = abs(r.pkg?.image ?? '/images/cars/maharaja-exterior.webp')
  return {
    title, description, canonical: SITE + path, image,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Tempo Traveller and taxi hire',
        name: `${o.name} to ${d.name} Tempo Traveller & taxi`,
        description,
        areaServed: [o.name, d.name],
        provider: { '@id': `${SITE}/#organization` },
      },
      faqLd(routeFaqs(r)),
      breadcrumb([['Home', '/'], ['Routes', '/routes'], [`${o.name} to ${d.name}`, path]]),
    ],
  }
}

function serviceSeo(slug: string): PageSeo | undefined {
  const s = getService(slug)
  if (!s) return undefined
  const path = `/services/${slug}`
  const name = s.type.title(s.city.name)
  const title = fitTitle(`${name} | Shubham Travels`, `${name} | Shubham`, name)
  const description = clip(`${s.type.intro(s.city.name)} Free quote, only 10% advance.`, 160)
  return {
    title, description, canonical: SITE + path, image: abs(s.vehicles[0]?.images[0] ?? '/og-image.jpg'),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: s.type.short,
        name,
        description,
        areaServed: s.city.name,
        provider: { '@id': `${SITE}/#organization` },
      },
      faqLd(serviceFaqs(s)),
      breadcrumb([['Home', '/'], ['Services', '/services'], [name, path]]),
    ],
  }
}

function collectionSeo(slug: string): PageSeo | undefined {
  const c = getCollection(slug)
  if (!c) return undefined
  const path = `/holiday-packages/${slug}`
  return {
    title: fitTitle(`${c.title} | Shubham Travels`, `${c.title} | Shubham`, c.title),
    description: clip(`${c.intro} Free quote, only 10% advance.`, 160),
    canonical: SITE + path,
    image: abs(c.packages[0].image),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: c.title,
        itemListElement: c.packages.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/tours/${p.id}`, name: p.title })),
      },
      breadcrumb([['Home', '/'], ['Tour Packages', '/tours'], [c.title, path]]),
    ],
  }
}

/* ─── public API ──────────────────────────────────────────────────── */

export function getSeo(pathname: string): PageSeo {
  const path = pathname.replace(/\/+$/, '') || '/'

  const tour = path.match(/^\/tours\/([^/]+)$/)
  if (tour) {
    const pkg = tourPackages.find((p) => p.id === tour[1])
    if (pkg) return packageSeo(pkg, path)
  }

  const custom = path.match(/^\/customize\/([^/]+)$/)
  if (custom) {
    const pkg = tourPackages.find((p) => p.id === custom[1])
    if (pkg) {
      // Thin, interactive duplicate of the package page: point Google at the package.
      const base = packageSeo(pkg, `/tours/${pkg.id}`)
      return {
        ...base,
        title: fitTitle(`Customise ${pkg.title} | ${SHORT}`, `Customise ${pkg.title} | Shubham`),
        noindex: true,
        jsonLd: [],
      }
    }
  }

  const rt = path.match(/^\/routes\/([^/]+)$/)
  if (rt) { const x = routeSeo(rt[1]); if (x) return x }
  const sv = path.match(/^\/services\/([^/]+)$/)
  if (sv) { const x = serviceSeo(sv[1]); if (x) return x }
  const co = path.match(/^\/holiday-packages\/([^/]+)$/)
  if (co) { const x = collectionSeo(co[1]); if (x) return x }

  const fleet = path.match(/^\/fleet\/([^/]+)$/)
  if (fleet) {
    const v = vehicles.find((x) => x.id === fleet[1])
    if (v) return vehicleSeo(v, path)
  }

  const s = STATIC[path] ?? NOT_FOUND
  const jsonLd: object[] = []
  if (path === '/') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: homeFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  if (path === '/tours') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Holiday tour packages',
      itemListElement: tourPackages.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/tours/${p.id}`,
        name: p.title,
      })),
    })
  }
  return {
    title: s.title,
    description: s.description,
    canonical: SITE + (path === '/' ? '/' : path),
    image: DEFAULT_IMAGE,
    noindex: s.noindex || !(path in STATIC),
    jsonLd,
  }
}

/** Every indexable URL, for the prerenderer and sitemap. */
export function allRoutes(): { path: string; index: boolean; priority: number }[] {
  const statics = Object.keys(STATIC).map((p) => ({
    path: p,
    index: !STATIC[p].noindex,
    priority: p === '/' ? 1 : p === '/tours' || p === '/fleet' ? 0.9 : 0.7,
  }))
  return [
    ...statics,
    ...tourPackages.map((p) => ({ path: `/tours/${p.id}`, index: true, priority: 0.8 })),
    ...tourPackages.map((p) => ({ path: `/customize/${p.id}`, index: false, priority: 0 })),
    ...vehicles.map((v) => ({ path: `/fleet/${v.id}`, index: true, priority: 0.7 })),
    ...allRouteSlugs().map((s) => ({ path: `/routes/${s}`, index: true, priority: 0.6 })),
    ...allServiceSlugs().map((s) => ({ path: `/services/${s}`, index: true, priority: 0.7 })),
    ...collections().map((c) => ({ path: `/holiday-packages/${c.slug}`, index: true, priority: 0.7 })),
  ]
}

export { PHONE }
