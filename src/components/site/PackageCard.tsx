import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { TourPackage } from '@/types'
import { whatsappBookingLink } from '@/lib/utils'
import { btn, WhatsAppIcon } from './ui'

/** Booking page link, pre-filled with this package. */
export const quoteHref = (pkg: TourPackage) =>
  `/booking?${new URLSearchParams({
    service: 'Luxury Group Tour',
    to: pkg.destination,
    message: `Interested in the ${pkg.title} package (${pkg.duration}).`,
  })}`

export const packageWhatsApp = (pkg: TourPackage) =>
  whatsappBookingLink(pkg.title, `${pkg.duration} · ${pkg.destination}`)

/** Holiday package card: photo, location, title, duration and actions. */
export function PackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <article className="group flex flex-col">
      <Link to={`/tours/${pkg.id}`} className="relative block aspect-[4/3] overflow-hidden rounded-3xl bg-line">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {pkg.popular && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-navy">
            Popular
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sun">{pkg.destination}</p>
        <h3 className="mt-2 font-display text-[1.375rem] font-semibold leading-snug text-navy">
          <Link to={`/tours/${pkg.id}`} className="hover:text-sea transition-colors">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-navy-soft">
          <Clock size={14} className="text-navy-muted" /> {pkg.duration}
        </p>
        <p className="mt-1.5 text-sm text-navy-muted">{pkg.stay}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Link to={quoteHref(pkg)} className={`${btn.primary} px-5 py-2.5`}>
            Get quote
          </Link>
          <Link to={`/tours/${pkg.id}`} className={btn.outline}>
            Details <ArrowUpRight size={14} />
          </Link>
          <a
            href={packageWhatsApp(pkg)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn.ghost} text-[#1a9e55] hover:text-[#1a9e55]`}
            aria-label={`Ask about ${pkg.title} on WhatsApp`}
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

/** Compact boxed card used in the group-departures carousel. */
export function GroupTripCard({ pkg }: { pkg: TourPackage }) {
  return (
    <article className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-line bg-white sm:w-[300px]">
      <Link to={`/tours/${pkg.id}`} className="block aspect-[4/3] overflow-hidden bg-line">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sun">{pkg.region}</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-navy">{pkg.title}</h3>
        <p className="mt-1 text-sm text-navy-soft">
          {pkg.duration}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-navy-muted line-clamp-2">{pkg.summary}</p>
        <div className="mt-auto pt-5 space-y-2">
          <Link to={`/tours/${pkg.id}`} className={`${btn.outline} w-full`}>
            View itinerary
          </Link>
          <div className="flex items-center gap-2">
            <Link to={quoteHref(pkg)} className={`${btn.primary} flex-1 py-2.5`}>
              Get quote
            </Link>
            <a
              href={packageWhatsApp(pkg)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.ghost} flex-1 text-[#1a9e55] hover:text-[#1a9e55]`}
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
