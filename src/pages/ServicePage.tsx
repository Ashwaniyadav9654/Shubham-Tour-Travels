import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, MapPin, Plane, Users } from 'lucide-react'
import {
  getService, serviceFaqs, popularRoutesFrom, serviceTypes, serviceCities, serviceSlug, origins,
} from '@/data/seoPages'
import { whatsappBookingLink } from '@/lib/utils'
import { btn, WhatsAppIcon } from '@/components/site/ui'
import VehiclePhoto from '@/components/site/VehiclePhoto'
import { ContactBand } from '@/components/home/HomeSections'
import { FaqList, Crumbs, LinkGrid } from '@/components/site/SeoBlocks'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-8'

export default function ServicePage() {
  const { slug = '' } = useParams()
  const s = getService(slug)
  if (!s) return <Navigate to="/services" replace />
  const { type: t, city: c } = s
  const title = t.title(c.name)
  const quote = `/booking?${new URLSearchParams({ service: t.bookingService, from: c.name, message: `${title} enquiry.` })}`
  const fromName = origins.find((o) => o.slug === c.routesFrom)?.name ?? c.name
  const routes = t.slug === 'airport-taxi' ? [] : popularRoutesFrom(c.routesFrom)

  return (
    <div className="bg-mist">
      <section className={`${shell} pb-12 pt-10 md:pt-16`}>
        <Crumbs items={[['Home', '/'], ['Services', '/services'], [title, `/services/${slug}`]]} />
        <p className="mt-6 text-sm font-medium text-sea">{c.name}, Delhi NCR</p>
        <h1 className="mt-2 max-w-4xl font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-navy-soft">{t.intro(c.name)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={quote} className={btn.primary}>Get a free quote <ArrowRight size={16} /></Link>
          <a href={whatsappBookingLink(title)} target="_blank" rel="noopener noreferrer" className={btn.outline}>
            <WhatsAppIcon /> WhatsApp us
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-navy">
            <MapPin size={14} className="text-sea" /> Pickup: {c.areas.join(', ')}
          </span>
          {s.airport && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-navy">
              <Plane size={14} className="text-sea" /> IGI Airport: ~{s.airport.km} km, {s.airport.mins} min
            </span>
          )}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className={shell}>
          <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">Vehicles for {t.short.toLowerCase()} in {c.name}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {s.vehicles.map((v) => (
              <div key={v.id} className="flex flex-col">
                <Link to={`/fleet/${v.id}`} className="group block overflow-hidden rounded-3xl">
                  <VehiclePhoto src={v.images[0]} alt={`${v.name} on rent in ${c.name}`} full={v.showFullPhoto} className="aspect-[4/3]" />
                </Link>
                <h3 className="mt-4 text-lg font-semibold text-navy">{v.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-muted">
                  <Users size={14} /> {v.seats} seats · {v.ac ? 'AC' : 'Non-AC'} · {v.fuelType}
                </p>
                <a href={whatsappBookingLink(`${v.name} in ${c.name}`)} target="_blank" rel="noopener noreferrer" className={`${btn.outline} mt-3 self-start`}>
                  Enquire
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {routes.length > 0 && (
        <section className="py-14 md:py-20">
          <div className={shell}>
            <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">Popular trips from {fromName}</h2>
            <LinkGrid cols={3} links={routes.map((r) => [`${r.origin.name} to ${r.dest.name}`, `/routes/${r.slug}`, `${r.km} km`])} />
          </div>
        </section>
      )}

      <section className="bg-white py-14 md:py-20">
        <div className={`${shell} grid gap-12 lg:grid-cols-[1.4fr_1fr]`}>
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">{title}: common questions</h2>
            <FaqList faqs={serviceFaqs(s)} />
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-navy">More services in {c.name}</h2>
              <LinkGrid cols={1} links={serviceTypes.filter((x) => x.slug !== t.slug).map((x) => [x.title(c.name), `/services/${serviceSlug(x.slug, c.slug)}`])} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-navy">{t.short} in other cities</h2>
              <LinkGrid cols={1} links={serviceCities.filter((x) => x.slug !== c.slug).map((x) => [t.title(x.name), `/services/${serviceSlug(t.slug, x.slug)}`])} />
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
    </div>
  )
}
