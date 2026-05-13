import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Check, Star } from 'lucide-react'
import { whatsappBookingLink } from '@/lib/utils'
import CTASection from '@/components/sections/CTASection'

const packages = [
  {
    name: 'Classic',
    desc: 'Elegant & Essential',
    price: '₹25,000',
    vehicles: '2 Innova Crysta + 1 Tempo Traveller',
    features: ['Floral decoration', 'Ribbon & bow setup', 'Chauffeur uniform', '8-hour package', 'Fuel included'],
  },
  {
    name: 'Royal',
    desc: 'Our Signature Package',
    price: '₹55,000',
    popular: true,
    vehicles: '1 Maharaja Traveller + 3 Innova Crysta + 1 Tempo Traveller',
    features: ['Premium floral decoration', 'Red carpet setup', 'Uniformed chauffeurs', '12-hour package', 'Fuel included', 'Coordinator on call', 'Photography escort'],
  },
  {
    name: 'Grand',
    desc: 'No Compromises',
    price: 'Custom',
    vehicles: 'Fully customised fleet',
    features: ['Full wedding convoy', 'Custom decoration theme', 'VIP guest transfers', '24-hour availability', 'Dedicated coordinator', 'Luxury buses available', 'Rehearsal dinner included'],
  },
]

export default function WeddingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-obsidian-950 py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('/images/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Heart size={36} className="text-gold-500 mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Wedding Transportation</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4 max-w-2xl leading-tight">
              Make Your Big Day<br />
              <em className="text-gold-gradient not-italic">Unforgettable</em>
            </h1>
            <p className="text-obsidian-400 max-w-xl text-lg mb-8">
              From Baraat to Bidaai — complete wedding convoy management with decorated vehicles, professional chauffeurs, and flawless coordination.
            </p>
            <a href={whatsappBookingLink('Wedding Transportation')} target="_blank" rel="noopener noreferrer"
              className="btn-gold text-xs">Plan Your Wedding Convoy</a>
          </motion.div>
        </div>
      </section>

      {/* Why us */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Why Couples Trust Us</span>
              <div className="h-px w-10 bg-gold-500" />
            </div>
            <h2 className="font-display text-obsidian-950 text-4xl">Every Detail, Perfected</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {[
              { title: 'Decorated Vehicles', desc: 'Stunning floral and ribbon decorations matching your wedding theme and colour palette.' },
              { title: 'Full Convoy Management', desc: 'We coordinate every vehicle, every timing, so you don\'t have to think about logistics.' },
              { title: 'Baraat Specialists', desc: 'From the first dhol beat to the last toast — our baraat experience is legendary.' },
              { title: 'Guest Shuttles', desc: 'Comfortable Tempo Travellers shuttling guests between venue, hotel, and airport.' },
              { title: 'VIP Guest Transfers', desc: 'Premium Innova Crystas and sedans for your most important guests.' },
              { title: 'Punctuality Guaranteed', desc: 'Weddings run on timing. We are never late — period.' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-obsidian-100 p-7 hover:border-gold-300 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mb-4" />
                <h3 className="font-display text-obsidian-950 text-lg mb-2">{item.title}</h3>
                <p className="text-obsidian-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Packages */}
          <div>
            <h2 className="font-display text-obsidian-950 text-3xl text-center mb-10">Wedding Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.name}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 border ${pkg.popular ? 'border-gold-400 bg-obsidian-950' : 'border-obsidian-200 bg-white'}`}>
                  {pkg.popular && (
                    <div className="bg-gold-500 text-obsidian-950 text-[10px] tracking-widest px-3 py-1 inline-block mb-4 font-semibold">SIGNATURE</div>
                  )}
                  <h3 className={`font-display text-3xl mb-1 ${pkg.popular ? 'text-white' : 'text-obsidian-950'}`}>{pkg.name}</h3>
                  <p className={`text-xs mb-4 ${pkg.popular ? 'text-obsidian-400' : 'text-obsidian-400'}`}>{pkg.desc}</p>
                  <div className={`text-2xl font-display mb-1 ${pkg.popular ? 'text-gold-400' : 'text-obsidian-950'}`}>{pkg.price}</div>
                  <p className={`text-xs mb-5 italic ${pkg.popular ? 'text-obsidian-500' : 'text-obsidian-400'}`}>{pkg.vehicles}</p>
                  <div className="space-y-2.5 mb-7">
                    {pkg.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <Check size={13} className="text-gold-500 shrink-0" />
                        <span className={`text-sm ${pkg.popular ? 'text-obsidian-300' : 'text-obsidian-600'}`}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href={whatsappBookingLink(`Wedding ${pkg.name} Package`)} target="_blank" rel="noopener noreferrer"
                    className={`block text-center text-xs py-3 px-6 tracking-widest uppercase font-medium transition-all ${pkg.popular ? 'btn-gold' : 'btn-luxury'}`}>
                    Enquire Now
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
