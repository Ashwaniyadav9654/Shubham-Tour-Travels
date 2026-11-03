import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF, EMAIL } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/site/ui'

const footerLinks: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Packages',
    links: [
      { label: 'All holiday packages', href: '/tours' },
      { label: 'Group departures', href: '/tours#group-departures' },
      { label: 'Kedarnath Yatra', href: '/tours/kedarnath-yatra' },
      { label: 'Shimla & Manali', href: '/tours/manali-luxury' },
      { label: 'Build a custom trip', href: '/booking' },
    ],
  },
  {
    title: 'Fleet & services',
    links: [
      { label: 'Maharaja Tempo Traveller', href: '/fleet/maharaja-12-tempo' },
      { label: 'Innova Hycross', href: '/fleet/innova-hycross' },
      { label: '40 Seater AC Bus', href: '/fleet/ac-bus-40' },
      { label: 'Airport transfers', href: '/airport-transfer' },
      { label: 'Corporate travel', href: '/corporate' },
      { label: 'Wedding transport', href: '/wedding' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white/70">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/images/logo-128.webp" width={44} height={44} alt="Shubham Tour & Travels logo" className="h-11 w-11 object-contain" />
              <span className="leading-none">
                <span className="block font-display text-lg font-semibold text-white">Shubham</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                  Tour &amp; Travels
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              Holiday packages, group tours and luxury Tempo Travellers from Gurgaon and Delhi NCR,
              for over 15 years.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-sea hover:bg-sea hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
              <a
                href={whatsappLink('Hello Shubham Tour & Travels!')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-sea hover:bg-sea hover:text-white transition-colors"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">{col.title}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-10 text-sm md:grid-cols-3">
          <a href={PHONE_HREF} className="flex items-center gap-3 hover:text-white">
            <Phone size={16} className="text-sea" /> {PHONE_NUMBER}
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 break-all hover:text-white">
            <Mail size={16} className="shrink-0 text-sea" /> {EMAIL}
          </a>
          <p className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-sea" /> 5, Ashok Vihar Phase 3 Extn, Gurugram – 122001
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Shubham Tour &amp; Travels. All rights reserved.</p>
          <p>
            GST registered · 24×7 support · GPS-tracked fleet ·{' '}
            <Link to="/photo-credits" className="hover:text-white">Photo credits</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
