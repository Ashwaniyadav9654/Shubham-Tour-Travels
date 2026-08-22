import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook, ArrowUpRight } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF, EMAIL } from '@/lib/utils'
import Magnetic from '@/components/animations/Magnetic'
import { useHeadingReveal } from '@/hooks/useGsapAnimations'

const footerLinks = {
  fleet: [
    { label: 'Maharaja Traveller', href: '/fleet/maharaja' },
    { label: '40 Seater AC Bus', href: '/fleet' },
    { label: 'Innova Crysta', href: '/fleet/innova' },
    { label: 'All Vehicles', href: '/fleet' },
  ],
  services: [
    { label: 'Airport Transfer', href: '/airport-transfer' },
    { label: 'Corporate Services', href: '/corporate' },
    { label: 'Wedding Transportation', href: '/wedding' },
    { label: 'Luxury Group Tours', href: '/tours' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
}

const socials = [
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

function LinkColumn({
  title,
  links,
  offset = 0,
}: {
  title: string
  links: { label: string; href: string }[]
  offset?: number
}) {
  return (
    <div>
      <h4 className="eyebrow text-[10px] text-obsidian-600 mb-7">{title}</h4>
      <ul className="space-y-4">
        {links.map((l, i) => {
          return (
            <li key={l.label}>
              <Link
                to={l.href}
                className="group inline-flex items-center gap-1.5 text-obsidian-300 hover:text-bone text-[14px] font-light transition-colors duration-300"
              >
                {l.label}
                <ArrowUpRight
                  size={12}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brass"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Footer() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useHeadingReveal(headingRef, 0, { scroll: true })

  return (
    <footer className="bg-ink text-obsidian-300 border-t border-hairline">

      {/* ── Oversized closing statement ────────────────────────────── */}
      <div className="shell pt-24 md:pt-32 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-8 items-end">
          <h2 ref={headingRef} className="lg:col-span-8 display-lg text-bone">
            <span className="line-mask"><span data-line className="block">Let&rsquo;s plan your</span></span>
            <span className="line-mask">
              <span data-line className="block">
                <em className="text-brass" style={{ fontStyle: 'italic' }}>next journey.</em>
              </span>
            </span>
          </h2>

          <div className="lg:col-span-3 lg:col-start-10 lg:text-right">
            <Magnetic strength={0.32}>
              <Link to="/booking" className="btn-gold">
                Start Booking <ArrowUpRight size={13} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* ── Directory ──────────────────────────────────────────────── */}
      <div className="border-t border-hairline">
        <div className="shell py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-14 gap-x-8">

            {/* Identity */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-flex items-center gap-4 mb-8">
                <img
                  src="/images/logo.png"
                  alt="Shubham Tour & Travels logo"
                  className="w-11 h-11 object-contain"
                />
                <div className="leading-none">
                  <div className="font-display text-bone text-[17px] tracking-tighter">Shubham</div>
                  <div className="eyebrow text-[9px] text-obsidian-600 mt-1.5">Tour &amp; Travels</div>
                </div>
              </Link>

              <p className="text-obsidian-400 text-[14px] leading-relaxed font-light max-w-[34ch] mb-9">
                Delhi NCR&rsquo;s Maharaja Tempo Traveller &amp; AC coach specialists.
                Group travel, corporate accounts, weddings and outstation trips for over 15 years.
              </p>

              <div className="flex items-center gap-5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 border border-hairline flex items-center justify-center text-obsidian-500 hover:text-ink hover:bg-bone hover:border-bone transition-colors duration-400"
                  >
                    <Icon size={15} strokeWidth={1.5} />
                  </a>
                ))}
                <a
                  href={whatsappLink('Hello Shubham Tour & Travels!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-[10px] text-obsidian-500 hover:text-brass transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-6">
              <LinkColumn title="Fleet" links={footerLinks.fleet} offset={0} />
            </div>
            <div className="lg:col-span-2">
              <LinkColumn title="Services" links={footerLinks.services} offset={2} />
            </div>
            <div className="lg:col-span-2">
              <LinkColumn title="Company" links={footerLinks.company} offset={4} />
            </div>

            {/* Contact */}
            <div className="lg:col-span-12 xl:col-span-12 pt-14 border-t border-hairline">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
                <a href={PHONE_HREF} className="group">
                  <div className="eyebrow text-[9px] text-obsidian-600 mb-3">Telephone</div>
                  <div className="flex items-center gap-3 text-bone text-[15px] font-light group-hover:text-brass transition-colors">
                    <Phone size={14} strokeWidth={1.5} className="text-obsidian-600" />
                    {PHONE_NUMBER}
                  </div>
                </a>
                <a href={`mailto:${EMAIL}`} className="group">
                  <div className="eyebrow text-[9px] text-obsidian-600 mb-3">Email</div>
                  <div className="flex items-center gap-3 text-bone text-[15px] font-light group-hover:text-brass transition-colors break-all">
                    <Mail size={14} strokeWidth={1.5} className="text-obsidian-600 shrink-0" />
                    {EMAIL}
                  </div>
                </a>
                <div>
                  <div className="eyebrow text-[9px] text-obsidian-600 mb-3">Studio</div>
                  <div className="flex items-start gap-3 text-obsidian-300 text-[15px] font-light">
                    <MapPin size={14} strokeWidth={1.5} className="text-obsidian-600 shrink-0 mt-1" />
                    5, Ashok Vihar Phase 3 Extn, Gurugram &ndash; 122001
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Colophon ───────────────────────────────────────────────── */}
      <div className="border-t border-hairline">
        <div className="shell py-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="eyebrow text-[9px] text-obsidian-600">
            © {new Date().getFullYear()} Shubham Tour &amp; Travels
          </p>
          <div className="flex items-center gap-7 eyebrow text-[9px] text-obsidian-600">
            <span>GST Registered</span>
            <span>24/7 Support</span>
            <span>GPS Tracked</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
