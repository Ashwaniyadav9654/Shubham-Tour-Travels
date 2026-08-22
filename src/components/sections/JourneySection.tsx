import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Magnetic from '@/components/animations/Magnetic'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

/**
 * Three legs of one journey. The vehicle changes with the trip: a compact
 * sedan for the city run, an executive sedan intercity, the Crysta for the
 * mountain haul. Each has its own aspect so the cutouts sit correctly on
 * the road line.
 */
const LEGS = [
  {
    place: 'Gurgaon',
    region: 'Delhi NCR',
    km: 32,
    label: 'City Transfer',
    vehicle: 'Hyundai Aura',
    src: '/images/cars/Aura.png',
    width: 'clamp(215px, 24vw, 375px)',
  },
  {
    place: 'Jaipur',
    region: 'Rajasthan',
    km: 268,
    label: 'Intercity',
    vehicle: 'Honda City ZX',
    src: '/images/cars/honda-city-cutout.png',
    width: 'clamp(240px, 27vw, 420px)',
  },
  {
    place: 'Manali',
    region: 'Himachal Pradesh',
    km: 537,
    label: 'Mountain Tour',
    vehicle: 'Innova Crysta',
    src: '/images/cars/crysta.png',
    width: 'clamp(300px, 34vw, 540px)',
  },
]

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLDivElement>(null)
  const ridgeRef = useRef<HTMLDivElement>(null)
  const skylineRef = useRef<HTMLDivElement>(null)
  const dashRef = useRef<HTMLDivElement>(null)
  const kmRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const car = carRef.current
    if (!section || !scene || !car) return

    const cars = gsap.utils.toArray<HTMLElement>('[data-car]', scene)
    const names = gsap.utils.toArray<HTMLElement>('[data-place]', scene)
    const metas = gsap.utils.toArray<HTMLElement>('[data-meta]', scene)

    // Reduced motion: show the final leg, statically. No pin, no scrub.
    if (prefersReducedMotion()) {
      gsap.set(cars, { opacity: (i: number) => (i === LEGS.length - 1 ? 1 : 0) })
      gsap.set(names, { opacity: (i: number) => (i === LEGS.length - 1 ? 1 : 0) })
      gsap.set(metas, { opacity: (i: number) => (i === LEGS.length - 1 ? 1 : 0) })
      if (kmRef.current) kmRef.current.textContent = String(LEGS[LEGS.length - 1].km)
      return
    }

    const ctx = gsap.context(() => {
      /* ── Road dashes: continuous, independent of scroll ──────────
         Looped by exactly one tile width so the seam is invisible. */
      const dashLoop = dashRef.current
        ? gsap.to(dashRef.current, {
            backgroundPositionX: '-240px',
            duration: 1.6,
            ease: 'none',
            repeat: -1,
          })
        : null

      /* ── The scrubbed journey ──────────────────────────────────
         Range is measured from the actual viewport so the vehicle is
         fully on screen for the middle ~85% of the timeline — a lead-in
         proportional to the section width left it barely visible during
         the whole first leg. */
      const startX = () => -(carRef.current?.offsetWidth || 0) - 560
      const endX = () => window.innerWidth + 180

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2800',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            // Wheels-turning proxy: the dashes race with the scroll
            if (dashLoop) {
              const v = gsap.utils.clamp(0, 6, Math.abs(self.getVelocity()) / 300)
              gsap.to(dashLoop, { timeScale: 1 + v, duration: 0.2, overwrite: true })
            }
          },
        },
      })

      // The drive itself — one continuous pass across the viewport
      tl.fromTo(
        car,
        { x: startX },
        { x: endX, ease: 'none', duration: 3 },
        0
      )

      // Backdrop layers move at their own rates: far is slow, near is fast
      if (ridgeRef.current) {
        tl.fromTo(ridgeRef.current, { xPercent: 0 }, { xPercent: -14, ease: 'none', duration: 3 }, 0)
      }
      if (skylineRef.current) {
        tl.fromTo(skylineRef.current, { xPercent: 0 }, { xPercent: -38, ease: 'none', duration: 3 }, 0)
      }

      /* ── Leg changes ──────────────────────────────────────────
         Each leg owns a third of the timeline. The vehicle, the giant
         place name and the meta block all swap on the same beat. */
      LEGS.forEach((_, i) => {
        const at = i * 1 // legs start at 0, 1, 2 on a 3s timeline

        if (i > 0) {
          // Outgoing
          tl.to([cars[i - 1], names[i - 1], metas[i - 1]], {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          }, at - 0.15)
        }

        tl.fromTo(
          cars[i],
          { opacity: i === 0 ? 1 : 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' },
          i === 0 ? 0 : at
        )
        tl.fromTo(
          names[i],
          { opacity: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 22 },
          { opacity: 1, yPercent: 0, duration: 0.42, ease: 'power3.out' },
          i === 0 ? 0 : at
        )
        tl.fromTo(
          metas[i],
          { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 },
          { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' },
          i === 0 ? 0 : at
        )

        // Odometer climbs toward this leg's distance
        const counter = { v: i === 0 ? 0 : LEGS[i - 1].km }
        tl.to(counter, {
          v: LEGS[i].km,
          duration: 0.85,
          ease: 'none',
          onUpdate: () => {
            if (kmRef.current) kmRef.current.textContent = String(Math.round(counter.v))
          },
        }, at)
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-ink border-y border-hairline"
    >
      <div ref={sceneRef} className="absolute inset-0">

        {/* ── Giant place name, sitting behind the scene ─────────── */}
        <div className="absolute inset-x-0 top-[16%] flex justify-center pointer-events-none">
          <div className="relative">
            {LEGS.map((leg) => (
              <span
                key={leg.place}
                data-place
                className="block display-xl text-obsidian-700 whitespace-nowrap"
                style={{
                  gridArea: '1 / 1',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: 0,
                }}
              >
                {leg.place}
              </span>
            ))}
            {/* Invisible sizer keeps the stack's height in flow */}
            <span className="block display-xl opacity-0 select-none whitespace-nowrap" aria-hidden="true">
              {LEGS[2].place}
            </span>
          </div>
        </div>

        {/* ── Far ridge line ─────────────────────────────────────── */}
        <div
          ref={ridgeRef}
          className="absolute bottom-[26%] left-0 w-[130%] pointer-events-none opacity-70"
        >
          <svg viewBox="0 0 1600 160" preserveAspectRatio="none" className="w-full h-[16vh]">
            <path
              d="M0 160 L120 96 L210 124 L330 54 L455 110 L560 72 L690 132 L810 60 L930 118 L1050 78 L1180 130 L1300 88 L1420 122 L1520 74 L1600 130 L1600 160 Z"
              fill="rgb(31 31 35)"
            />
          </svg>
        </div>

        {/* ── Near skyline / treeline ────────────────────────────── */}
        <div
          ref={skylineRef}
          className="absolute bottom-[22%] left-0 w-[170%] pointer-events-none opacity-90"
        >
          <svg viewBox="0 0 2000 120" preserveAspectRatio="none" className="w-full h-[11vh]">
            <path
              d="M0 120 L0 78 L60 78 L60 46 L108 46 L108 84 L170 84 L170 58 L232 58 L232 90 L300 90 L300 40 L352 40 L352 88 L430 88 L430 66 L494 66 L494 96 L560 96 L560 52 L620 52 L620 92 L700 92 L700 70 L764 70 L764 100 L840 100 L840 48 L898 48 L898 90 L980 90 L980 74 L1046 74 L1046 100 L1120 100 L1120 56 L1180 56 L1180 94 L1260 94 L1260 68 L1326 68 L1326 98 L1400 98 L1400 44 L1458 44 L1458 88 L1540 88 L1540 72 L1606 72 L1606 100 L1680 100 L1680 60 L1740 60 L1740 92 L1820 92 L1820 76 L1886 76 L1886 102 L1960 102 L1960 66 L2000 66 L2000 120 Z"
              fill="rgb(24 24 27)"
            />
          </svg>
        </div>

        {/* ── Road ───────────────────────────────────────────────── */}
        <div className="absolute bottom-[22%] left-0 right-0 h-px bg-gold-500/45" />
        <div
          ref={dashRef}
          className="absolute bottom-[calc(22%-26px)] left-0 right-0 h-[3px] opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(var(--brass)) 0px, rgb(var(--brass)) 84px, transparent 84px, transparent 240px)',
          }}
        />
        {/* Ground plane below the road */}
        <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-carbon/80" />

        {/* ── The vehicle ────────────────────────────────────────────
            The wrapper is a zero-size point sitting exactly on the road
            line; every vehicle is anchored to `bottom: 0` from it. That
            way each keeps its own natural aspect and width, and they all
            share one contact point with the tarmac instead of being
            letterboxed into a common box. */}
        <div ref={carRef} className="absolute bottom-[22%] left-0 will-change-transform">
          <div className="relative">
            {LEGS.map((leg, i) => (
              <span
                key={leg.src}
                data-car
                className="block"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: leg.width,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <img
                  src={leg.src}
                  alt={leg.vehicle}
                  className="block w-full h-auto"
                  style={{ filter: 'drop-shadow(0 22px 24px rgba(0,0,0,0.6)) saturate(1.12) contrast(1.03)' }}
                />
                {/* Contact shadow grounding it on the tarmac */}
                <span
                  className="absolute left-[7%] right-[7%] -bottom-[6px] h-4 rounded-[50%] blur-lg"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* ── HUD ────────────────────────────────────────────────── */}
        <div className="absolute inset-x-0 top-0 pt-24 md:pt-28 pointer-events-none">
          <div className="shell flex items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-5 mb-6">
                <span className="eyebrow text-brass">The Journey</span>
                <span className="h-px w-16 bg-hairline" />
                <span className="eyebrow text-obsidian-600">Scroll to travel</span>
              </div>
              <h2 className="display-md text-bone max-w-[13ch]">
                One fleet,<br />
                <em className="text-obsidian-500" style={{ fontStyle: 'italic' }}>every distance.</em>
              </h2>
            </div>

            {/* Odometer */}
            <div className="text-right shrink-0 hidden sm:block">
              <div className="eyebrow text-[9px] text-obsidian-600 mb-3">Distance</div>
              <div className="font-display text-bone text-5xl md:text-6xl tracking-tighter tabular-nums leading-none">
                <span ref={kmRef}>0</span>
                <span className="text-obsidian-500 text-xl font-body font-light ml-2">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Leg detail, bottom-left ────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14 pointer-events-none">
          <div className="shell flex items-end justify-between gap-8">
            <div className="relative h-[86px] flex-1">
              {LEGS.map((leg, i) => (
                <div
                  key={leg.place}
                  data-meta
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div className="eyebrow text-[9px] text-brass mb-3">{leg.label}</div>
                  <div className="font-display text-bone text-2xl tracking-tighter mb-1.5">
                    {leg.vehicle}
                  </div>
                  <div className="text-obsidian-500 text-[13px] font-light">
                    {leg.place} · {leg.region}
                  </div>
                </div>
              ))}
            </div>

            <div className="pointer-events-auto shrink-0">
              <Magnetic strength={0.3}>
                <Link to="/booking" className="btn-gold">
                  Plan a Route <ArrowUpRight size={13} />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Route progress */}
          <div className="shell mt-8">
            <div className="relative h-px bg-hairline">
              <div
                ref={progressRef}
                className="absolute inset-0 bg-brass origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
              <div className="absolute inset-x-0 -top-2 flex justify-between">
                {LEGS.map((leg) => (
                  <span
                    key={leg.place}
                    className="w-1 h-[18px] bg-hairline"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              {LEGS.map((leg) => (
                <span key={leg.place} className="eyebrow text-[9px] text-obsidian-600">
                  {leg.place}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
