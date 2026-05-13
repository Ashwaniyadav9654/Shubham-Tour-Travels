import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Star, ArrowRight } from 'lucide-react'
import { tourPackages } from '@/data'
import { formatCurrency, whatsappBookingLink } from '@/lib/utils'

export default function PackagesSection() {
  const featured = tourPackages.filter(p => p.popular).slice(0, 3)

  return (
    <section className="section-pad bg-parchment">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Curated Packages</span>
            </div>
            <h2 className="font-display text-obsidian-950 text-4xl md:text-5xl leading-tight">
              India's Most Beloved<br />Travel Experiences
            </h2>
          </div>
          <Link to="/tours" className="btn-luxury text-xs self-start">
            All Packages <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group bg-white hover-lift border border-obsidian-100 overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden cinematic-overlay">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <Clock size={11} />
                    {pkg.duration}
                    <span className="ml-auto flex items-center gap-1 text-gold-300">
                      <Star size={11} fill="currentColor" />
                      {pkg.rating}
                    </span>
                  </div>
                  <h3 className="font-display text-white text-xl leading-tight">{pkg.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-obsidian-500 text-xs mb-4">{pkg.destination}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {pkg.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="text-[10px] px-2.5 py-1 bg-cream text-obsidian-500 border border-obsidian-100">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-obsidian-100">
                  <div>
                    {pkg.originalPrice && (
                      <div className="text-obsidian-400 text-xs line-through">{formatCurrency(pkg.originalPrice)}</div>
                    )}
                    <div className="text-obsidian-950 font-bold text-xl font-display">
                      {formatCurrency(pkg.price)}
                      <span className="text-obsidian-400 text-xs font-normal font-body ml-1">/ person</span>
                    </div>
                  </div>
                  <a
                    href={whatsappBookingLink(pkg.title, pkg.destination)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-xs py-2.5 px-5"
                  >
                    Enquire
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
