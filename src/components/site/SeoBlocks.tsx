import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Breadcrumb trail (structured data for it is added in lib/seo). */
export function Crumbs({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-navy-muted">
        {items.map(([label, to], i) => (
          <li key={to} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} />}
            {i < items.length - 1 ? (
              <Link to={to} className="hover:text-sea">{label}</Link>
            ) : (
              <span className="text-navy">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-navy">
            <h3 className="text-base">{f.q}</h3>
            <ChevronDown size={18} className="shrink-0 text-navy-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 leading-relaxed text-navy-soft">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

/** Compact list of internal links: [label, href, meta]. */
export function LinkGrid({ links, cols = 2 }: { links: [string, string, string?][]; cols?: 1 | 2 | 3 }) {
  return (
    <ul className={cn('mt-4 grid gap-2', cols === 2 && 'sm:grid-cols-2', cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}>
      {links.map(([label, to, meta]) => (
        <li key={to}>
          <Link
            to={to}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-navy transition-colors hover:border-sea hover:text-sea"
          >
            <span className="font-medium">{label}</span>
            {meta && <span className="shrink-0 text-xs text-navy-muted">{meta}</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Shown on route, service and bus pages. Other bus companies with similar
 * names sell seats on redBus and similar apps; their passengers were finding
 * our number through these pages.
 */
export function PrivateHireNotice({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-3 rounded-2xl border border-sun/40 bg-sun/10 p-4 text-sm text-navy', className)} role="note">
      <Info size={18} className="mt-0.5 shrink-0 text-sun-ink" />
      <p>
        <span className="font-semibold">Private hire only.</span> We rent out the whole vehicle with a driver for your own
        group. We do not sell individual bus seats, run scheduled buses, or take bookings through redBus or other
        ticketing apps, and we are not connected with other operators named &ldquo;Shubham Travels&rdquo;. If you bought a
        seat ticket online, please contact the bus operator printed on your ticket.
      </p>
    </div>
  )
}
