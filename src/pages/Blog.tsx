import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import { blogPosts } from '@/data'

export default function BlogPage() {
  return (
    <div>
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Travel Stories</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl">Journeys, Tips & Guides</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article key={post.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-obsidian-100 hover:border-gold-300 hover-lift transition-all overflow-hidden">
                <div className="relative h-48 overflow-hidden cinematic-overlay">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-950 text-[10px] px-3 py-1 tracking-wider font-semibold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-obsidian-400 text-xs mb-3">
                    <Clock size={11} /> {post.readTime}
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="font-display text-obsidian-950 text-xl leading-snug mb-3 group-hover:text-gold-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-obsidian-500 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-gold-600 text-xs tracking-wider uppercase font-medium">
                    Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-20 text-obsidian-400">More stories coming soon...</div>
          )}
        </div>
      </section>
    </div>
  )
}
