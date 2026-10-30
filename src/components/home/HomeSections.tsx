import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Users, Phone } from 'lucide-react'
import {
  tourPackages,
  packageCategories,
  travellerTypes,
  destinations,
  vehicles,
  bookingTerms,
} from '@/data'
import type { PackageCategory } from '@/types'
import { cn, whatsappLink, whatsappBookingLink, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'
import { SectionHeading, ArrowLink, Reveal, Carousel, btn, WhatsAppIcon } from '@/components/site/ui'
import { PackageCard, GroupTripCard } from '@/components/site/PackageCard'
import VehiclePhoto from '@/components/site/VehiclePhoto'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-8'
const sectionPad = 'py-20 md:py-28'

/* ─── 01 · What we do ─────────────────────────────────────────────── */

const offerings = [
  {
    title: 'Tempo Traveller Hire',
    text: '12+2 Maharaja Tempo Travellers with pushback seats and ambient lighting.',
    image: '/images/cars/maharaja-exterior.jpg',
    to: '/fleet/maharaja-12-tempo',
  },
  {
    title: 'Holiday Packages',
    text: 'Hill stations, pilgrimages, beaches and international trips.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80&auto=format&fit=crop',
    to: '/tours',
  },
  {
    title: 'Group Trips',
    text: 'Fixed departures and private groups with one vehicle for everyone.',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=900&q=80&auto=format&fit=crop',
    to: '/tours#group-departures',
  },
  {
    title: 'Airport Transfers',
    text: 'IGI pickups and drops, 24×7, with flight tracking and a name board.',
    image: '/images/crysta.jpg',
    to: '/airport-transfer',
  },
  {
    title: 'Corporate Travel',
    text: 'Monthly accounts, GST billing and coaches for offsites.',
    image: '/images/cars/ac-bus-40.jpg',
    to: '/corporate',
  },
  {
    title: 'Wedding Transport',
    text: 'Guest shuttles, baraat convoys and decorated cars for the couple.',
    image: '/images/cars/maharaja-interior.jpg',
    to: '/wedding',
  },
]

export function Offerings() {
  return (
    <section className={sectionPad}>
      <div className={shell}>
        <SectionHeading
          eyebrow="Everything you need"
          title="One travel desk for the whole journey."
          sub="Vehicles, stays and itineraries, arranged by people who drive these roads every week."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o, i) => (
            <Reveal key={o.title} delay={(i % 3) * 0.08}>
              <Link
                to={o.to}
                className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl p-6 md:h-72"
              >
                <img
                  src={o.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/5" />
                <span className="absolute left-6 top-5 text-xs font-semibold text-sun">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative">
                  <h3 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
                    {o.title}
                    <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-white/80">{o.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 02 · Holiday packages ───────────────────────────────────────── */

export function PackagesExplorer() {
  const [active, setActive] = useState<PackageCategory | 'all'>('all')
  const shown = useMemo(
    () => (active === 'all' ? tourPackages : tourPackages.filter((p) => p.category === active)).slice(0, 6),
    [active]
  )

  return (
    <section className={cn(sectionPad, 'bg-white')}>
      <div className={shell}>
        <SectionHeading
          eyebrow="Holiday packages"
          title="Go somewhere worth the drive."
          sub={`${tourPackages.length} handpicked trips, each one adjustable to your dates, group size and budget.`}
          action={<ArrowLink to="/tours">All holiday packages</ArrowLink>}
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {packageCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
                active === c.id
                  ? 'border-sea bg-sea text-white'
                  : 'border-line bg-white text-navy-soft hover:border-sea hover:text-sea'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((pkg) => (
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
      </div>
    </section>
  )
}

/* ─── 03 · Group departures ───────────────────────────────────────── */

export function GroupDepartures() {
  const trips = tourPackages.filter((p) => p.group)
  return (
    <section id="group-departures" className={sectionPad}>
      <div className={shell}>
        <SectionHeading
          eyebrow="Group departures"
          title="Travel together. Arrive together."
          sub="Small-group trips from Gurgaon in our own Tempo Travellers. Join a departure or book the whole vehicle."
          action={<ArrowLink to="/tours#group-departures">All group trips</ArrowLink>}
        />
        <Carousel>
          {trips.map((pkg) => (
            <GroupTripCard key={pkg.id} pkg={pkg} />
          ))}
        </Carousel>
      </div>
    </section>
  )
}

/* ─── 04 · Custom trip banner ─────────────────────────────────────── */

const tripSteps = ['Destination', 'Dates', 'Travellers', 'Budget', 'Stay', 'Vehicle', 'Experiences']

export function CustomTripBanner() {
  return (
    <section className="px-3 sm:px-5">
      <Reveal className="relative overflow-hidden rounded-[2rem]">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=80&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
        <div className="relative px-6 py-16 sm:px-10 md:px-16 md:py-24">
          <p className="text-sm font-medium text-sun">Customised trips</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
            Your route.
            <br />
            Your pace.
          </h2>
          <p className="mt-6 max-w-xl text-white/80 md:text-lg">
            Every group travels differently. Tell us what matters and we will build the itinerary,
            the stays and the vehicle around it.
          </p>
          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
            {tripSteps.map((s, i) => (
              <li key={s} className="border-t border-white/20 pt-3">
                <span className="text-xs font-semibold text-sun">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-white">{s}</span>
              </li>
            ))}
          </ol>
          <Link to="/booking?service=Luxury%20Group%20Tour" className={cn(btn.primary, 'mt-10')}>
            Build my trip <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── 05 · Destinations ───────────────────────────────────────────── */

export function Destinations() {
  return (
    <section className={sectionPad}>
      <div className={shell}>
        <SectionHeading eyebrow="Destinations" title="Where the next journey begins." />
        <Carousel>
          {destinations.map((d) => (
            <Link
              key={d.name}
              to={d.to}
              className="group relative flex h-80 w-[230px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl p-5 sm:w-[260px]"
            >
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sun">{d.region}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-white">{d.name}</p>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

/* ─── 06 · Traveller types ────────────────────────────────────────── */

export function TravellerTypes() {
  return (
    <section className={cn(sectionPad, 'bg-white')}>
      <div className={shell}>
        <SectionHeading eyebrow="Travellers" title="Find the journey that fits you." />
        <div className="grid gap-4 md:grid-cols-2">
          {travellerTypes.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.08}>
              <Link
                to={`/tours?for=${t.id}`}
                className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl p-7 md:h-80"
              >
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="relative">
                  <h3 className="flex items-center gap-2 font-display text-3xl font-semibold text-white">
                    {t.title}
                    <ArrowUpRight size={20} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/80">{t.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 07 · Transportation ─────────────────────────────────────────── */

const featuredVehicleIds = [
  'innova-hycross',
  'innova-crysta',
  'maharaja-12-tempo',
  'ac-bus-40',
  'ertiga',
  'swift-dzire',
]

export function Transportation() {
  const fleet = featuredVehicleIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  return (
    <section className={sectionPad}>
      <div className={shell}>
        <SectionHeading
          eyebrow="Transportation"
          title="Tell us how many. We bring the right vehicle."
          sub="Sedans to 40-seater coaches, all owned, maintained and driven by our own team."
          action={<ArrowLink to="/fleet">Full fleet</ArrowLink>}
        />
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.06} className="flex flex-col">
              <Link to={`/fleet/${v.id}`} className="group relative block overflow-hidden rounded-3xl">
                <VehiclePhoto
                  src={v.images[0]}
                  alt={v.name}
                  full={v.showFullPhoto}
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-700 group-hover:scale-105"
                />
                {v.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold capitalize text-navy">
                    {v.badge.toLowerCase()}
                  </span>
                )}
              </Link>
              <h3 className="mt-4 font-display text-xl font-semibold text-navy">{v.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-muted">
                <Users size={14} /> {v.seats} seats · {v.ac ? 'AC' : 'Non-AC'} · {v.fuelType}
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={whatsappBookingLink(v.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btn.outline}
                >
                  Enquire
                </a>
                <Link to={`/fleet/${v.id}`} className={btn.ghost}>
                  Details
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 08 · Why us ─────────────────────────────────────────────────── */

const reasons = [
  ['Complete travel desk', 'Vehicles, hotels, itineraries and drivers in one conversation.'],
  ['Our own fleet', 'We own the Tempo Travellers and coaches we send. No sub-contracted surprises.'],
  ['Personal planning', 'Your dates, budget and who is travelling come first. The brochure comes second.'],
  ['15+ years on the road', 'Delhi NCR, the hills and the yatra routes, driven by people who know them.'],
  ['Transparent booking', `Written quotes and only ${bookingTerms.advancePercent}% advance to confirm.`],
  ['24×7 support', 'A real person on the phone from pickup to drop.'],
]

export function WhyUs() {
  return (
    <section className={cn(sectionPad, 'bg-white')}>
      <div className={cn(shell, 'grid gap-12 lg:grid-cols-[1fr_1.6fr]')}>
        <div>
          <SectionHeading
            eyebrow="Why Shubham"
            title="Travel planned by people, not a booking engine."
            className="mb-8"
          />
        </div>
        <dl className="border-t border-line">
          {reasons.map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.04}>
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
                <dt className="font-display text-xl font-semibold text-navy">{title}</dt>
                <dd className="text-navy-soft sm:pt-1">{text}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ─── 09 · Closing call to action ─────────────────────────────────── */

export function ContactBand() {
  return (
    <section className="px-3 pb-20 sm:px-5 md:pb-28">
      <Reveal className="mx-auto max-w-7xl rounded-[2rem] bg-navy px-6 py-14 text-center sm:px-10 md:py-20">
        <p className="text-sm font-medium text-sun">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Tell us where you want to go.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">
          Share your dates and group size. We reply with a written quote, usually within the hour.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/booking" className={btn.primary}>
            Get a free quote
          </Link>
          <a
            href={whatsappLink('Hello! I would like to plan a trip with Shubham Tour & Travels.')}
            target="_blank"
            rel="noopener noreferrer"
            className={btn.light}
          >
            <WhatsAppIcon /> WhatsApp us
          </a>
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <Phone size={15} /> {PHONE_NUMBER}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
