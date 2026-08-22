import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'
import { cn, whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import { getLenis } from '@/components/animations/SmoothScroll'

const navLinks = [
  { label: 'Fleet', href: '/fleet', children: [
    { label: 'Maharaja Traveller', href: '/fleet/maharaja' },
    { label: '40 Seater AC Bus', href: '/fleet' },
    { label: 'Innova Crysta', href: '/fleet/innova' },
    { label: 'All Vehicles', href: '/fleet' },
  ]},
  { label: 'Services', href: '/services', children: [
    { label: 'Airport Transfer', href: '/airport-transfer' },
    { label: 'Corporate Services', href: '/corporate' },
    { label: 'Wedding Transport', href: '/wedding' },
    { label: 'Luxury Group Tours', href: '/tours' },
  ]},
  { label: 'Tours', href: '/tours' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  // Lock Lenis while the full-screen menu is open
  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    if (mobileOpen) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [mobileOpen])

  return (
    <>
      {/* ── Marquee strip ─────────────────────────────────────────── */}
      <div className="bg-ink text-obsidian-400 border-b border-hairline hidden md:block">
        <div className="shell flex items-center justify-between py-2.5">
          <span className="eyebrow text-[10px] text-obsidian-500">
            Delhi NCR · Gurgaon · Noida · Faridabad
          </span>
          <div className="flex items-center gap-8">
            <a href={PHONE_HREF} className="eyebrow text-[10px] hover:text-brass transition-colors flex items-center gap-2">
              <Phone size={10} />
              {PHONE_NUMBER}
            </a>
            <a
              href={whatsappLink('Hello! I need help booking a luxury vehicle.')}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-[10px] hover:text-brass transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main bar ──────────────────────────────────────────────── */}
      <nav
        className={cn(
          'sticky top-0 z-50 transition-[background-color,border-color] duration-500',
          scrolled
            ? 'bg-ink/90 backdrop-blur-2xl border-b border-hairline'
            : 'bg-ink border-b border-transparent'
        )}
      >
        <div className="shell flex items-center justify-between py-5">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <img
              src="/images/logo.png"
              alt="Shubham Tour & Travels"
              className="w-10 h-10 object-contain"
            />
            <div className="leading-none">
              <div className="font-display text-bone text-[17px] tracking-tighter">
                Shubham
              </div>
              <div className="eyebrow text-[9px] text-obsidian-500 mt-1.5">
                Tour &amp; Travels
              </div>
            </div>
          </Link>

          {/* Desktop links — hairline that draws in from the left */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={cn(
                    'group relative block px-4 py-2 text-[13px] font-body transition-colors duration-300',
                    location.pathname === link.href
                      ? 'text-bone'
                      : 'text-obsidian-400 hover:text-bone'
                  )}
                >
                  {link.label}
                  {/* Underline draws in, each link in its own accent */}
                  <span
                    className={cn(
                      'absolute left-4 right-4 bottom-1 h-[2px] origin-left transition-transform duration-500',
                      location.pathname === link.href
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    )}
                    style={{
                      background: 'rgb(var(--brass))',
                      transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)',
                    }}
                  />
                </Link>

                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 w-60 bg-carbon border border-hairline py-2"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-5 py-3 text-[13px] text-obsidian-400 hover:text-bone hover:bg-graphite transition-colors font-body"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <Magnetic strength={0.35}>
              <Link to="/booking" className="btn-gold text-[10px] py-3.5 px-7">
                Book Now
              </Link>
            </Magnetic>
          </div>

          {/* Mobile toggle — two rules that cross */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[7px] text-bone"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span
              className="block w-6 h-px bg-current transition-transform duration-400"
              style={{
                transform: mobileOpen ? 'translateY(4px) rotate(45deg)' : 'none',
                transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)',
              }}
            />
            <span
              className="block w-6 h-px bg-current transition-transform duration-400"
              style={{
                transform: mobileOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
                transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Full-screen mobile menu ───────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="lg:hidden fixed inset-0 z-40 bg-ink pt-28 overflow-y-auto"
            data-lenis-prevent
          >
            <div className="shell pb-16">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-hairline"
                >
                  <Link
                    to={link.href}
                    className="display-md block py-5 text-bone"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pb-5 flex flex-wrap gap-x-6 gap-y-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="text-[13px] text-obsidian-400 hover:text-brass transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 flex flex-col gap-4"
              >
                <Link to="/booking" className="btn-gold w-full">Book Now</Link>
                <a href={PHONE_HREF} className="btn-luxury on-dark w-full">
                  <Phone size={13} /> {PHONE_NUMBER}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
