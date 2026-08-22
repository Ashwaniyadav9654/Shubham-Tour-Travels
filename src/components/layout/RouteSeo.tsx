import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Per-route title, description and canonical URL.
 *
 * This is a single-page app, so without this every route would share the
 * one <title> baked into index.html and Google would list them all
 * identically. Kept in one map rather than a <Seo> tag per page so the
 * copy stays consistent and there is one place to edit.
 */

const SITE = 'https://shubhamtourtravels.in'
const BRAND = 'Shubham Tour & Travels'

type Meta = { title: string; description: string }

const ROUTES: Record<string, Meta> = {
  '/': {
    title: `${BRAND} | Luxury Tempo Traveller & Car Rental in Gurgaon`,
    description:
      'Luxury Tempo Traveller, 40-seater AC bus, Innova Crysta and premium car rental across Gurgaon and Delhi NCR. Rated 4.7 by 700+ travellers. Only 10% advance to confirm.',
  },
  '/fleet': {
    title: `Our Fleet | Tempo Traveller, AC Bus & Sedans | ${BRAND}`,
    description:
      'Browse our fleet: 12+2 Maharaja Luxury Tempo Traveller, 40-seater AC bus, Innova Crysta, Ertiga and executive sedans. GPS tracked, professionally chauffeured, all-inclusive rates.',
  },
  '/tours': {
    title: `Luxury Group Tour Packages from Delhi NCR | ${BRAND}`,
    description:
      'Group tour packages to Shimla, Manali, Mussoorie, Jaipur and Rishikesh, powered by our Maharaja Luxury Tempo Traveller. Transport-focused pricing with no per-person charges.',
  },
  '/booking': {
    title: `Generate Your Free Itinerary | ${BRAND}`,
    description:
      'Tell us your destination, dates and group size and we will build a day-by-day itinerary with a clear base price, emailed to you as a PDF within a minute.',
  },
  '/airport-transfer': {
    title: `Airport Transfer Gurgaon & Delhi NCR | ${BRAND}`,
    description:
      'Punctual airport pickup and drop across Delhi NCR, 24/7. Clean vehicles, professional chauffeurs and flight tracking for IGI Airport transfers.',
  },
  '/corporate': {
    title: `Corporate Cab & Employee Transport Gurgaon | ${BRAND}`,
    description:
      'Corporate travel accounts with GST billing, monthly invoicing, priority dispatch and dedicated travel support across Gurgaon and Delhi NCR.',
  },
  '/wedding': {
    title: `Wedding Car & Baraat Transport Delhi NCR | ${BRAND}`,
    description:
      'Decorated wedding vehicles, baraat convoys and guest shuttles across Delhi NCR. Flawless coordination from Baraat to Bidaai.',
  },
  '/gallery': {
    title: `Gallery | Our Vehicles & Journeys | ${BRAND}`,
    description:
      'Photographs of our Maharaja Tempo Traveller, AC coaches and the journeys we have run across North India.',
  },
  '/reviews': {
    title: `Customer Reviews | Rated 4.7 by 700+ Travellers | ${BRAND}`,
    description:
      'Read what our travellers say. Rated 4.7 out of 5 by more than 700 customers across group tours, weddings, corporate travel and airport transfers.',
  },
  '/about': {
    title: `About Us | 15+ Years of Group Travel | ${BRAND}`,
    description:
      'Delhi NCR group travel specialists for over 15 years. Maharaja Tempo Travellers, AC coaches and executive cars, run with obsessive attention to detail.',
  },
  '/contact': {
    title: `Contact Us | Call, WhatsApp or Email | ${BRAND}`,
    description:
      'Get in touch with Shubham Tour & Travels in Gurgaon. Call +91 85958 20300, message us on WhatsApp, or send an enquiry. We respond within minutes, 24/7.',
  },
  '/blog': {
    title: `Travel Guides & Tips | ${BRAND}`,
    description:
      'Route guides, packing tips and destination advice for group road trips from Delhi NCR.',
  },
}

const FALLBACK: Meta = ROUTES['/']

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    // /fleet/innova-crysta and friends inherit the fleet listing copy
    const meta =
      ROUTES[pathname] ??
      (pathname.startsWith('/fleet/') ? ROUTES['/fleet'] : FALLBACK)

    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', SITE + pathname)
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)

    // Admin and login must never be indexed
    const noIndex = pathname.startsWith('/admin') || pathname.startsWith('/login')
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1')

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = SITE + (pathname === '/' ? '/' : pathname)
  }, [pathname])

  return null
}
