import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { tourPackages, packageCategories, travellerTypes } from '@/data'
import type { PackageCategory, TravellerType } from '@/types'
import { cn } from '@/lib/utils'
import { PackageCard } from '@/components/site/PackageCard'
import { GroupDepartures, CustomTripBanner, ContactBand } from '@/components/home/HomeSections'

const chip = (active: boolean) =>
  cn(
    'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
    active ? 'border-sea bg-sea text-white' : 'border-line bg-white text-navy-soft hover:border-sea hover:text-sea'
  )

export default function ToursPage() {
  const { hash } = useLocation()
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState<PackageCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const traveller = (params.get('for') as TravellerType | null) ?? null

  // Honour /tours#group-departures after the route-change scroll reset.
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 150)
    return () => window.clearTimeout(t)
  }, [hash])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tourPackages.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!traveller || p.travellers.includes(traveller)) &&
        (!q || `${p.title} ${p.destination} ${p.highlights.join(' ')}`.toLowerCase().includes(q))
    )
  }, [category, traveller, query])

  const setTraveller = (t: TravellerType | null) => {
    const next = new URLSearchParams(params)
    if (t) next.set('for', t)
    else next.delete('for')
    setParams(next, { replace: true })
  }

  return (
    <div className="bg-mist">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 md:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-medium text-sea">Holiday packages</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-navy md:text-6xl">
            Trips planned around you, not a brochure.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-muted">
            Every package can be adjusted to your dates, budget and hotel choice. Road trips from Delhi NCR travel
            in our own vehicles, chosen for your group size.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {packageCategories.map((c) => (
              <button key={c.id} onClick={() => setCategory(c.id)} className={chip(category === c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex w-full items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 lg:w-72">
            <Search size={16} className="text-navy-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations"
              className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-navy-muted"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-navy-muted">Travelling as</span>
          <button onClick={() => setTraveller(null)} className={chip(!traveller)}>
            Anyone
          </button>
          {travellerTypes.map((t) => (
            <button key={t.id} onClick={() => setTraveller(t.id)} className={chip(traveller === t.id)}>
              {t.title}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:pb-28">
        <p className="mb-8 text-sm text-navy-muted">
          {filtered.length} {filtered.length === 1 ? 'package' : 'packages'}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center text-navy-muted">
            No packages match those filters. Tell us where you want to go and we will plan it for you.
          </div>
        ) : (
          <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <PackageCard pkg={pkg} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <div className="bg-white">
        <GroupDepartures />
      </div>
      <div className="py-20 md:py-28">
        <CustomTripBanner />
      </div>
      <ContactBand />
    </div>
  )
}
