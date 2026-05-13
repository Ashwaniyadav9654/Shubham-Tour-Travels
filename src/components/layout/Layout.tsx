import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from '@/components/sections/WhatsAppFloat'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
