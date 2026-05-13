import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { reviews } from '@/data'
import CTASection from '@/components/sections/CTASection'
import { whatsappLink } from '@/lib/utils'

export default function ReviewsPage() {
  return (
    <div>
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Testimonials</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4">What Our Guests Say</h1>
            <div className="flex items-center gap-6 mt-6">
              <div className="text-center">
                <div className="font-display text-gold-400 text-4xl">4.9</div>
                <div className="flex gap-0.5 my-1 justify-center">{[...Array(5)].map((_,i)=><Star key={i} size={13} fill="#c9922a" className="text-gold-500"/>)}</div>
                <div className="text-obsidian-500 text-xs">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-obsidian-800" />
              <div className="text-center">
                <div className="font-display text-gold-400 text-4xl">5,000+</div>
                <div className="text-obsidian-500 text-xs mt-1">Happy Travellers</div>
              </div>
              <div className="w-px h-12 bg-obsidian-800" />
              <div className="text-center">
                <div className="font-display text-gold-400 text-4xl">12+</div>
                <div className="text-obsidian-500 text-xs mt-1">Years of Trust</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-obsidian-100 p-7 relative hover:border-gold-300 transition-colors hover-lift">
                <Quote size={28} className="text-gold-500/15 absolute top-5 right-5" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_,j)=><Star key={j} size={13} fill="#c9922a" className="text-gold-500"/>)}
                </div>
                <p className="text-obsidian-600 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>
                <div className="border-t border-obsidian-100 pt-4">
                  <div className="font-semibold text-obsidian-950 text-sm">{review.name}</div>
                  <div className="text-obsidian-400 text-xs mt-0.5">{review.location}</div>
                  <div className="text-gold-600 text-[10px] tracking-wider uppercase mt-1">{review.service}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 text-center">
            <p className="text-obsidian-500 mb-6">Had a great experience? Share your story.</p>
            <a href={whatsappLink("I'd like to share my experience with Shubham Tour & Travels!")}
              target="_blank" rel="noopener noreferrer" className="btn-gold text-xs">
              Leave a Review on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
