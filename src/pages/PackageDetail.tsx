import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Clock, Hotel, Info, MapPin, Phone } from 'lucide-react'
import { tourPackages, bookingTerms } from '@/data'
import { packageInclusions, packageExclusions } from '@/data/packages'
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'
import { btn, WhatsAppIcon } from '@/components/site/ui'
import { PackageCard, quoteHref, packageWhatsApp } from '@/components/site/PackageCard'

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const pkg = tourPackages.find((p) => p.id === id)
  if (!pkg) return <Navigate to="/tours" replace />

  const related = tourPackages.filter((p) => p.id !== pkg.id && p.category === pkg.category).slice(0, 3)

  return (
    <div className="bg-mist">
      {/* Hero */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative flex min-h-[min(60vh,560px)] flex-col justify-end overflow-hidden rounded-[2rem]">
          <img
            src={pkg.image}
            width={1600}
            height={900}
            fetchPriority="high"
            alt={`${pkg.title} tour package: ${pkg.destination}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/10" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative px-6 pb-10 pt-28 sm:px-10 md:px-14 md:pb-14"
          >
            <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
              <ArrowLeft size={16} /> All packages
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-sun">{pkg.destination}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-6xl">{pkg.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                <Clock size={14} /> {pkg.duration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                <Hotel size={14} /> {pkg.stay}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-lg leading-relaxed text-navy-soft">{pkg.summary}</p>

          <h2 className="mt-12 font-display text-2xl font-semibold text-navy">Highlights</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {pkg.highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm text-navy">
                <MapPin size={14} className="text-sea" /> {h}
              </span>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold text-navy">Day by day</h2>
          <ol className="mt-6 space-y-0">
            {pkg.itinerary.map((day, i) => (
              <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
                {i < pkg.itinerary.length - 1 && (
                  <span className="absolute left-[19px] top-10 bottom-0 w-px bg-line" aria-hidden="true" />
                )}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-tint text-sm font-semibold text-sea">
                  {i + 1}
                </span>
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-muted">Day {i + 1}</p>
                  <p className="mt-1 text-navy">{day}</p>
                </div>
              </li>
            ))}
          </ol>

          {pkg.note && (
            <div className="mt-10 flex gap-3 rounded-2xl border border-sun/30 bg-sun/10 p-5 text-sm text-navy">
              <Info size={18} className="mt-0.5 shrink-0 text-sun-ink" />
              <p>
                <span className="font-semibold">Good to know: </span>
                {pkg.note}
              </p>
            </div>
          )}

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6">
              <h3 className="font-display text-xl font-semibold text-navy">Included</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-navy-soft">
                {packageInclusions(pkg).map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-sea" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6">
              <h3 className="font-display text-xl font-semibold text-navy">Not included</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-navy-muted">
                {packageExclusions(pkg).map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enquiry card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-7 shadow-xl shadow-navy/5">
            <p className="font-display text-2xl font-semibold text-navy">Make it your trip</p>
            <p className="mt-2 text-sm text-navy-muted">
              Change hotels, days, activities and vehicle, then get a written quote for exactly that trip. Only{' '}
              {bookingTerms.advancePercent}% advance to confirm.
            </p>
            <div className="mt-6 grid gap-3">
              <Link to={`/customize/${pkg.id}`} className={btn.primary}>
                Customise this trip
              </Link>
              <Link to={quoteHref(pkg)} className={btn.outline}>
                Quick quote
              </Link>
              <a href={packageWhatsApp(pkg)} target="_blank" rel="noopener noreferrer" className={btn.outline}>
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <a href={PHONE_HREF} className={btn.ghost}>
                <Phone size={15} /> {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="mb-10 font-display text-3xl font-semibold text-navy">You may also like</h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
