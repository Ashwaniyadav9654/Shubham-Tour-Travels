import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Users, ArrowUpRight, ArrowRight } from 'lucide-react'
import { vehicles } from '@/data'
import { formatCurrency, whatsappBookingLink } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import { useHorizontalScroll, useCardHover, useSpotlight } from '@/hooks/useGsapAnimations'

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Pins the section and drives the rail sideways (>=1024px only —
  // below that `.h-track` becomes a native swipe rail, see index.css)
  useHorizontalScroll(sectionRef, trackRef, progressRef)
  useCardHover(trackRef, {
    selector: '[data-hover-card]',
    lift: -10,
    scale: 1.01,
    glow: 'rgba(192,161,114,0.34)',
    glowSize: 80,
    tilt: 4,
  })
  useSpotlight(trackRef)

  return (
    <section
      ref={sectionRef}
      className="relative bg-carbon border-y border-hairline lg:h-[100svh] overflow-hidden"
    >
      {/* Heights are tuned so the whole composition clears a 100svh pin
          on a 900px-tall laptop without the rail being cropped. */}
      <div className="relative z-10 h-full flex flex-col justify-center py-20 lg:py-14">

        {/* ── Header — stays put while the rail moves ────────────── */}
        <div className="shell shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 lg:mb-12">
            <div>
              <div className="flex items-center gap-5 mb-6">
                <span className="eyebrow text-brass">Premium Fleet</span>
                <span className="h-px w-16 bg-hairline" />
                <span className="eyebrow text-obsidian-600">
                  {String(vehicles.length).padStart(2, '0')} Vehicles
                </span>
              </div>
              <h2 className="display-md text-bone">
                Vehicles worthy of<br />
                <em className="text-obsidian-500" style={{ fontStyle: 'italic' }}>every occasion.</em>
              </h2>
            </div>

            <div className="flex items-center gap-8 shrink-0">
              <span className="eyebrow text-[10px] text-obsidian-600 hidden lg:flex items-center gap-3">
                Scroll <ArrowRight size={13} />
              </span>
              <Magnetic strength={0.3}>
                <Link to="/fleet" className="btn-luxury on-dark">
                  Full Fleet <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* ── Horizontal rail ────────────────────────────────────── */}
        <div
          ref={trackRef}
          className="h-track gap-6 px-[var(--gutter)]"
        >
          {vehicles.map((vehicle, i) => (
            <article
              key={vehicle.id}
              data-hover-card
              className="spotlight group shrink-0 w-[82vw] sm:w-[24rem] lg:w-[27rem] bg-ink border border-hairline hover:border-brass/45 flex flex-col transition-paint"
            >
              <span className="hue-sweep" />
              {/* Media */}
              <div className="media-frame relative h-48 lg:h-52 bg-graphite">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  loading="lazy"
                  /* Full colour — the photography is the product here. */
                  className="w-full h-full object-cover transition-transform group-hover:scale-[1.07]"
                  style={{ transitionDuration: '1200ms', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', filter: 'saturate(1.15) contrast(1.04)' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cars/traveller.webp'
                  }}
                />
                <span className="absolute top-5 left-5 eyebrow text-[9px] text-bone/70 mix-blend-difference">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {vehicle.badge && (
                  <span className="absolute top-5 right-5 eyebrow text-[9px] text-brass bg-ink/75 border border-gold-500/30 backdrop-blur-md px-3 py-2">
                    {vehicle.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-6 lg:p-7">
                <h3 className="font-display text-bone text-[1.3rem] leading-[1.12] tracking-tighter mb-2">
                  {vehicle.name}
                </h3>
                <p className="text-obsidian-500 text-[13px] font-light mb-6">
                  {vehicle.tagline}
                </p>

                <div className="flex items-center gap-5 text-[11px] text-obsidian-500 pb-5 mb-5 border-b border-hairline">
                  <span className="flex items-center gap-2">
                    <Users size={11} strokeWidth={1.5} />
                    {vehicle.seats} seats
                  </span>
                  <span>{vehicle.fuelType}</span>
                  <span>{vehicle.ac ? 'AC' : 'Non-AC'}</span>
                  <span className="ml-auto text-brass font-medium">★ {vehicle.rating}</span>
                </div>

                <div className="flex items-end justify-between mt-auto gap-4">
                  <div>
                    <div className="eyebrow text-[9px] text-obsidian-600 mb-2">From</div>
                    <div className="font-display text-bone text-2xl tracking-tighter">
                      {formatCurrency(vehicle.pricePerKm)}
                      <span className="text-obsidian-500 text-sm font-body font-light">/km</span>
                    </div>
                  </div>
                  <a
                    href={whatsappBookingLink(vehicle.name, `${vehicle.seats} seats, from ₹${vehicle.pricePerKm}/km`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury on-dark text-[10px] py-3 px-6"
                  >
                    Book
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* Terminal panel */}
          <div className="shrink-0 w-[82vw] sm:w-[20rem] flex items-center">
            <div className="px-4">
              <h3 className="display-md text-bone mb-8 max-w-[12ch]">
                Specs, photos, <em className="text-obsidian-500" style={{ fontStyle: 'italic' }}>and rates.</em>
              </h3>
              <Magnetic strength={0.3}>
                <Link to="/fleet" className="btn-gold">
                  Browse All <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* ── Progress rule ──────────────────────────────────────── */}
        <div className="shell shrink-0 mt-12 hidden lg:block">
          <div className="h-px bg-hairline relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 bg-brass origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
