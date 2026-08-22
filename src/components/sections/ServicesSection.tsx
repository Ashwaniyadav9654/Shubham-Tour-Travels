import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Crown, Car, Plane, Briefcase, Heart, Map, ArrowUpRight } from 'lucide-react'
import { services } from '@/data'
import { cn } from '@/lib/utils'
import {
  useScrollReveal,
  useHeaderReveal,
  useCardHover,
  useClipReveal,
  useSpotlight,
} from '@/hooks/useGsapAnimations'

const iconMap: Record<string, React.ElementType> = {
  Bus, Crown, Car, Plane, Briefcase, Heart, Map,
}

/* Bento spans — index 0 is the signature cell (4 cols × 2 rows). */
const bento = [
  'md:col-span-4 md:row-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
]

export default function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useHeaderReveal(headerRef)
  useScrollReveal(gridRef, { y: 64, scale: 0.97, stagger: 0.08 })
  // Each cell glows in its own accent and tips toward the cursor
  useCardHover(gridRef, { lift: -6, scale: 1.005, glowSize: 70, tilt: 3 })
  useClipReveal(gridRef, { start: 'top 80%' })
  useSpotlight(gridRef)

  return (
    <section className="relative section-pad bg-ink overflow-hidden">
      <div className="relative z-10 shell">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 items-end mb-16 md:mb-24"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5 mb-8">
              <span className="eyebrow text-brass">Our Services</span>
              <span className="h-px w-16 bg-hairline" />
              <span className="eyebrow text-obsidian-600">01 / 06</span>
            </div>
            <h2 className="display-lg text-bone">
              Every journey,<br />
              <em className="text-obsidian-500" style={{ fontStyle: 'italic' }}>perfectly curated.</em>
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 lede text-obsidian-400">
            From intimate airport transfers to royal wedding convoys, and each experience
            is built around obsessive attention to detail.
          </p>
        </div>

        {/* ── Bento grid ─────────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(170px,auto)] md:auto-rows-[minmax(220px,auto)] gap-px bg-hairline border border-hairline"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Car
            const featured = i === 0

            return (
              <div
                key={service.id}
                data-reveal
                data-hover-card
                className={cn('relative bg-ink', bento[i] ?? 'md:col-span-2')}
              >
                <Link
                  to={service.href}
                  className="spotlight group h-full flex flex-col justify-between p-7 md:p-10 overflow-hidden transition-paint hover:bg-carbon"
                >
                  {/* Featured cell carries the photograph */}
                  {featured && (
                    <div
                      data-clip
                      className="media-frame absolute inset-0 pointer-events-none"
                    >
                      <img
                        src="/images/cars/maharaja-exterior.jpg"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover opacity-[0.11] group-hover:opacity-25 transition-opacity duration-700"
                        style={{ filter: 'saturate(1.1)' }}
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = 'none'
                        }}
                      />
                      {/* Flat scrim keeps the title legible over the photo */}
                      <div className="absolute inset-0 bg-ink/70" />
                    </div>
                  )}

                  {/* Top row: index + icon in the cell's own accent */}
                  <div className="relative flex items-start justify-between">
                    <span className="eyebrow text-[10px] text-obsidian-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-11 h-11 flex items-center justify-center border border-gold-500/25 bg-gold-500/[0.07] text-brass transition-all duration-500 group-hover:border-gold-500/60 group-hover:scale-110">
                      <Icon size={featured ? 20 : 17} strokeWidth={1.4} />
                    </span>
                  </div>

                  {/* Bottom: title + description */}
                  <div className="relative mt-10 md:mt-16">
                    <h3
                      className={cn(
                        'text-bone mb-4 tracking-tighter',
                        featured
                          ? 'display-md max-w-[14ch]'
                          : 'font-display text-[1.35rem] leading-[1.1]'
                      )}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={cn(
                        'text-obsidian-400 text-sm leading-relaxed font-light',
                        featured ? 'max-w-md' : 'max-w-[34ch] line-clamp-3'
                      )}
                    >
                      {service.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2.5 text-obsidian-500 group-hover:text-brass transition-colors duration-500">
                      <span className="eyebrow text-[10px]">Discover</span>
                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>

                  {/* Accent bar that draws across the top edge on hover */}
                  <span className="hue-sweep" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
