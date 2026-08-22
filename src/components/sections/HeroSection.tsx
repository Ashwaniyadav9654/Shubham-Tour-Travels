import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { whatsappBookingLink } from '@/lib/utils'
import { ratingSummary } from '@/data'
import { Star } from 'lucide-react'
import Magnetic from '@/components/animations/Magnetic'
import {
  useHeadingReveal,
  playHeadingExit,
  useLoadStagger,
  useParallax,
} from '@/hooks/useGsapAnimations'

const slides = [
  {
    image: '/images/cars/maharaja-exterior.jpg',
    objectPosition: 'center 42%',
    label: 'Premium Fleet',
    title: ['Luxury That', 'Moves With', 'Purpose.'],
    accent: 'Moves With',
  },
  {
    image: '/images/cars/maharaja-interior.jpg',
    objectPosition: 'center 55%',
    label: 'Corporate Travel',
    title: ['Where Every', 'Mile Becomes', 'Memorable.'],
    accent: 'Mile Becomes',
  },
  {
    image: '/images/cars/ac-bus-40.jpg',
    objectPosition: 'center 46%',
    label: 'Wedding & Events',
    title: ['Arrive in', 'Absolute', 'Elegance.'],
    accent: 'Absolute',
  },
]

export default function HeroSection() {
  /* ── Form state — unchanged bindings ────────────────────────────── */
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('')

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useParallax(bgRef, { trigger: containerRef, amount: 22 })
  useHeadingReveal(headingRef, currentSlide, { delay: 0.2 })
  useLoadStagger(copyRef, 0.75)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 600)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isTransitioning) playHeadingExit(headingRef.current)
  }, [isTransitioning])

  const handleWhatsApp = () => {
    const msg = `Hi! I want to book a luxury vehicle.\n\nFrom: ${from || 'Not specified'}\nTo: ${to || 'Not specified'}\nDate: ${date || 'Not specified'}\nPassengers: ${passengers || 'Not specified'}`
    window.open(whatsappBookingLink('Luxury Vehicle', msg), '_blank')
  }

  const slide = slides[currentSlide]
  const today = new Date().toISOString().split('T')[0]

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col bg-ink overflow-hidden"
    >
      {/* ── Background media — parallax, heavily veiled ──────────── */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{
                objectPosition: slide.objectPosition,
                filter: 'brightness(0.46) contrast(1.12) saturate(1.15)',
              }}
            />
          </motion.div>
        </AnimatePresence>
        {/* Flat veil, not a gradient */}
        <div className="absolute inset-0 bg-ink/58" />
      </div>

      {/* ── Vertical rule + slide index ──────────────────────────── */}
      <div className="absolute inset-y-0 left-[var(--gutter)] w-px bg-hairline z-10 hidden md:block" />

      <div className="absolute right-[var(--gutter)] top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-5">
        {slides.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setCurrentSlide(i)}
            className="group flex items-center gap-4"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`eyebrow text-[10px] transition-colors duration-500 ${
                i === currentSlide ? 'text-bone' : 'text-obsidian-600 group-hover:text-obsidian-400'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="block h-[2px] transition-all duration-700 origin-right"
              style={{
                width: i === currentSlide ? 48 : 16,
                background: i === currentSlide
                  ? 'rgb(var(--brass))'
                  : 'rgb(var(--hairline))',
                transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)',
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center shell pt-20 pb-8">

        {/* Eyebrow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${currentSlide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-5 mb-8 md:mb-10"
          >
            <span className="eyebrow text-brass">{slide.label}</span>
            <span className="h-px w-16 bg-hairline" />
            {/* Customer rating, stated up front */}
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star
                    key={n}
                    size={11}
                    className="text-brass"
                    fill={n < Math.round(ratingSummary.score) ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                ))}
              </span>
              <span className="eyebrow text-obsidian-400">
                {ratingSummary.score} · {ratingSummary.travellers} Travellers
              </span>
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Oversized masked headline */}
        <h1 ref={headingRef} className="display-xl text-bone mb-10 md:mb-14">
          {slide.title.map((line, i) => (
            <span key={`${currentSlide}-${i}`} className="line-mask">
              <span data-line className="block">
                {line === slide.accent
                  ? <em className="text-brass" style={{ fontStyle: 'italic' }}>{line}</em>
                  : line}
              </span>
            </span>
          ))}
        </h1>

        {/* Asymmetric lower row */}
        <div ref={copyRef} className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 items-end">
          <p data-load className="lg:col-span-5 lede text-obsidian-300">
            Maharaja Tempo Traveller, 40-seater AC coaches and executive sedans across
            Gurgaon, Delhi &amp; NCR. Corporate, weddings, tours, airport.
          </p>

          <div data-load className="lg:col-span-4 lg:col-start-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.34}>
              <Link to="/booking" className="btn-gold">
                Book Now <ArrowRight size={13} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.28}>
              <Link to="/fleet" className="btn-luxury on-dark">
                Explore Fleet <ArrowUpRight size={13} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          QUICK INQUIRY — desktop rail
          Every input keeps its original type / value / onChange
          binding; only the surrounding markup and styling changed.
          ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-hairline bg-ink/70 backdrop-blur-xl hidden lg:block">
        <div className="shell">
          <div className="grid grid-cols-12 items-end gap-8 py-7">
            <div className="col-span-1">
              <span className="eyebrow text-[9px] text-obsidian-600 block leading-relaxed">
                Quick<br />Inquiry
              </span>
            </div>

            <div className="col-span-2">
              <label className="eyebrow text-[9px] text-obsidian-600 block mb-3">From</label>
              <input
                type="text"
                placeholder="Departure city"
                className="input-dark pb-2 text-[15px]"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="eyebrow text-[9px] text-obsidian-600 block mb-3">To</label>
              <input
                type="text"
                placeholder="Destination"
                className="input-dark pb-2 text-[15px]"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="eyebrow text-[9px] text-obsidian-600 block mb-3">Date</label>
              <input
                type="date"
                min={today}
                className="input-dark pb-2 text-[15px]"
                style={{ colorScheme: 'dark' }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="eyebrow text-[9px] text-obsidian-600 block mb-3">Passengers</label>
              <select
                className="input-dark pb-2 text-[15px] appearance-none cursor-pointer"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                <option value="" className="bg-carbon">Select</option>
                <option value="1-4" className="bg-carbon">1–4 (Sedan / SUV)</option>
                <option value="5-9" className="bg-carbon">5–9 (Innova)</option>
                <option value="10-17" className="bg-carbon">10–17 (Tempo)</option>
                <option value="18-26" className="bg-carbon">18–26 (Large)</option>
              </select>
            </div>

            <div className="col-span-3 flex justify-end">
              <Magnetic strength={0.25}>
                <button
                  onClick={handleWhatsApp}
                  className="btn-gold whitespace-nowrap"
                >
                  Get Instant Quote <ArrowRight size={13} />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Inquiry — mobile stack ─────────────────────────── */}
      <div className="relative z-10 border-t border-hairline bg-ink/80 backdrop-blur-xl lg:hidden">
        <div className="shell py-8">
          <span className="eyebrow text-[10px] text-brass block mb-6">Quick Inquiry</span>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 mb-7">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="From (City / Area)"
                className="input-dark pb-2"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="To (Destination)"
                className="input-dark pb-2"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div>
              <input
                type="date"
                min={today}
                className="input-dark pb-2"
                style={{ colorScheme: 'dark' }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <select
                className="input-dark pb-2 appearance-none cursor-pointer"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                <option value="" className="bg-carbon">Passengers</option>
                <option value="1-4" className="bg-carbon">1–4</option>
                <option value="5-9" className="bg-carbon">5–9</option>
                <option value="10-17" className="bg-carbon">10–17</option>
                <option value="18-26" className="bg-carbon">18–26</option>
              </select>
            </div>
          </div>

          <button onClick={handleWhatsApp} className="btn-gold w-full">
            Get Instant Quote
          </button>
        </div>
      </div>
    </section>
  )
}
