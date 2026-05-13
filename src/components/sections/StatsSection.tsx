import React from 'react'
import { motion } from 'framer-motion'
import { stats } from '@/data'

export default function StatsSection() {
  return (
    <section className="bg-obsidian-950 border-y border-gold-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gold-500/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="py-12 px-8 text-center"
            >
              <div className="font-display text-4xl md:text-5xl text-gold-400 mb-2">{stat.value}</div>
              <div className="text-obsidian-500 text-xs tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
