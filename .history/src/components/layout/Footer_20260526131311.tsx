import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF, EMAIL } from '@/lib/utils'

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

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 text-obsidian-300 border-t border-obsidian-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-4 mb-6">
              <img src="/images/logo.png" alt="Shubham Tour & Travels logo" className="w-12 h-12 rounded-full object-cover shadow-lg shadow-black/20" />
              <div>
                <div className="text-white font-display font-semibold">Shubham Tour & Travels</div>
                <div className="text-gold-600 text-[10px] tracking-widest uppercase">Est. 2012 · Gurgaon</div>
              </div>
            </Link>
            <p className="text-obsidian-400 text-sm leading-relaxed max-w-xs mb-6">
              Delhi NCR's premier Maharaja Tempo Traveller & AC Bus rental service. Group travel, corporate tours, weddings & outstation trips — driven by professionalism.
            </p>
            <div className="space-y-3 text-sm">
              <a href={PHONE_HREF} className="flex items-center gap-3 text-obsidian-400 hover:text-gold-400 transition-colors">
                <Phone size={14} className="text-gold-600 shrink-0" />
                {PHONE_NUMBER}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-obsidian-400 hover:text-gold-400 transition-colors">
                <Mail size={14} className="text-gold-600 shrink-0" />
                {EMAIL}
              </a>
              <a href="https://shubhamtourtravels.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-obsidian-400 hover:text-gold-400 transition-colors">
                <img src="/images/logo.png" alt="Website logo" className="w-5 h-5 rounded-full object-cover shrink-0" />
                shubhamtourtravels.in
              </a>
              <div className="flex items-start gap-3 text-obsidian-400">
                <MapPin size={14} className="text-gold-600 shrink-0 mt-0.5" />
                5, Ashok Vihar Phase 3 Extn, Gurugram – 122001
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-obsidian-500 hover:text-gold-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-obsidian-500 hover:text-gold-400 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-obsidian-500 hover:text-gold-400 transition-colors">
                <Youtube size={18} />
              </a>
              <a
                href={whatsappLink('Hello Shubham Tour & Travels!')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-obsidian-500 hover:text-green-400 transition-colors text-xs tracking-wider"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-5 font-medium">Our Fleet</h4>
            <ul className="space-y-3">
              {footerLinks.fleet.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-5 font-medium">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-5 font-medium">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-obsidian-400 hover:text-gold-400 transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-obsidian-900">
              <Link to="/booking" className="btn-gold text-xs py-2.5 px-5 w-full text-center block">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing highlight bar */}
      <div className="border-t border-gold-500/10 bg-obsidian-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 text-xs text-obsidian-500 tracking-wider">
          <span className="text-gold-600">✦ ₹30/km Outstation</span>
          <span>·</span>
          <span className="text-gold-600">✦ ₹28/km Local NCR</span>
          <span>·</span>
          <span>Min. 250 km/day for Outstation</span>
          <span>·</span>
          <span>GST Billing Available</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-obsidian-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-obsidian-600 text-xs tracking-wide">
            © {new Date().getFullYear()} Shubham Tour & Travels. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-obsidian-600">
            <span>GST Registered</span>
            <span>·</span>
            <span>24/7 Support</span>
            <span>·</span>
            <span>GPS Tracked Fleet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
