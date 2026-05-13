import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Check, Building2, Users, Receipt, Clock, Plane, Heart, Car, MapPin, FileText, Headphones } from 'lucide-react'
import { whatsappBookingLink, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'
import CTASection from '@/components/sections/CTASection'

const benefits = [
  'Dedicated account manager',
  'Monthly consolidated billing',
  'GST invoicing & expense reports',
  'Priority fleet allocation',
  'Employee transport solutions',
  'Client pickup & drop service',
  'Conference & event transportation',
  'Outstation corporate travel',
  'Executive sedan fleet',
  'Driver on-call monthly plans',
]

const serviceCards = [
  {
    icon: Users,
    title: 'Employee Transportation',
    desc: 'Reliable daily pickup and drop for your team. Scheduled routes, on-time performance, and comfortable vehicles for every shift.',
  },
  {
    icon: MapPin,
    title: 'Corporate Group Tours',
    desc: 'Team outings, offsites, and retreats — our Maharaja Tempo Traveller handles groups in premium comfort.',
  },
  {
    icon: Plane,
    title: 'Airport Transfers',
    desc: 'Punctual, professional airport pickups and drops. Flight tracking, name-board service, and zero waiting time.',
  },
  {
    icon: Briefcase,
    title: 'Event Transportation',
    desc: 'Conferences, seminars, product launches — we coordinate multi-vehicle fleets for seamless event logistics.',
  },
  {
    icon: Heart,
    title: 'Wedding Guest Transportation',
    desc: 'Manage guest convoys, baraat fleets, and multi-venue movement with precision and elegance.',
  },
  {
    icon: Car,
    title: 'Outstation Corporate Travel',
    desc: 'Client visits, site inspections, or multi-city tours — our outstation service covers all of India from Delhi NCR.',
  },
]

export default function CorporatePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-obsidian-950 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "url('/images/crysta.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Briefcase size={36} className="text-gold-500 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Corporate Solutions</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4 max-w-2xl">
              Premium Corporate<br />Travel Management
            </h1>
            <p className="text-obsidian-400 max-w-xl text-lg mb-8">
              Trusted by 200+ companies in Delhi NCR. Dedicated fleets, transparent GST billing, and enterprise-grade reliability for your business travel needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={whatsappBookingLink('Corporate Services')} target="_blank" rel="noopener noreferrer"
                className="btn-gold text-xs">Get Corporate Quote</a>
              <a href={PHONE_HREF} className="btn-luxury text-xs">Talk to Sales: {PHONE_NUMBER}</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-5 bg-obsidian-900 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-6">
          <Building2 size={14} className="text-gold-600 shrink-0" />
          <p className="text-obsidian-400 text-xs tracking-widest uppercase">Trusted by 200+ companies across Delhi NCR · Gurgaon · Noida · Faridabad</p>
          <div className="ml-auto flex items-center gap-2 text-xs text-gold-600">
            <FileText size={12} />
            GST Billing Available
          </div>
          <div className="flex items-center gap-2 text-xs text-gold-600">
            <Headphones size={12} />
            Dedicated Travel Support
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Our Services</span>
            </div>
            <h2 className="font-display text-obsidian-950 text-4xl md:text-5xl">Corporate Travel Solutions</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {serviceCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-obsidian-100 hover:border-gold-300 p-8 transition-all hover-lift group"
              >
                <div className="w-12 h-12 border border-gold-500/30 group-hover:border-gold-500 flex items-center justify-center mb-5 transition-colors">
                  <card.icon size={20} className="text-gold-500" />
                </div>
                <h3 className="font-display text-obsidian-950 text-xl mb-3">{card.title}</h3>
                <p className="text-obsidian-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Benefits + Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="font-display text-obsidian-950 text-2xl mb-6">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <Check size={14} className="text-gold-500 shrink-0" />
                    <span className="text-obsidian-600 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-1 gap-5">
                {[
                  { icon: Users, title: 'Employee Transport', desc: 'Daily pickup & drop for your team — scheduled, reliable, comfortable.' },
                  { icon: Receipt, title: 'GST-Compliant Billing', desc: 'Monthly invoices, GST-compliant, with per-trip breakdowns for your accounts team. Perfect for business expense management.' },
                  { icon: Headphones, title: 'Dedicated Travel Support', desc: 'Your own travel desk — a dedicated point of contact for all bookings, changes, and escalations.' },
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
