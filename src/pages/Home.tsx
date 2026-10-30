import React from 'react'
import Hero from '@/components/home/Hero'
import {
  Offerings,
  PackagesExplorer,
  GroupDepartures,
  CustomTripBanner,
  Destinations,
  TravellerTypes,
  Transportation,
  WhyUs,
  ContactBand,
} from '@/components/home/HomeSections'

export default function HomePage() {
  return (
    <div className="bg-mist">
      <Hero />
      <Offerings />
      <PackagesExplorer />
      <GroupDepartures />
      <CustomTripBanner />
      <Destinations />
      <TravellerTypes />
      <Transportation />
      <WhyUs />
      <ContactBand />
    </div>
  )
}
