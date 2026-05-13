import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const galleryItems = [
  { src: '/images/cars/traveller.webp', label: 'Luxury Tempo Traveller', category: 'fleet' },
  { src: '/images/cars/crysta.png', label: 'Toyota Innova Crysta', category: 'fleet' },
  { src: '/images/cars/grandvitara.webp', label: 'Grand Vitara', category: 'fleet' },
  { src: '/images/cars/honda-city4.png', label: 'Honda City ZX', category: 'fleet' },
  { src: '/images/cars/ciaz.webp', label: 'Maruti Ciaz', category: 'fleet' },
  { src: '/images/cars/Ertiga.jpg', label: 'Maruti Ertiga', category: 'fleet' },
  { src: '/images/bg.jpg', label: 'Manali Tour', category: 'tours' },
  { src: '/images/Safety.jpg', label: 'Safety & Comfort', category: 'experience' },
  { src: '/images/support.jpg', label: '24/7 Support', category: 'experience' },
]

const cats = ['all', 'fleet', 'tours', 'experience']

export default function GalleryPage() {
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered = active === 'all' ? galleryItems : galleryItems.filter(g => g.category === active)

  return (
    <div>
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Gallery</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl">Our Fleet & Journeys</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-10">
            {cats.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all capitalize ${
                  active === cat ? 'bg-obsidian-950 text-gold-400 border-obsidian-950' : 'bg-white text-obsidian-500 border-obsidian-200 hover:border-obsidian-400'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <motion.div key={item.src + i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="group cursor-pointer break-inside-avoid relative overflow-hidden"
                onClick={() => setLightbox(item.src)}>
                <img src={item.src} alt={item.label}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/bg.jpg' }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 text-white hover:text-gold-400 transition-colors">
              <X size={28} />
            </button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="Gallery"
              className="max-w-full max-h-[85vh] object-contain"
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
