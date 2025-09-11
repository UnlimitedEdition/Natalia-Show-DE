import React from 'react'
import Hero from '@/components/Hero'
import PodcastSection from '@/components/PodcastSection'
import CulturalSection from '@/components/CulturalSection'
import KitchenTalkShow from '@/components/KitchenTalkShow'
import DiasporaSection from '@/components/DiasporaSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import Advertisement from '@/components/Advertisement'
import Header from '@/components/Header'

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Advertisement position="header" />
      <Hero />
      <Advertisement position="between_sections" />
      <PodcastSection />
      <Advertisement position="between_sections" />
      <CulturalSection />
      <Advertisement position="between_sections" />
      <KitchenTalkShow />
      <Advertisement position="between_sections" />
      <DiasporaSection />
      <Advertisement position="between_sections" />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Index