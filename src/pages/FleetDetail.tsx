import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Check } from 'lucide-react'
import { vehicles } from '@/data'
import { formatCurrency, whatsappBookingLink } from '@/lib/utils'
import CTASection from '@/components/sections/CTASection'

export default function FleetDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const vehicle = vehicles.find(v => v.id === slug)

  if (!vehicle) return <Navigate to="/fleet" replace />

  return (
    <div>
      {/* Hero */}
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
              {vehicle.badge && (
                <div className="bg-gold-500 text-obsidian-950 text-[10px] tracking-widest px-3 py-1 inline-block mb-4 font-semibold">
                  {vehicle.badge}
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-10 bg-gold-500" />
                <span className="text-gold-400 text-xs tracking-[0.25em] uppercase capitalize">{vehicle.category.replace('-', ' ')}</span>
              </div>
              <h1 className="font-display text-white text-5xl mb-3">{vehicle.name}</h1>
              <p className="text-obsidian-400 text-xl mb-6">{vehicle.tagline}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-gold-400">
                  <Star size={14} fill="currentColor" />
                  <span className="font-medium">{vehicle.rating}</span>
                </div>
                <span className="text-obsidian-600 text-sm">({vehicle.reviews} reviews)</span>
                <span className="text-obsidian-600">·</span>
                <div className="flex items-center gap-1 text-obsidian-400 text-sm">
                  <Users size={13} /> {vehicle.seats} seats
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="text-center bg-obsidian-900 border border-obsidian-800 px-6 py-4">
                  <div className="font-display text-gold-400 text-2xl">{formatCurrency(vehicle.pricePerKm)}</div>
                  <div className="text-obsidian-500 text-xs uppercase tracking-wider">per km</div>
                </div>
                {vehicle.pricePerDay && (
                  <div className="text-center bg-obsidian-900 border border-obsidian-800 px-6 py-4">
                    <div className="font-display text-gold-400 text-2xl">{formatCurrency(vehicle.pricePerDay)}</div>
                    <div className="text-obsidian-500 text-xs uppercase tracking-wider">per day</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={whatsappBookingLink(vehicle.name, `${vehicle.seats} seats`)}
                  target="_blank" rel="noopener noreferrer" className="btn-gold text-xs">
                  Book This Vehicle
                </a>
                <a href="tel:+919811368167" className="btn-luxury text-xs">Call for Best Rate</a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="relative overflow-hidden">
              <img src={vehicle.images[0]} alt={vehicle.name}
                className="w-full h-80 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/cars/traveller.webp' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-obsidian-950 text-2xl mb-6">Features</h2>
              <div className="space-y-3">
                {vehicle.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check size={14} className="text-gold-500 shrink-0" />
                    <span className="text-obsidian-600 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-obsidian-950 text-2xl mb-6">Amenities</h2>
              <div className="space-y-3">
                {vehicle.amenities.map(a => (
                  <div key={a} className="flex items-center gap-3">
                    <Check size={14} className="text-gold-500 shrink-0" />
                    <span className="text-obsidian-600 text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { label: 'Fuel Type', val: vehicle.fuelType },
              { label: 'Capacity', val: `${vehicle.seats} Passengers` },
              { label: 'Climate', val: vehicle.ac ? 'Full AC' : 'Non-AC' },
            ].map(item => (
              <div key={item.label} className="bg-white border border-obsidian-100 p-5 text-center">
                <div className="text-obsidian-400 text-[10px] uppercase tracking-widest mb-2">{item.label}</div>
                <div className="font-display text-obsidian-950 text-lg">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
