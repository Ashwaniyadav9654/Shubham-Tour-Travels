import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Calendar, Users, ChevronDown, Star, Shield, Clock } from 'lucide-react'
import { whatsappBookingLink } from '@/lib/utils'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&q=90',
    label: 'PREMIUM FLEET',
    title: ['Luxury That', 'Moves With', 'Purpose.'],
    accent: 'Moves With',
  },
  {
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=90',
    label: 'CORPORATE TRAVEL',
    title: ['Where Every', 'Mile Becomes', 'Memorable.'],
    accent: 'Mile Becomes',
  },
  {
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=90',
    label: 'WEDDING & EVENTS',
    title: ['Arrive in', 'Absolute', 'Elegance.'],
    accent: 'Absolute',
  },
]

const badges = [
  { icon: Star, label: '4.9\u2605 Rating', sub: '2000+ Reviews' },
  { icon: Shield, label: 'Verified Safe', sub: 'GPS Tracked' },
  { icon: Clock, label: '24/7 Service', sub: 'Always On Call' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }),
}

export default function HeroSection() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 600)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const handleWhatsApp = () => {
    const msg = `Hi! I want to book a luxury vehicle.\n\nFrom: ${from || 'Not specified'}\nTo: ${to || 'Not specified'}\nDate: ${date || 'Not specified'}\nPassengers: ${passengers || 'Not specified'}`
    window.open(whatsappBookingLink('Luxury Vehicle', msg), '_blank')
  }

  const slide = slides[currentSlide]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#040406]"
    >
      {/* Cinematic Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: parallaxY }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.08 : 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={slide.image}
              alt="background"
              className="w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.32) saturate(0.7)' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040406]/95 via-[#040406]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040406] via-transparent to-[#040406]/30" />
        {/* Gold radial glow */}
        <div
          className="absolute bottom-0 left-0 w-[60vw] h-[50vh]"
          style={{
            background: 'radial-gradient(ellipse at 20% 100%, rgba(201,146,42,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-[40vw] h-[40vh]"
          style={{
            background: 'radial-gradient(ellipse at 80% 0%, rgba(201,146,42,0.06) 0%, transparent 60%)',
          }}
        />
      </motion.div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9922a]/20 to-transparent" style={{ left: '6%' }} />
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" style={{ left: 'calc(6% + 2px)' }} />
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9922a]/25 to-transparent" style={{ bottom: '22%' }} />
        <svg className="absolute" style={{ top: '88px', left: 'calc(6% - 16px)' }} width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 0 L16 8 M0 16 L8 16" stroke="#c9922a" strokeWidth="0.8" strokeOpacity="0.5"/>
          <circle cx="16" cy="16" r="2" fill="#c9922a" fillOpacity="0.4"/>
        </svg>
      </div>

      {/* Slide Counter */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="block transition-all duration-500 rounded-full"
            style={{
              width: '3px',
              height: i === currentSlide ? '40px' : '12px',
              background: i === currentSlide ? '#c9922a' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

          {/* Left: Hero Copy */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-10" style={{ background: '#c9922a' }} />
                <span className="text-[10px] tracking-[0.35em] uppercase font-medium font-mono" style={{ color: '#c9922a' }}>
                  {slide.label}
                </span>
                <div className="h-px w-10" style={{ background: 'rgba(201,146,42,0.3)' }} />
              </motion.div>
            </AnimatePresence>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-white leading-none mb-8"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.0,
                  }}
                >
                  {slide.title.map((line, i) => (
                    <span key={i} className="block">
                      {line === slide.accent
                        ? <span style={{
                            background: 'linear-gradient(135deg, #c9922a 0%, #e9c565 40%, #f5d78e 60%, #c9922a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}>{line}</span>
                        : line
                      }
                    </span>
                  ))}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-base md:text-lg leading-relaxed mb-10 max-w-md font-light"
              style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.01em' }}
            >
              Maharaja Tempo Traveller, 40-Seater AC Bus &amp; premium cabs across Gurgaon, Delhi &amp; NCR. Corporate. Weddings. Tours. Airport.
            </motion.p>

            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <Link to="/booking">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 text-xs font-semibold tracking-widest uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #c9922a, #e9c565, #c9922a)',
                    backgroundSize: '200% auto',
                    color: '#040406',
                    transition: 'all 0.4s ease',
                  }}
                >
                  Book Now <ArrowRight size={14} />
                </button>
              </Link>
              <Link to="/fleet">
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 text-xs font-medium tracking-widest uppercase"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
                >
                  Explore Fleet <ArrowRight size={14} style={{ opacity: 0.5 }} />
                </button>
              </Link>
            </motion.div>

            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap gap-6"
            >
              {badges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.25)' }}>
                    <Icon size={14} style={{ color: '#c9922a' }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium leading-none mb-0.5" style={{ color: 'white' }}>{label}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Booking Panel (desktop) */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="hidden lg:block"
          >
            <div
              className="relative p-8 xl:p-10"
              style={{
                background: 'rgba(4,4,6,0.75)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(201,146,42,0.18)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,146,42,0.12)',
              }}
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c9922a]/50 to-transparent" />

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#c9922a', letterSpacing: '0.3em' }}>Quick Inquiry</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Get an instant quote via WhatsApp</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,146,42,0.1)', border: '1px solid rgba(201,146,42,0.2)' }}>
                  <span style={{ color: '#c9922a', fontSize: '18px' }}>✦</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>From</label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                    <input type="text" placeholder="Departure city or area" className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} value={from} onChange={(e) => setFrom(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>To</label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                    <input type="text" placeholder="Destination" className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} value={to} onChange={(e) => setTo(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>Date</label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                      <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', colorScheme: 'dark' }} value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>Passengers</label>
                    <div className="relative">
                      <Users size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                      <select className="w-full border-0 border-b pb-2 pl-5 text-sm focus:outline-none transition-colors appearance-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', background: 'transparent' }} value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                        <option value="" className="bg-[#0a0a0a]">Select</option>
                        <option value="1-4" className="bg-[#0a0a0a]">1–4 (Sedan / SUV)</option>
                        <option value="5-9" className="bg-[#0a0a0a]">5–9 (Innova)</option>
                        <option value="10-17" className="bg-[#0a0a0a]">10–17 (Tempo)</option>
                        <option value="18-26" className="bg-[#0a0a0a]">18–26 (Large)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full py-4 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #c9922a 0%, #e9c565 50%, #c9922a 100%)',
                  backgroundSize: '200% auto',
                  color: '#040406',
                  boxShadow: '0 8px 30px rgba(201,146,42,0.3)',
                  transition: 'all 0.4s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Get Instant Quote
              </button>
              <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>No spam &middot; Reply within 2 minutes</p>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c9922a]/20 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Mobile booking panel */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:hidden mt-4">
          <div className="relative p-6" style={{ background: 'rgba(4,4,6,0.80)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,146,42,0.15)' }}>
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#c9922a', letterSpacing: '0.3em' }}>Quick Inquiry</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative col-span-2">
                <MapPin size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                <input type="text" placeholder="From (City / Area)" className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div className="relative col-span-2">
                <MapPin size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                <input type="text" placeholder="To (Destination)" className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
              <div className="relative">
                <Calendar size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-0 border-b pb-2 pl-5 text-sm focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', colorScheme: 'dark' }} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="relative">
                <Users size={13} className="absolute left-0" style={{ top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,146,42,0.6)' }} />
                <select className="w-full border-0 border-b pb-2 pl-5 text-sm focus:outline-none appearance-none" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', background: 'transparent' }} value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                  <option value="" className="bg-[#0a0a0a]">Passengers</option>
                  <option value="1-4" className="bg-[#0a0a0a]">1–4</option>
                  <option value="5-9" className="bg-[#0a0a0a]">5–9</option>
                  <option value="10-17" className="bg-[#0a0a0a]">10–17</option>
                  <option value="18-26" className="bg-[#0a0a0a]">18–26</option>
                </select>
              </div>
            </div>
            <button onClick={handleWhatsApp} className="w-full py-3.5 text-xs font-semibold tracking-widest uppercase" style={{ background: 'linear-gradient(135deg, #c9922a, #e9c565)', color: '#040406' }}>
              Get Instant Quote on WhatsApp
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Info Bar */}
      <div className="relative z-10 border-t" style={{ borderColor: 'rgba(201,146,42,0.12)', background: 'rgba(4,4,6,0.6)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Serving Delhi NCR &middot; Gurgaon &middot; Noida &middot; Faridabad</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Available Now</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute z-20 flex flex-col items-center gap-1.5"
        style={{ bottom: '80px', left: 'calc(6% - 6px)' }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <ChevronDown size={14} style={{ color: 'rgba(201,146,42,0.5)' }} />
      </motion.div>
    </section>
  )
}
