import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Clock, Users } from 'lucide-react'
import { stats } from '@/data'
import CTASection from '@/components/sections/CTASection'

const values = [
  { icon: Shield, title: 'Safety First', desc: 'Every vehicle is GPS tracked, regularly serviced, and driven by background-verified chauffeurs.' },
  { icon: Award, title: 'Uncompromising Quality', desc: 'We maintain our fleet to the highest standards. Clean interiors, reliable vehicles, professional drivers.' },
  { icon: Clock, title: 'Punctuality Guaranteed', desc: 'We understand your time is precious. We are always on time — or we make it right.' },
  { icon: Users, title: 'Customer First', desc: 'Your comfort and satisfaction are our only metrics. We go above and beyond, every single journey.' },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-gold-500" />
                <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Our Story</span>
              </div>
              <h1 className="font-display text-white text-5xl md:text-6xl mb-6 leading-tight">
                12 Years of<br />
                <em className="text-gold-gradient not-italic">Premium Travel</em>
              </h1>
              <p className="text-obsidian-300 text-lg leading-relaxed mb-6">
                Founded in 2012 in Gurgaon, Shubham Tour & Travels was born from a simple belief: travel should feel as extraordinary as the destination itself.
              </p>
              <p className="text-obsidian-400 leading-relaxed mb-6">
                What began as a small fleet of Innova Crystas serving corporate clients has grown into one of Delhi NCR's most trusted luxury travel companies — with Maharaja Travellers, luxury Tempo Travellers, and a comprehensive fleet serving thousands of journeys every month.
              </p>
              <p className="text-obsidian-400 leading-relaxed">
                Today, we serve individual families, Fortune 500 companies, destination weddings, and pilgrimage groups — all with the same obsession: making every journey feel premium.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src="/images/Safety.jpg"
                  alt="Our Team"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold-500 p-6 hidden md:block">
                <div className="font-display text-obsidian-950 text-4xl font-bold">12+</div>
                <div className="text-obsidian-800 text-xs tracking-widest uppercase">Years of Trust</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-obsidian-900 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gold-500/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="py-12 text-center"
              >
                <div className="font-display text-gold-400 text-4xl mb-1">{stat.value}</div>
                <div className="text-obsidian-500 text-xs tracking-widest uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Our Values</span>
              <div className="h-px w-10 bg-gold-500" />
            </div>
            <h2 className="font-display text-obsidian-950 text-4xl">What Drives Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-obsidian-100 p-8"
              >
                <val.icon size={28} className="text-gold-500 mb-5" />
                <h3 className="font-display text-obsidian-950 text-lg mb-3">{val.title}</h3>
                <p className="text-obsidian-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
