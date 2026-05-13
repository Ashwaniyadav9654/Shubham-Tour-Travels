import React from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/utils'

export default function CTASection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.9)), url('/images/Safety.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute top-0 left-1/2 w-px h-12 bg-gradient-to-b from-transparent to-gold-500/60" />
      <div className="absolute bottom-0 left-1/2 w-px h-12 bg-gradient-to-t from-transparent to-gold-500/60" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gold-500/60" />
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase">Available 24/7</span>
            <div className="h-px w-16 bg-gold-500/60" />
          </div>

          <h2 className="font-display text-white text-4xl md:text-6xl mb-6 leading-tight">
            Ready to Travel<br />
            <em className="text-gold-gradient not-italic">in Style?</em>
          </h2>

          <p className="text-obsidian-300 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            Book your Luxury Tempo Traveller today. WhatsApp or call for instant quotes and real-time availability across Delhi NCR.
          </p>

          {/* Pricing pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <span className="px-4 py-2 border border-gold-500/30 text-gold-400 text-xs tracking-wider">₹30/km Outstation</span>
            <span className="px-4 py-2 border border-gold-500/30 text-gold-400 text-xs tracking-wider">₹28/km Local NCR</span>
            <span className="px-4 py-2 border border-gold-500/20 text-obsidian-400 text-xs tracking-wider">Min. 250 km/day</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLink("Hi! I'd like to book a Luxury Tempo Traveller. Please share availability and pricing.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#22c55e] transition-colors"
            >
              <MessageCircle size={18} />
              Book via WhatsApp
            </a>
            <a
              href={PHONE_HREF}
              className="btn-luxury flex items-center gap-3"
            >
              <Phone size={15} />
              Call Now: {PHONE_NUMBER}
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-obsidian-500 text-xs tracking-wider">
            <span>✦ Zero Advance Required</span>
            <span>✦ GST Billing Available</span>
            <span>✦ GPS Tracked Fleet</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
