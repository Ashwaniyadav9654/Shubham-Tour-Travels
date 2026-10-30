import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, CalendarDays, ArrowRight } from 'lucide-react'
import { HERO_IMAGE, destinations } from '@/data'
import { btn } from '@/components/site/ui'

export default function Hero() {
  const navigate = useNavigate()
  const [to, setTo] = useState('')
  const [passengers, setPassengers] = useState('')
  const [date, setDate] = useState('')

  const plan = (e: React.FormEvent) => {
    e.preventDefault()
    const dest = destinations.find((d) => d.name === to)
    if (dest) {
      const q = new URLSearchParams()
      if (passengers) q.set('adults', passengers)
      if (date) q.set('date', date)
      navigate(`${dest.to.replace('/tours/', '/customize/')}?${q}`)
      return
    }
    const params = new URLSearchParams({ service: 'Luxury Group Tour' })
    if (to) params.set('to', to)
    if (passengers) params.set('passengers', passengers)
    if (date) params.set('date', date)
    navigate(`/booking?${params}`)
  }

  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative overflow-hidden rounded-[2rem] min-h-[640px] md:min-h-[min(86vh,820px)] flex flex-col justify-end">
        <motion.img
          src={HERO_IMAGE}
          alt="Himalayan peaks above the clouds at sunset"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-navy/10" />

        <div className="relative px-6 pb-8 pt-32 sm:px-10 md:px-14 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display font-semibold text-white text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl tracking-tight">
              Every journey,
              <br />
              travelled in comfort.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
              Holiday packages, group tours and luxury Tempo Travellers from Gurgaon and Delhi NCR.
              Planned personally, driven professionally.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tours" className={btn.primary}>
                Explore packages <ArrowRight size={16} />
              </Link>
              <Link to="/fleet" className={btn.light}>
                View our fleet
              </Link>
            </div>
          </motion.div>

          {/* Quick planner */}
          <motion.form
            onSubmit={plan}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid gap-2 rounded-3xl bg-white p-3 shadow-2xl shadow-navy/20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <label className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-mist">
              <MapPin size={18} className="shrink-0 text-sea" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-muted">Where to</span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-navy outline-none"
                >
                  <option value="">Choose a destination</option>
                  {destinations.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-mist">
              <Users size={18} className="shrink-0 text-sea" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-muted">Travellers</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  placeholder="How many?"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-navy outline-none placeholder:text-navy-muted/70"
                />
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-mist">
              <CalendarDays size={18} className="shrink-0 text-sea" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-muted">Travel date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-navy outline-none"
                />
              </span>
            </label>
            <button type="submit" className={`${btn.primary} rounded-2xl px-8 py-4`}>
              Plan my trip
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
