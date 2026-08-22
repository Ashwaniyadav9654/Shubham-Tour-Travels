import React from 'react'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import JourneySection from '@/components/sections/JourneySection'
import ServicesSection from '@/components/sections/ServicesSection'
import FleetSection from '@/components/sections/FleetSection'
import MarqueeStrip from '@/components/sections/MarqueeStrip'
import PackagesSection from '@/components/sections/PackagesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <JourneySection />
      <ServicesSection />
      <FleetSection />
      <MarqueeStrip />
      <PackagesSection />
      <ReviewsSection />
      <CTASection />
    </div>
  )
}
