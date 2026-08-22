import React, { useRef } from 'react'
import { useMarquee } from '@/hooks/useGsapAnimations'

const DESTINATIONS = [
  'Shimla', 'Manali', 'Mussoorie', 'Jaipur', 'Rishikesh', 'Agra',
  'Nainital', 'Haridwar', 'Udaipur', 'Amritsar', 'Dehradun', 'Kasauli',
]

const SERVICES = [
  'Airport Transfer', 'Corporate Fleet', 'Wedding Convoy', 'Group Tours',
  'Outstation', 'Pilgrimage', 'Event Shuttle', 'Executive Cab',
]

function Row({
  items,
  reverse,
  speed,
  muted,
}: {
  items: string[]
  reverse?: boolean
  speed: number
  muted?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useMarquee(ref, { speed, reverse })

  // Rendered twice so the loop seam lands exactly at half the track width
  const doubled = [...items, ...items]

  return (
    <div className="marquee">
      <div ref={ref} className="marquee__track">
        {doubled.map((item, i) => {
          return (
            <span key={`${item}-${i}`} className="flex items-center gap-12 shrink-0">
              <span
                className={
                  muted
                    ? 'font-display text-[clamp(1.5rem,3vw,2.6rem)] tracking-tighter text-obsidian-700'
                    : 'font-display text-[clamp(1.75rem,3.6vw,3.25rem)] tracking-tighter text-bone'
                }
              >
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-gold-500/60" />
            </span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Two counter-running tickers. Both react to scroll velocity, so the band
 * accelerates with the page and settles when it stops.
 */
export default function MarqueeStrip() {
  return (
    <section className="relative bg-ink border-y border-hairline py-14 md:py-20 overflow-hidden">
      <div className="flex flex-col gap-5 md:gap-7">
        <Row items={DESTINATIONS} speed={58} />
        <Row items={SERVICES} speed={44} reverse muted />
      </div>

      {/* Edge fades so the rows dissolve rather than being cut off */}
      <div
        className="absolute inset-y-0 left-0 w-24 md:w-48 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgb(var(--ink)) 0%, transparent 100%)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 md:w-48 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, rgb(var(--ink)) 0%, transparent 100%)' }}
      />
    </section>
  )
}
