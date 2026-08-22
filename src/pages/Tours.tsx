import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Check, Phone, MessageCircle } from 'lucide-react'
import { tourPackages } from '@/data'
import { whatsappBookingLink, whatsappLink, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'

const included = ['Luxury Tempo Traveller', 'Driver & Fuel', 'Comfortable Group Travel']
const extras = ['Toll Tax', 'Parking', 'State Tax']

export default function ToursPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/images/cars/maharaja-exterior.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 shell">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Transport-Focused Packages</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4">
              Luxury Group<br />Tours
            </h1>
            <p className="text-obsidian-400 max-w-xl text-lg">
              All our tours are powered by our signature 12+2 Maharaja Luxury Tempo Traveller. We handle the journey, you enjoy every moment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included Banner */}
      <div className="bg-carbon border-y border-hairline py-7">
        <div className="shell flex flex-wrap items-center gap-x-10 gap-y-5 justify-between">
          <div className="flex flex-wrap gap-6">
            <span className="text-obsidian-400 text-xs tracking-widest uppercase">All Packages Include:</span>
            {included.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-obsidian-200">
                <Check size={12} className="text-gold-500" /> {item}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-obsidian-500">
            <span className="text-obsidian-400">Extras:</span>
            {extras.map(e => <span key={e}>{e} Extra</span>)}
          </div>
        </div>
      </div>

      {/* Tour Cards */}
      <section className="section-pad bg-bone">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch mb-16">
            {tourPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group h-full flex flex-col bg-white border border-obsidian-950/10 hover:border-gold-500/45 transition-paint overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden cinematic-overlay shrink-0">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-950 text-[10px] tracking-[0.2em] px-3 py-1 font-semibold">
                      POPULAR
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                      <Clock size={11} /> {pkg.duration}
                    </div>
                    <h3 className="font-display text-white text-xl leading-tight">{pkg.title}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{pkg.destination}</p>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-7 lg:p-8">
                  <div className="mb-6">
                    <p className="eyebrow text-[9px] text-obsidian-400 mb-3">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 4).map((h) => (
                        <span key={h} className="text-[11px] px-3 py-1.5 bg-bone text-obsidian-500 border border-obsidian-950/8">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-7">
                    <p className="eyebrow text-[9px] text-obsidian-400 mb-3">Includes</p>
                    <div className="space-y-2">
                      {pkg.includes.map((inc) => (
                        <div key={inc} className="flex items-center gap-2.5 text-[13px] text-obsidian-500 font-light">
                          <Check size={11} className="text-gold-500 shrink-0" />
                          {inc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6 border-t border-obsidian-950/10">
                    <div>
                      <div className="eyebrow text-[9px] text-obsidian-400 mb-2">Starting From</div>
                      <div className="font-display text-obsidian-950 text-[1.6rem] tracking-tighter leading-none">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <a
                      href={whatsappBookingLink(pkg.title, `${pkg.destination} · ${pkg.duration}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury text-obsidian-950 text-[10px] py-3 px-6 shrink-0"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-ink border border-hairline p-10 md:p-14 max-w-3xl mx-auto text-center"
          >
            <div className="text-gold-500 text-2xl mb-4">✦</div>
            <h3 className="display-md text-bone mb-5">Customized packages available</h3>
            <p className="text-obsidian-400 text-[15px] leading-relaxed font-light mb-5 max-w-xl mx-auto">
              Don't see your destination? We arrange custom group tours to any location across India. Tell us where you want to go and we'll plan the perfect journey.
            </p>
            <p className="text-obsidian-600 text-xs leading-relaxed mb-10 max-w-xl mx-auto">
              * Only 10% advance to confirm. · Prices may vary during peak season (Dec–Jan, summer holidays, long weekends). · Pricing is for vehicle transport only, with no per-person charges. · Toll, parking, state tax & driver allowance extra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappLink("Hi! I'd like to enquire about a custom group tour package. Please share details.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 text-sm font-medium hover:bg-[#22c55e] transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp for Custom Tour
              </a>
              <a href={PHONE_HREF} className="btn-luxury flex items-center justify-center gap-2 text-xs">
                <Phone size={14} />
                {PHONE_NUMBER}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
