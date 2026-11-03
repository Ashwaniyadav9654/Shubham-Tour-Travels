import React from 'react'
import { Link } from 'react-router-dom'
import { tourPackages } from '@/data'
import { PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'
import { btn } from '@/components/site/ui'

const popular = tourPackages.filter((p) => p.popular).slice(0, 6)

export default function NotFoundPage() {
  return (
    <div className="bg-mist">
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-20 text-center sm:px-8">
        <p className="text-sm font-semibold text-sea">404</p>
        <h1 className="mt-3 text-4xl font-bold text-navy md:text-5xl">This page took a wrong turn.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-navy-muted">
          The page may have moved or no longer exists. Try one of these instead, or call us on{' '}
          <a href={PHONE_HREF} className="font-semibold text-sea">{PHONE_NUMBER}</a>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={btn.primary}>Home</Link>
          <Link to="/tours" className={btn.outline}>Tour packages</Link>
          <Link to="/fleet" className={btn.outline}>Our fleet</Link>
          <Link to="/contact" className={btn.outline}>Contact</Link>
        </div>

        <h2 className="mt-16 text-xl font-bold text-navy">Popular trips</h2>
        <ul className="mt-5 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p) => (
            <li key={p.id}>
              <Link
                to={`/tours/${p.id}`}
                className="block rounded-2xl border border-line bg-white px-4 py-3 text-navy transition-colors hover:border-sea hover:text-sea"
              >
                <span className="block font-semibold">{p.title}</span>
                <span className="block text-sm text-navy-muted">{p.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
