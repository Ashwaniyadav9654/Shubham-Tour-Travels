import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">
        <div className="font-display text-gold-500/20 text-[120px] leading-none mb-6">404</div>
        <h1 className="font-display text-white text-3xl mb-4">Journey Not Found</h1>
        <p className="text-obsidian-400 mb-8">This road doesn't go anywhere. Let's get you back on track.</p>
        <Link to="/" className="btn-gold text-xs">Back to Home</Link>
      </motion.div>
    </div>
  )
}
