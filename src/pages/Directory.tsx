import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  origins, destinations, routeSlug, serviceTypes, serviceCities, serviceSlug, collections, getCollection,
} from '@/data/seoPages'
import { PackageCard } from '@/components/site/PackageCard'
import { ContactBand } from '@/components/home/HomeSections'
import { Crumbs, LinkGrid } from '@/components/site/SeoBlocks'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-8'

function Header({ crumbs, title, intro }: { crumbs: [string, string][]; title: string; intro: string }) {
  return (
    <section className={`${shell} pb-8 pt-10 md:pt-16`}>
      <Crumbs items={crumbs} />
      <h1 className="mt-6 max-w-4xl font-display text-3xl font-semibold leading-tight text-navy md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-navy-soft">{intro}</p>
    </section>
  )
}

/** /routes — every NCR city → destination page, grouped by city. */
export function RoutesIndexPage() {
  return (
    <div className="bg-mist">
      <Header
        crumbs={[['Home', '/'], ['Routes', '/routes']]}
        title="Tempo Traveller & Taxi Routes from Delhi NCR"
        intro={`Road distance and travel time from ${origins.length} NCR cities to ${destinations.length} hill stations, pilgrim towns and heritage cities, with the right vehicle for your group.`}
      />
      <div className={`${shell} space-y-12 pb-20`}>
        {origins.map((o) => (
          <section key={o.slug}>
            <h2 className="font-display text-2xl font-semibold text-navy">From {o.name}</h2>
            <LinkGrid
              cols={3}
              links={destinations
                .filter((d) => d.road[o.slug])
                .sort((a, b) => a.road[o.slug]!.km - b.road[o.slug]!.km)
                .map((d) => [`${o.name} to ${d.name}`, `/routes/${routeSlug(o.slug, d.slug)}`, `${d.road[o.slug]!.km} km`])}
            />
          </section>
        ))}
      </div>
      <ContactBand />
    </div>
  )
}

/** /services — every service in every NCR city. */
export function ServicesIndexPage() {
  return (
    <div className="bg-mist">
      <Header
        crumbs={[['Home', '/'], ['Services', '/services']]}
        title="Tempo Traveller, Bus & Cab Services in Delhi NCR"
        intro="Our own Tempo Travellers, buses, Innovas and sedans with professional drivers, across every Delhi NCR city."
      />
      <div className={`${shell} space-y-12 pb-20`}>
        {serviceTypes.map((t) => (
          <section key={t.slug}>
            <h2 className="font-display text-2xl font-semibold text-navy">{t.short}</h2>
            <LinkGrid cols={3} links={serviceCities.map((c) => [t.title(c.name), `/services/${serviceSlug(t.slug, c.slug)}`])} />
          </section>
        ))}
        <section>
          <h2 className="font-display text-2xl font-semibold text-navy">Holiday packages by type and state</h2>
          <LinkGrid cols={3} links={collections().map((c) => [c.title, `/holiday-packages/${c.slug}`, `${c.packages.length}`])} />
        </section>
      </div>
      <ContactBand />
    </div>
  )
}

/** /holiday-packages/:slug — packages by trip type or state. */
export function CollectionPage() {
  const { slug = '' } = useParams()
  const c = getCollection(slug)
  if (!c) return <Navigate to="/tours" replace />
  const others = collections().filter((x) => x.slug !== c.slug)
  return (
    <div className="bg-mist">
      <Header crumbs={[['Home', '/'], ['Tour Packages', '/tours'], [c.title, `/holiday-packages/${c.slug}`]]} title={c.title} intro={c.intro} />
      <section className={`${shell} pb-16`}>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {c.packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
        </div>
      </section>
      <section className="bg-white py-14">
        <div className={shell}>
          <h2 className="font-display text-2xl font-semibold text-navy">More tour packages</h2>
          <LinkGrid cols={3} links={others.map((x) => [x.title, `/holiday-packages/${x.slug}`, `${x.packages.length}`])} />
        </div>
      </section>
      <ContactBand />
    </div>
  )
}
