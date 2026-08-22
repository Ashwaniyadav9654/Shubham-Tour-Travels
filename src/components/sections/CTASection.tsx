import React, { useRef } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import { useHeadingReveal, useScrollReveal, useParallax, useSpotlight } from '@/hooks/useGsapAnimations'

const terms = [
  { value: '₹30', unit: '/km', label: 'Outstation' },
  { value: '₹28', unit: '/km', label: 'Local NCR' },
  { value: '250', unit: 'km', label: 'Min. per day' },
  { value: '10', unit: '%', label: 'Advance to confirm' },
]

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const termsRef = useRef<HTMLDivElement>(null)

  // Replaces the old `background-attachment: fixed`, which is unreliable
  // on mobile and does not survive a pinned/smooth-scrolled page.
  useParallax(mediaRef, { trigger: sectionRef, amount: 16 })
  useHeadingReveal(headingRef, 0, { scroll: true })
  useScrollReveal(bodyRef, { y: 44, scale: 1, stagger: 0.09, start: 'top 86%' })
  useSpotlight(termsRef)

  return (
    <section
      ref={sectionRef}
      className="relative section-pad-lg bg-ink overflow-hidden"
    >
      {/* Parallax media. Deliberately NOT /images/Safety.jpg — that asset is
          a poster with its own large "SAFETY FIRST" lettering, which reads
          as a second competing headline behind this one. */}
      <div ref={mediaRef} className="absolute inset-0 z-0">
        <img
          src="/images/bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.24) contrast(1.18) saturate(0.9)' }}
          onError={(e) => { (e.currentTarget.style.display = 'none') }}
        />
        <div className="absolute inset-0 bg-ink/82" />
      </div>

      <div className="relative z-10 shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 gap-x-8">

          {/* Headline */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
              <span className="eyebrow text-brass">Available 24 / 7</span>
            </div>

            <h2 ref={headingRef} className="display-lg text-bone">
              <span className="line-mask"><span data-line className="block">Ready to travel</span></span>
              <span className="line-mask">
                <span data-line className="block">
                  <em className="text-brass" style={{ fontStyle: 'italic' }}>in style?</em>
                </span>
              </span>
            </h2>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <p data-reveal className="lede text-obsidian-300 mb-10">
              Book your Luxury Tempo Traveller today. WhatsApp or call for instant
              quotes and real-time availability across Delhi NCR.
            </p>

            <div data-reveal className="flex flex-col gap-3">
              <Magnetic strength={0.28} as="block">
                <a
                  href={whatsappLink("Hi! I'd like to book a Luxury Tempo Traveller. Please share availability and pricing.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full"
                >
                  <MessageCircle size={15} strokeWidth={1.5} />
                  Book via WhatsApp
                </a>
              </Magnetic>
              <Magnetic strength={0.28} as="block">
                <a href={PHONE_HREF} className="btn-luxury on-dark w-full">
                  <Phone size={14} strokeWidth={1.5} />
                  {PHONE_NUMBER}
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Terms — a hairline table, not pills */}
          <div ref={termsRef} className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 border-l border-hairline mt-6">
            {terms.map((t) => (
              <div
                key={t.label}
                className="spotlight group border-r border-b lg:border-b-0 border-hairline px-6 py-10"
              >
                <span className="hue-sweep" />
                <div className="font-display text-bone text-3xl tracking-tighter mb-3">
                  {t.value}
                  <span className="text-obsidian-500 text-base font-body font-light">{t.unit}</span>
                </div>
                <div className="eyebrow text-[10px] text-obsidian-500">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
