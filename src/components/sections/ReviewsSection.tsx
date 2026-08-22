import React, { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { reviews, ratingSummary } from '@/data'
import {
  useHeaderReveal,
  useScrollReveal,
  useCardHover,
  useSpotlight,
  useCounter,
} from '@/hooks/useGsapAnimations'

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className="text-brass"
          fill={i < Math.round(n) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )
}

export default function ReviewsSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useHeaderReveal(headerRef)
  useCounter(scoreRef)
  useScrollReveal(gridRef, { y: 56, scale: 0.98, stagger: 0.08, start: 'top 86%' })
  useCardHover(gridRef, { lift: -8, scale: 1.008, glow: 'rgba(192,161,114,0.28)', glowSize: 70 })
  useSpotlight(gridRef)

  return (
    <section className="section-pad bg-carbon border-y border-hairline">
      <div className="shell">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-8 items-end mb-16 md:mb-20"
        >
          <div className="lg:col-span-6">
            <div className="flex items-center gap-5 mb-8">
              <span className="eyebrow text-brass">Customer Reviews</span>
              <span className="h-px w-16 bg-hairline" />
              <span className="eyebrow text-obsidian-600">Verified</span>
            </div>
            <h2 className="display-lg text-bone">
              Rated{' '}
              <em className="text-brass inline-block mr-[0.12em]" style={{ fontStyle: 'italic' }}>
                {ratingSummary.score}
              </em>{' '}
              by<br />
              our travellers.
            </h2>
          </div>

          {/* Aggregate score panel */}
          <div ref={scoreRef} className="lg:col-span-5 lg:col-start-8">
            <div className="grid grid-cols-3 border-l border-hairline">
              <div className="border-r border-hairline px-5 py-7">
                <div data-counter className="font-display text-bone text-4xl tracking-tighter mb-3 tabular-nums">
                  {ratingSummary.score}
                </div>
                <Stars n={ratingSummary.score} size={11} />
                <div className="eyebrow text-[9px] text-obsidian-600 mt-3">Average</div>
              </div>
              <div className="border-r border-hairline px-5 py-7">
                <div data-counter className="font-display text-bone text-4xl tracking-tighter mb-3 tabular-nums">
                  {ratingSummary.travellers}
                </div>
                <div className="eyebrow text-[9px] text-obsidian-600 mt-[26px]">Travellers</div>
              </div>
              <div className="border-r border-hairline px-5 py-7">
                <div data-counter className="font-display text-bone text-4xl tracking-tighter mb-3 tabular-nums">
                  {ratingSummary.years}
                </div>
                <div className="eyebrow text-[9px] text-obsidian-600 mt-[26px]">Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Review cards ───────────────────────────────────────── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              data-reveal
              data-hover-card
              className="spotlight group relative bg-ink border border-hairline p-8 md:p-9 flex flex-col transition-paint hover:border-brass/40"
            >
              <span className="hue-sweep" />

              <Quote
                size={26}
                strokeWidth={1.25}
                className="absolute top-8 right-8 text-obsidian-800 group-hover:text-brass/40 transition-colors duration-500"
              />

              <Stars n={review.rating} />

              <p className="text-obsidian-300 text-[14px] leading-relaxed font-light mt-6 mb-8 flex-1">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="pt-6 border-t border-hairline">
                <div className="font-display text-bone text-[17px] tracking-tighter">
                  {review.name}
                </div>
                <div className="text-obsidian-500 text-[13px] font-light mt-1">
                  {review.location}
                </div>
                <div className="eyebrow text-[9px] text-brass mt-3">
                  {review.service}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
