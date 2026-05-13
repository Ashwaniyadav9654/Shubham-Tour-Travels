import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Users, Check } from 'lucide-react'
import { vehicles } from '@/data'
import { formatCurrency, whatsappBookingLink } from '@/lib/utils'
import type { Vehicle } from '@/types'

const categories = [
  { id: 'all', label: 'All Vehicles' },
  { id: 'maharaja', label: 'Maharaja' },
  { id: 'bus', label: 'AC Bus' },
  { id: 'innova', label: 'Innova Crysta' },
  { id: 'suv', label: 'SUV' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'corporate', label: 'Corporate' },
]

export default function FleetPage() {
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? vehicles
    : vehicles.filter(v => v.category === active)

  return (
    <div>
      {/* Hero */}
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Our Fleet</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4">Vehicles That Define Luxury</h1>
            <p className="text-obsidian-400 max-w-xl">
              From Maharaja Travellers to AC buses and executive sedans — every vehicle is meticulously maintained, GPS tracked, and driven by trained professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-200 border ${
                  active === cat.id
                    ? 'bg-obsidian-950 text-gold-400 border-obsidian-950'
                    : 'bg-white text-obsidian-500 border-obsidian-200 hover:border-obsidian-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Maharaja featured card - full width */}
          <AnimatePresence mode="wait">
            {(active === 'all' || active === 'maharaja') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                {vehicles.filter(v => v.category === 'maharaja').map(vehicle => (
                  <MaharajaFeaturedCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rest of vehicles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered
                .filter(v => v.category !== 'maharaja')
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </AnimatePresence>
          </div>

          {filtered.filter(v => v.category !== 'maharaja').length === 0 && active === 'maharaja' && (
            <p className="text-center text-obsidian-400 py-8 text-sm">See the featured Maharaja card above.</p>
          )}
        </div>
      </section>
    </div>
  )
}

// Special wide featured card for Maharaja Traveller
function MaharajaFeaturedCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-obsidian-950 border border-gold-500/20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* Images */}
        <div className="grid grid-rows-2 h-64 lg:h-64">
          <div className="relative overflow-hidden">
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.name} exterior`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-gold-500 text-obsidian-950 text-[10px] tracking-[0.2em] px-3 py-1 font-semibold">
              SIGNATURE
            </div>
            <div className="absolute bottom-2 left-3 text-white/60 text-[10px] uppercase tracking-wider">Exterior</div>
          </div>
          {vehicle.images[1] && (
            <div className="relative overflow-hidden border-t border-gold-500/10">
              <img
                src={vehicle.images[1]}
                alt={`${vehicle.name} interior`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-2 left-3 text-white/60 text-[10px] uppercase tracking-wider">Luxury Interior</div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-[10px] tracking-[0.3em] uppercase">Our Signature Vehicle</span>
            </div>
            <h2 className="font-display text-white text-3xl md:text-4xl mb-2">{vehicle.name}</h2>
            <p className="text-obsidian-400 text-sm mb-6">{vehicle.tagline}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {vehicle.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={12} className="text-gold-500 shrink-0" />
                  <span className="text-obsidian-300 text-xs">{f}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 py-5 border-y border-gold-500/15 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-white text-sm font-medium mb-0.5">
                  <Users size={12} /> {vehicle.seats}
                </div>
                <div className="text-[10px] text-obsidian-500 uppercase tracking-wider">Seats</div>
              </div>
              <div className="text-center border-x border-gold-500/15">
                <div className="text-white text-sm font-medium mb-0.5">{vehicle.fuelType}</div>
                <div className="text-[10px] text-obsidian-500 uppercase tracking-wider">Fuel</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gold-400 text-xs mb-0.5">
                  <Star size={11} fill="currentColor" /> {vehicle.rating}
                </div>
                <div className="text-[10px] text-obsidian-500 uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-obsidian-500 text-[10px] uppercase tracking-wider mb-1">Starting from</div>
              <div className="font-display text-gold-400 text-3xl font-bold">
                ₹{vehicle.pricePerKm}<span className="text-obsidian-400 text-sm font-normal font-body">/km</span>
              </div>
              <div className="text-obsidian-500 text-[10px] mt-0.5">Min. 250 km/day outstation</div>
            </div>
            <a
              href={whatsappBookingLink(vehicle.name, `${vehicle.seats} seats`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs py-3 px-7"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-white border border-obsidian-100 hover:border-gold-300 transition-all duration-400 overflow-hidden hover-lift"
    >
      <div className="relative h-52 overflow-hidden bg-obsidian-100">
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/cars/crysta.png' }}
        />
        {vehicle.badge && (
          <div className="absolute top-4 left-4 bg-gold-500 text-obsidian-950 text-[10px] tracking-[0.2em] px-3 py-1 font-semibold">
            {vehicle.badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-display text-obsidian-950 text-xl">{vehicle.name}</h3>
          <div className="flex items-center gap-1 text-gold-500 text-xs shrink-0 ml-2">
            <Star size={12} fill="currentColor" />
            {vehicle.rating}
          </div>
        </div>
        <p className="text-obsidian-400 text-xs mb-4">{vehicle.tagline}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-obsidian-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-obsidian-500 text-xs mb-0.5">
              <Users size={11} /> {vehicle.seats}
            </div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Seats</div>
          </div>
          <div className="text-center border-x border-obsidian-100">
            <div className="text-obsidian-500 text-xs mb-0.5">{vehicle.fuelType}</div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Fuel</div>
          </div>
          <div className="text-center">
            <div className="text-obsidian-500 text-xs mb-0.5">{vehicle.ac ? 'AC' : 'Non'}</div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Climate</div>
          </div>
        </div>

        <ul className="mb-5 space-y-1">
          {vehicle.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-obsidian-500">
              <div className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-obsidian-400 text-[10px] uppercase tracking-wider">Starting from</div>
            <div className="font-bold text-obsidian-950 text-xl font-display">
              {formatCurrency(vehicle.pricePerKm)}<span className="text-obsidian-400 text-xs font-normal font-body">/km</span>
            </div>
          </div>
          <a
            href={whatsappBookingLink(vehicle.name, `${vehicle.seats} seats`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs py-2.5 px-5"
          >
            Book Now
          </a>
        </div>
      </div>
    </motion.div>
  )
}
