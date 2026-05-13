import React from 'react'
import { motion } from 'framer-motion'
import { Plane, Clock, Shield, Star, Check } from 'lucide-react'
import { whatsappBookingLink } from '@/lib/utils'
import CTASection from '@/components/sections/CTASection'

const airports = [
  { name: 'IGI Airport (T1)', code: 'DEL-T1', city: 'New Delhi' },
  { name: 'IGI Airport (T2)', code: 'DEL-T2', city: 'New Delhi' },
  { name: 'IGI Airport (T3)', code: 'DEL-T3', city: 'New Delhi' },
  { name: 'Hindon Airport', code: 'HDO', city: 'Ghaziabad' },
]

const features = [
  'Flight tracking – we monitor your flight',
  'Name-board pickup at arrivals',
  'Free waiting up to 60 minutes on delays',
  'No meter / surge pricing – fixed rates',
  'Professional uniformed chauffeur',
  'Clean, sanitized vehicles every trip',
  'Available at midnight and dawn',
  'Corporate billing & GST invoices',
]

export default function AirportTransferPage() {
  return (
    <div>
      <section className="relative bg-obsidian-950 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('/images/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Plane size={36} className="text-gold-500 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Airport Transfers</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4 max-w-2xl">
              Arrive & Depart<br />in Pure Comfort
            </h1>
            <p className="text-obsidian-400 max-w-xl text-lg mb-8">
              Delhi NCR's most reliable airport transfer service. We track your flight, wait for you, and ensure a seamless journey every time.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={whatsappBookingLink('Airport Transfer')} target="_blank" rel="noopener noreferrer"
                className="btn-gold text-xs">Book Airport Transfer</a>
              <a href="tel:+919811368167" className="btn-luxury text-xs">Call Now – 24/7</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Airport list */}
      <section className="py-16 bg-obsidian-900 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-obsidian-400 text-xs tracking-widest uppercase mb-6">We Serve All Delhi NCR Airports</p>
          <div className="flex flex-wrap gap-4">
            {airports.map((a) => (
              <div key={a.code} className="flex items-center gap-3 bg-obsidian-800 border border-obsidian-700 px-5 py-3">
                <Plane size={14} className="text-gold-500" />
                <div>
                  <div className="text-white text-sm font-medium">{a.name}</div>
                  <div className="text-obsidian-500 text-xs">{a.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features + Why */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-gold-500" />
                <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Why Choose Us</span>
              </div>
              <h2 className="font-display text-obsidian-950 text-4xl mb-8 leading-tight">
                The Standard for<br />Airport Transfers in NCR
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check size={15} className="text-gold-500 mt-0.5 shrink-0" />
                    <span className="text-obsidian-600 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-1 gap-5">
                {[
                  { icon: Clock, title: '24/7 Availability', desc: 'Early morning departures, late night arrivals — we are always ready.' },
                  { icon: Shield, title: 'Fixed Fare Guarantee', desc: 'The price you see is the price you pay. No surge, no surprises.' },
                  { icon: Star, title: 'Professional Chauffeurs', desc: 'Uniformed, trained, background-verified drivers who know every route.' },
                  { icon: Plane, title: 'Flight Monitoring', desc: 'We track your flight in real-time and adjust pickup timing automatically.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-5 p-6 bg-white border border-obsidian-100">
                    <div className="w-10 h-10 border border-gold-500/30 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-gold-500" />
                    </div>
                    <div>
                      <h3 className="font-display text-obsidian-950 text-base mb-1">{item.title}</h3>
                      <p className="text-obsidian-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
