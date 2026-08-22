import React, { useRef } from 'react'
import { stats } from '@/data'
import { useCounter, useScrollReveal, useSpotlight } from '@/hooks/useGsapAnimations'

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)

  // Counts each value up from zero, preserving its prefix/suffix
  useCounter(ref)
  useScrollReveal(ref, { y: 44, scale: 1, stagger: 0.08, start: 'top 88%' })
  useSpotlight(ref)

  return (
    <section className="bg-ink border-b border-hairline">
      <div className="shell">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 border-l border-hairline"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-reveal
              className="spotlight group border-r border-b lg:border-b-0 border-hairline px-6 md:px-10 py-14 md:py-20"
            >
              <span className="hue-sweep" />
              <div
                data-counter
                className="display-md text-bone mb-4 tabular-nums"
              >
                {stat.value}
              </div>
              <div className="eyebrow text-[10px] text-obsidian-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
