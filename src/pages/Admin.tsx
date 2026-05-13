import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import { Car, Users, TrendingUp, MessageSquare, Settings, BarChart3, MapPin, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { vehicles, reviews, tourPackages } from '@/data'

const stats = [
  { label: 'Total Fleet', value: vehicles.length, icon: Car, change: '+2 this month' },
  { label: 'Total Reviews', value: '5,000+', icon: Users, change: '4.9 avg rating' },
  { label: 'Tour Packages', value: tourPackages.length, icon: MapPin, change: 'Active packages' },
  { label: 'Monthly Bookings', value: '320+', icon: TrendingUp, change: '+18% vs last month' },
]

const tabs = ['Overview', 'Fleet', 'Bookings', 'Reviews', 'Settings']

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')

  if (!isAdmin) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* Admin Header */}
      <div className="bg-obsidian-900 border-b border-obsidian-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-white text-xl">Admin Dashboard</h1>
          <p className="text-obsidian-500 text-xs">Shubham Tour & Travels · Management Panel</p>
        </div>
        <div className="flex items-center gap-2 text-obsidian-400 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Online
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Nav */}
        <div className="flex gap-1 mb-8 border-b border-obsidian-800">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs tracking-wider uppercase transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-gold-500 text-gold-400' : 'border-transparent text-obsidian-500 hover:text-obsidian-300'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-obsidian-900 border border-obsidian-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <s.icon size={18} className="text-gold-500" />
                    <span className="text-green-400 text-[10px]">{s.change}</span>
                  </div>
                  <div className="font-display text-white text-3xl mb-1">{s.value}</div>
                  <div className="text-obsidian-500 text-xs uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Car, title: 'Manage Fleet', desc: 'Add, edit, or remove vehicles from your fleet.', color: 'gold' },
                { icon: Calendar, title: 'View Bookings', desc: 'See all pending and confirmed bookings.', color: 'blue' },
                { icon: MessageSquare, title: 'Customer Reviews', desc: 'Moderate and respond to reviews.', color: 'green' },
              ].map((action) => (
                <div key={action.title} className="bg-obsidian-900 border border-obsidian-800 p-6 hover:border-gold-500/30 transition-colors cursor-pointer">
                  <action.icon size={20} className="text-gold-500 mb-4" />
                  <h3 className="text-white font-medium mb-1 text-sm">{action.title}</h3>
                  <p className="text-obsidian-500 text-xs">{action.desc}</p>
                </div>
              ))}
            </div>

            {/* Recent Vehicles */}
            <div className="bg-obsidian-900 border border-obsidian-800">
              <div className="p-5 border-b border-obsidian-800 flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Fleet Overview</h3>
                <span className="text-obsidian-500 text-xs">{vehicles.length} vehicles</span>
              </div>
              <div className="divide-y divide-obsidian-800">
                {vehicles.slice(0, 5).map((v) => (
                  <div key={v.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car size={14} className="text-gold-500 shrink-0" />
                      <div>
                        <div className="text-white text-sm">{v.name}</div>
                        <div className="text-obsidian-500 text-xs">{v.seats} seats · {v.fuelType}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gold-400 text-sm">₹{v.pricePerKm}/km</div>
                      <div className="text-green-400 text-[10px]">Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Fleet' && (
          <div className="bg-obsidian-900 border border-obsidian-800">
            <div className="p-5 border-b border-obsidian-800 flex items-center justify-between">
              <h3 className="text-white font-medium">All Vehicles</h3>
              <button className="btn-gold text-xs py-2 px-4">+ Add Vehicle</button>
            </div>
            <div className="divide-y divide-obsidian-800">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-obsidian-800 flex items-center justify-center">
                      <Car size={16} className="text-gold-500" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{v.name}</div>
                      <div className="text-obsidian-500 text-xs">{v.category} · {v.seats} seats · {v.fuelType} · {v.ac ? 'AC' : 'Non-AC'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center hidden md:block">
                      <div className="text-gold-400 text-sm">₹{v.pricePerKm}/km</div>
                      <div className="text-obsidian-500 text-xs">Rate</div>
                    </div>
                    <div className="text-center hidden md:block">
                      <div className="text-white text-sm">{v.rating}★</div>
                      <div className="text-obsidian-500 text-xs">{v.reviews} reviews</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-obsidian-400 hover:text-gold-400 transition-colors px-3 py-1 border border-obsidian-700">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="bg-obsidian-900 border border-obsidian-800">
            <div className="p-5 border-b border-obsidian-800">
              <h3 className="text-white font-medium">Customer Reviews</h3>
            </div>
            <div className="divide-y divide-obsidian-800">
              {reviews.map((r) => (
                <div key={r.id} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-white text-sm font-medium">{r.name}</span>
                      <span className="text-obsidian-500 text-xs ml-3">{r.location}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_,i)=><span key={i} className="text-gold-500 text-xs">★</span>)}
                    </div>
                  </div>
                  <p className="text-obsidian-400 text-sm italic mb-2">"{r.comment}"</p>
                  <div className="text-gold-600 text-[10px] uppercase tracking-wider">{r.service}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'Bookings' || activeTab === 'Settings') && (
          <div className="bg-obsidian-900 border border-obsidian-800 p-12 text-center">
            <BarChart3 size={40} className="text-gold-500/30 mx-auto mb-4" />
            <h3 className="text-white font-display text-xl mb-2">
              {activeTab === 'Bookings' ? 'Bookings Management' : 'Settings'}
            </h3>
            <p className="text-obsidian-500 text-sm">
              {activeTab === 'Bookings'
                ? 'Connect to your backend API to manage bookings in real-time.'
                : 'Backend configuration — connect your MongoDB & Node.js API.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
