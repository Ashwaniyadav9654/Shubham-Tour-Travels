import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { cn, whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/utils'

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
  { label: 'Luxury Group Tours', href: '/tours' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  return (
    <>
      {/* Top bar */}
      <div className="bg-obsidian-950 text-obsidian-300 text-xs py-2 px-4 hidden md:flex justify-between items-center">
        <span className="tracking-wider">LUXURY TEMPO TRAVELLER RENTAL · DELHI NCR · GURGAON · NOIDA</span>
        <div className="flex items-center gap-6">
          <a href={PHONE_HREF} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
            <Phone size={11} />
            {PHONE_NUMBER}
          </a>
          <a
            href={whatsappLink('Hello! I need help booking a luxury vehicle.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-obsidian-950/98 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-gold-500/10'
            : 'bg-obsidian-950'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Shubham Tour & Travels"
              className="w-12 h-12 object-contain"
            />
            <div className="leading-tight">
              <div className="text-white font-display text-base font-semibold tracking-wide">
                Shubham Tour
              </div>
              <div className="text-gold-400 font-body text-[10px] tracking-[0.2em] uppercase">
                & Travels · Est. 2012
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
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
                    'flex items-center gap-1 px-4 py-2 text-sm font-body font-medium transition-colors duration-200',
                    location.pathname === link.href
                      ? 'text-gold-400'
                      : 'text-obsidian-200 hover:text-white'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown size={13} className={cn('transition-transform', activeDropdown === link.label && 'rotate-180')} />}
                </Link>

                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-obsidian-950 border border-gold-500/15 shadow-2xl py-1"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-5 py-2.5 text-sm text-obsidian-300 hover:text-gold-400 hover:bg-obsidian-900/50 transition-colors font-body"
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
          <div className="hidden lg:flex items-center gap-3">
            <a href={PHONE_HREF} className="flex items-center gap-2 text-sm text-obsidian-300 hover:text-gold-400 transition-colors">
              <Phone size={13} />
              {PHONE_NUMBER}
            </a>
            <Link to="/booking" className="btn-gold text-xs py-2.5 px-6">
              Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-obsidian-800"
            >
              <div className="bg-obsidian-950 px-6 py-6 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      to={link.href}
                      className="block py-3 text-obsidian-200 hover:text-gold-400 transition-colors font-body text-sm border-b border-obsidian-900"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 mt-1 mb-2 space-y-1">
                        {link.children.map((child) => (
                          <Link key={child.label} to={child.href} className="block py-1.5 text-obsidian-400 hover:text-gold-400 text-xs transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <a href={PHONE_HREF} className="flex items-center justify-center gap-2 py-3 text-sm text-obsidian-300 border border-obsidian-700 hover:text-gold-400 transition-colors">
                    <Phone size={14} /> {PHONE_NUMBER}
                  </a>
                  <Link to="/booking" className="btn-gold text-center text-xs py-3">Book Now</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
