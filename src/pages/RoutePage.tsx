import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, Clock, MapPin, Route as RouteIcon, Users } from 'lucide-react'
import {
  getRoute, routeFaqs, tripSuggestion, nearbyDestinations, vehicleOptions, routeSlug, origins,
} from '@/data/seoPages'
import { whatsappBookingLink } from '@/lib/utils'
import { btn, WhatsAppIcon } from '@/components/site/ui'
import { PackageCard } from '@/components/site/PackageCard'
import VehiclePhoto from '@/components/site/VehiclePhoto'
import { ContactBand } from '@/components/home/HomeSections'
import { FaqList, Crumbs, LinkGrid } from '@/components/site/SeoBlocks'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-8'

export default function RoutePage() {
  const { slug = '' } = useParams()
  const r = getRoute(slug)
  if (!r) return <Navigate to="/routes" replace />
  const { origin: o, dest: d } = r
  const quote = `/booking?${new URLSearchParams({ service: 'Luxury Group Tour', from: o.name, to: d.name, message: `${o.name} to ${d.name} trip (${r.km} km).` })}`
  const nearby = nearbyDestinations(d).filter((n) => n.road[o.slug])
  const otherOrigins = origins.filter((x) => x.slug !== o.slug && d.road[x.slug])

  return (
    <div className="bg-mist">
      <section className={`${shell} pb-10 pt-10 md:pt-16`}>
        <Crumbs items={[['Home', '/'], ['Routes', '/routes'], [`${o.name} to ${d.name}`, `/routes/${slug}`]]} />
        <p className="mt-6 text-sm font-medium text-sea">{d.state} · from {o.name}</p>
        <h1 className="mt-2 max-w-4xl font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">
          {o.name} to {d.name} Tempo Traveller, Taxi &amp; Bus
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-navy-soft">
          Book a cab, Innova, Tempo Traveller or 40-seater bus from {o.name} to {d.name} with a professional driver.
          {' '}{d.name} is about {r.km} km by road, roughly {r.hrsRange[0]}–{r.hrsRange[1]} hours including breaks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={quote} className={btn.primary}>Get a free quote <ArrowRight size={16} /></Link>
          <a href={whatsappBookingLink(`${o.name} to ${d.name}`, `${r.km} km`)} target="_blank" rel="noopener noreferrer" className={btn.outline}>
            <WhatsAppIcon /> WhatsApp us
          </a>
        </div>

        <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [<RouteIcon size={18} key="i" />, 'Distance by road', `${r.km} km`],
            [<Clock size={18} key="i" />, 'Travel time', `${r.hrsRange[0]}–${r.hrsRange[1]} hrs`],
            [<CalendarDays size={18} key="i" />, 'Suggested trip', tripSuggestion(r.km)],
            [<MapPin size={18} key="i" />, `Pickup in ${o.name}`, o.areas.slice(0, 4).join(', ')],
          ].map(([icon, k, v]) => (
            <div key={k as string} className="rounded-3xl border border-line bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-muted">
                <span className="text-sea">{icon}</span> {k}
              </dt>
              <dd className="mt-2 font-semibold text-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-navy-muted">
          Distance and driving time are road-routing estimates from central {o.name}; the lower figure is pure driving time.
        </p>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className={shell}>
          <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">Choose a vehicle for your group</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vehicleOptions().map((g) => {
              const v = g.vehicles[0]
              return (
                <div key={g.group} className="flex flex-col">
                  <Link to={`/fleet/${v.id}`} className="group block overflow-hidden rounded-3xl">
                    <VehiclePhoto src={v.images[0]} alt={`${v.name} for ${o.name} to ${d.name}`} full={v.showFullPhoto} className="aspect-[4/3]" />
                  </Link>
                  <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sun-ink">
                    <Users size={13} /> {g.group}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-navy">{g.vehicles.map((x) => x.name).join(' / ')}</h3>
                  <a href={whatsappBookingLink(`${v.name}: ${o.name} to ${d.name}`)} target="_blank" rel="noopener noreferrer" className={`${btn.outline} mt-3 self-start`}>
                    Enquire
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className={`${shell} grid gap-10 lg:grid-cols-[1.2fr_1fr]`}>
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">Places to see in {d.name}</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {d.places.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm text-navy">
                  <MapPin size={14} className="text-sea" /> {p}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-lg font-semibold text-navy">Other trips near {d.name} from {o.name}</h3>
            <LinkGrid
              links={nearby.slice(0, 6).map((n) => [`${o.name} to ${n.name}`, `/routes/${routeSlug(o.slug, n.slug)}`, `${n.road[o.slug]!.km} km`])}
            />
          </div>
          {r.pkg && (
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">Prefer a full holiday package?</h2>
              <div className="mt-6 max-w-sm"><PackageCard pkg={r.pkg} /></div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className={`${shell} grid gap-12 lg:grid-cols-[1.4fr_1fr]`}>
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">
              {o.name} to {d.name}: common questions
            </h2>
            <FaqList faqs={routeFaqs(r)} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy">{d.name} from other NCR cities</h2>
            <LinkGrid
              cols={1}
              links={otherOrigins.map((x) => [`${x.name} to ${d.name}`, `/routes/${routeSlug(x.slug, d.slug)}`, `${d.road[x.slug]!.km} km`])}
            />
          </div>
        </div>
      </section>

      <ContactBand />
    </div>
  )
}
