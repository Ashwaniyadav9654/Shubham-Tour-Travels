import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bus, Crown, Car, Plane, Briefcase, Heart, ArrowRight } from 'lucide-react'
import { services } from '@/data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Bus, Crown, Car, Plane, Briefcase, Heart,
}

export default function ServicesSection() {
  return (
    <section className="section-pad bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Our Services</span>
          </div>
          <h2 className="font-display text-white text-4xl md:text-5xl leading-tight mb-4">
            Every Journey,<br />Perfectly Curated
          </h2>
          <p className="text-obsidian-400 leading-relaxed">
            From intimate airport transfers to royal wedding convoys — we craft each experience with obsessive attention to detail.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Car
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={service.href}
                  className={cn(
                    'group block p-8 border border-obsidian-800 hover:border-gold-500/40',
                    'bg-obsidian-900/40 hover:bg-obsidian-900/70',
                    'transition-all duration-400 relative overflow-hidden'
                  )}
                >
                  {/* Gold accent top line on hover */}
                  <div className="absolute top-0 left-0 h-px w-0 group-hover:w-full bg-gold-500 transition-all duration-500" />

                  <div className="w-11 h-11 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300">
                    <Icon size={20} className="text-gold-500" />
                  </div>

                  <h3 className="font-display text-white text-xl mb-3 group-hover:text-gold-100 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-obsidian-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-gold-500 text-xs tracking-wider uppercase font-medium">
                    Learn More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
