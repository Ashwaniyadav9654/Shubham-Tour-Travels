import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Users, ArrowRight } from 'lucide-react'
import { vehicles } from '@/data'
import { cn, formatCurrency, whatsappBookingLink } from '@/lib/utils'

export default function FleetSection() {
  const featured = vehicles.filter(v => v.popular)

  return (
    <section className="section-pad bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-600 text-xs tracking-[0.25em] uppercase">Our Fleet</span>
            </div>
            <h2 className="font-display text-obsidian-950 text-4xl md:text-5xl leading-tight">
              Vehicles Worthy<br />of Every Occasion
            </h2>
          </div>
          <Link to="/fleet" className="btn-luxury self-start md:self-auto text-xs">
            View Full Fleet <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white border border-obsidian-100 hover:border-gold-300 transition-all duration-400 hover-lift overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-obsidian-100">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cars/traveller.webp'
                  }}
                />
                {vehicle.badge && (
                  <div className="absolute top-4 left-4 bg-gold-500 text-obsidian-950 text-[10px] tracking-[0.2em] px-3 py-1 font-semibold">
                    {vehicle.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-obsidian-950 text-lg leading-tight">{vehicle.name}</h3>
                    <p className="text-obsidian-400 text-xs mt-0.5">{vehicle.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gold-500 text-xs font-medium shrink-0 ml-2">
                    <Star size={12} fill="currentColor" />
                    {vehicle.rating}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-obsidian-500 mb-4 pb-4 border-b border-obsidian-100">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {vehicle.seats} seats
                  </span>
                  <span>{vehicle.fuelType}</span>
                  <span>{vehicle.ac ? 'AC' : 'Non-AC'}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {vehicle.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="text-[10px] px-2.5 py-1 bg-obsidian-50 text-obsidian-500 border border-obsidian-100">
                      {a}
                    </span>
                  ))}
                  {vehicle.amenities.length > 3 && (
                    <span className="text-[10px] px-2.5 py-1 bg-obsidian-50 text-obsidian-400 border border-obsidian-100">
                      +{vehicle.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-obsidian-400 text-[10px] uppercase tracking-wider">From</div>
                    <div className="text-obsidian-950 font-semibold text-base">
                      {formatCurrency(vehicle.pricePerKm)}<span className="text-obsidian-400 text-xs font-normal">/km</span>
                    </div>
                  </div>
                  <a
                    href={whatsappBookingLink(vehicle.name, `${vehicle.seats} seats, from ₹${vehicle.pricePerKm}/km`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-xs py-2.5 px-5"
                  >
                    Book Now
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
