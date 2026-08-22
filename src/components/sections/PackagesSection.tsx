import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock, MapPin, Star } from 'lucide-react'
import { tourPackages } from '@/data'
import { formatCurrency, whatsappBookingLink } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import {
  useHeaderReveal,
  useScrollReveal,
  useClipReveal,
  useCardHover,
  useSpotlight,
} from '@/hooks/useGsapAnimations'

export default function PackagesSection() {
  const featured = tourPackages.filter(p => p.popular).slice(0, 3)

  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useHeaderReveal(headerRef)
  useScrollReveal(gridRef, { y: 56, scale: 0.98, stagger: 0.1, start: 'top 86%' })
  useClipReveal(gridRef, { start: 'top 84%', stagger: 0.1 })
  useCardHover(gridRef, { lift: -10, scale: 1, glow: 'rgba(11,11,12,0.18)', glowSize: 80 })
  useSpotlight(gridRef)

  return (
    <section className="section-pad bg-bone">
      <div className="shell">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end mb-14 md:mb-20"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5 mb-7">
              <span className="eyebrow text-gold-600">Curated Journeys</span>
              <span className="h-px w-16 bg-obsidian-950/15" />
              <span className="eyebrow text-obsidian-400">
                {String(featured.length).padStart(2, '0')} Featured
              </span>
            </div>
            <h2 className="display-lg text-obsidian-950">
              India&rsquo;s most beloved<br />
              <em className="text-obsidian-400" style={{ fontStyle: 'italic' }}>travel experiences.</em>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:flex lg:justify-end lg:pb-2">
            <Magnetic strength={0.3}>
              <Link to="/tours" className="btn-luxury text-obsidian-950">
                All Packages <ArrowUpRight size={13} />
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* ── Even three-up grid ─────────────────────────────────────
            Equal columns, one gap value, every card the same internal
            rhythm — `items-stretch` + `h-full` so the CTA rows line up
            across cards no matter how long the titles run. */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch"
        >
          {featured.map((pkg, i) => (
            <article
              key={pkg.id}
              data-reveal
              data-hover-card
              className="spotlight group h-full flex flex-col bg-white border border-obsidian-950/10 hover:border-gold-500/45 transition-paint"
            >
              <span className="hue-sweep" />

              {/* Media */}
              <div data-clip className="media-frame relative aspect-[4/3] w-full bg-obsidian-100 shrink-0">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform group-hover:scale-[1.06]"
                  style={{
                    transitionDuration: '1200ms',
                    transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                    filter: 'saturate(1.12)',
                  }}
                />
                <span className="absolute top-5 left-5 eyebrow text-[9px] text-bone bg-ink/70 backdrop-blur-md px-3 py-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute top-5 right-5 flex items-center gap-1.5 eyebrow text-[9px] text-brass bg-ink/70 backdrop-blur-md px-3 py-2">
                  <Star size={9} fill="currentColor" strokeWidth={0} />
                  {pkg.rating}
                </span>
              </div>

              {/* Body — one consistent padding scale throughout */}
              <div className="flex flex-col flex-1 p-7 lg:p-8">

                <div className="flex items-center gap-5 text-obsidian-500 text-[12px] mb-5">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} strokeWidth={1.5} />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} strokeWidth={1.5} />
                    {pkg.destination}
                  </span>
                </div>

                <h3 className="font-display text-obsidian-950 text-[1.65rem] leading-[1.08] tracking-tighter mb-5">
                  {pkg.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-7">
                  {pkg.highlights.slice(0, 3).map((h) => (
                    <span
                      key={h}
                      className="text-[11px] px-3 py-1.5 bg-bone text-obsidian-500 border border-obsidian-950/8"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Price + CTA pinned to the bottom of every card */}
                <div className="mt-auto pt-6 border-t border-obsidian-950/10 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow text-[9px] text-obsidian-400 mb-2">From</div>
                    <div className="font-display text-obsidian-950 text-[1.6rem] tracking-tighter leading-none">
                      {formatCurrency(pkg.price)}
                    </div>
                  </div>
                  <a
                    href={whatsappBookingLink(pkg.title, pkg.destination)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury text-obsidian-950 text-[10px] py-3 px-6 shrink-0"
                  >
                    Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Booking note ───────────────────────────────────────── */}
        <div className="mt-14 md:mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-10 border-t border-obsidian-950/10">
          <span className="eyebrow text-[10px] text-obsidian-500">
            Only <span className="text-gold-600">10% advance</span> to confirm
          </span>
          <span className="eyebrow text-[10px] text-obsidian-500">GST billing available</span>
          <span className="eyebrow text-[10px] text-obsidian-500">GPS tracked fleet</span>
          <span className="eyebrow text-[10px] text-obsidian-500">24 / 7 support</span>
        </div>
      </div>
    </section>
  )
}
