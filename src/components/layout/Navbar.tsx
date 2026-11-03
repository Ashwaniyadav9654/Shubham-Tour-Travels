import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ChevronDown, Menu, X } from 'lucide-react'
import { cn, whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/utils'
import { getLenis } from '@/components/animations/SmoothScroll'
import { btn, WhatsAppIcon } from '@/components/site/ui'

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

const navLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/tours' },
  { label: 'Group Trips', href: '/tours#group-departures' },
  {
    label: 'Fleet',
    href: '/fleet',
    children: [
      { label: 'Maharaja Tempo Traveller', href: '/fleet/maharaja-12-tempo' },
      { label: '40 Seater AC Bus', href: '/fleet/ac-bus-40' },
      { label: 'Innova Hycross', href: '/fleet/innova-hycross' },
      { label: 'Innova Crysta', href: '/fleet/innova-crysta' },
      { label: 'All vehicles', href: '/fleet' },
    ],
  },
  {
    label: 'Services',
    href: '/airport-transfer',
    children: [
      { label: 'Airport Transfers', href: '/airport-transfer' },
      { label: 'Corporate Travel', href: '/corporate' },
      { label: 'Wedding Transport', href: '/wedding' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [location.pathname, location.hash])

  // Lock the page behind the open menu; always unlock on close/unmount
  useEffect(() => {
    if (!mobileOpen) return
    const lenis = getLenis()
    lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
      lenis?.start()
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Close the menu if the window grows to desktop width while it is open
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setMobileOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const waHref = whatsappLink('Hello! I would like to plan a trip with Shubham Tour & Travels.')

  return (
    <>
    <nav
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-line bg-white/90 backdrop-blur-xl' : 'border-transparent bg-mist'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/images/logo-128.webp" width={44} height={44} alt="Shubham Tour & Travels" className="h-10 w-10 object-contain" />
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold text-navy">Shubham</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-soft">
              Tour &amp; Travels
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenMenu(link.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <NavLink
                to={link.href}
                end
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors',
                    isActive && !link.href.includes('#') ? 'text-sea font-semibold' : 'text-navy-soft hover:text-navy'
                  )
                }
              >
                {link.label}
                {link.children && <ChevronDown size={14} className="opacity-60" />}
              </NavLink>

              <AnimatePresence>
                {link.children && openMenu === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full w-60 pt-2"
                  >
                    <div className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-navy/10">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block rounded-xl px-4 py-2.5 text-sm text-navy-soft hover:bg-mist hover:text-sea"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={btn.ghost}>
            <WhatsAppIcon size={15} /> WhatsApp
          </a>
          <a href={PHONE_HREF} className={btn.ghost} title={PHONE_NUMBER}>
            <Phone size={15} /> Call
          </a>
          <Link to="/booking" className={cn(btn.primary, 'ml-1 px-5 py-2.5')}>
            Get Quote
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

    </nav>
      {mounted &&
        createPortal(
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            // Fixed panel under the bar: always on screen, scrolls on its own.
            className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
          >
            <div className="flex shrink-0 items-center justify-between gap-6 border-b border-line px-5 py-3.5 sm:px-8">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <img src="/images/logo-128.webp" width={44} height={44} alt="Shubham Tour & Travels" className="h-10 w-10 object-contain" />
                <span className="font-display text-lg font-semibold text-navy">Shubham</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-3">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-line py-1">
                  <Link to={link.href} onClick={() => setMobileOpen(false)} className="block py-3 font-display text-xl font-semibold text-navy">
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pb-3">
                      {link.children.map((child) => (
                        <Link key={child.label} to={child.href} onClick={() => setMobileOpen(false)} className="text-sm text-navy-muted hover:text-sea">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 grid gap-3">
                <Link to="/booking" onClick={() => setMobileOpen(false)} className={btn.primary}>
                  Get Quote
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className={btn.outline}>
                    <WhatsAppIcon size={15} /> WhatsApp
                  </a>
                  <a href={PHONE_HREF} className={btn.outline}>
                    <Phone size={15} /> Call
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </>

  )
}
