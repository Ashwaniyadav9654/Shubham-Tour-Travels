import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { reviews } from '@/data'

export default function ReviewsSection() {
  return (
    <section className="section-pad bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Testimonials</span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="font-display text-white text-4xl md:text-5xl mb-4">
            Words from Our Guests
          </h2>
          <p className="text-obsidian-400 max-w-md mx-auto">
            5,000+ happy travellers have trusted us with their most important journeys.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-obsidian-900/50 border border-obsidian-800 p-7 relative hover:border-gold-500/30 transition-colors"
            >
              <Quote size={28} className="text-gold-500/20 absolute top-6 right-6" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={13} className="text-gold-500" fill="currentColor" />
                ))}
              </div>

              <p className="text-obsidian-300 text-sm leading-relaxed mb-6 italic">
                "{review.comment}"
              </p>

              <div className="border-t border-obsidian-800 pt-4">
                <div className="font-semibold text-white text-sm">{review.name}</div>
                <div className="text-obsidian-500 text-xs mt-0.5">{review.location}</div>
                <div className="text-gold-600 text-[10px] tracking-wider uppercase mt-1">{review.service}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
