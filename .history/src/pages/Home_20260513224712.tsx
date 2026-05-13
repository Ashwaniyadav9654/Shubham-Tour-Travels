import React from 'react'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import FleetSection from '@/components/sections/FleetSection'
import PackagesSection from '@/components/sections/PackagesSection'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FleetSection />
      <PackagesSection />
      <CTASection />
    </div>
  )
}
