import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'

// Pages
import HomePage from '@/pages/Home'
import FleetPage from '@/pages/Fleet'
import FleetDetailPage from '@/pages/FleetDetail'
import ToursPage from '@/pages/Tours'
import AirportTransferPage from '@/pages/AirportTransfer'
import CorporatePage from '@/pages/Corporate'
import WeddingPage from '@/pages/Wedding'
import GalleryPage from '@/pages/Gallery'
import ReviewsPage from '@/pages/Reviews'
import BlogPage from '@/pages/Blog'
import AboutPage from '@/pages/About'
import ContactPage from '@/pages/Contact'
import BookingPage from '@/pages/Booking'
import LoginPage from '@/pages/Login'
import AdminPage from '@/pages/Admin'
import NotFoundPage from '@/pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(201,146,42,0.3)',
              color: '#f5f0e8',
            },
          }}
        />
        <Routes>
          {/* Admin – standalone layout */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Main site with Navbar + Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/fleet/:slug" element={<FleetDetailPage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/airport-transfer" element={<AirportTransferPage />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/wedding" element={<WeddingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
