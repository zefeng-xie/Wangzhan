<script setup>
import { nextTick, onMounted, reactive } from 'vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import HeroSection from './components/HeroSection.vue'
import LifeSection from './components/LifeSection.vue'
import PortfolioNavbar from './components/PortfolioNavbar.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import SkillsSection from './components/SkillsSection.vue'
import StatsSection from './components/StatsSection.vue'
import { fallbackStats } from './data/portfolioData'
import { initPortfolioPage } from './portfolioPage'

const stats = reactive({ ...fallbackStats })

async function loadStats() {
  try {
    const response = await fetch('/api/stats')
    if (!response.ok) {
      throw new Error(`Failed to load stats: ${response.status}`)
    }

    const data = await response.json()
    Object.assign(stats, data)
  } catch (error) {
    console.warn('Using fallback stats because API request failed.', error)
  }
}

onMounted(async () => {
  await loadStats()
  await nextTick()
  initPortfolioPage()
})
</script>

<template>
  <PortfolioNavbar />
  <HeroSection />
  <AboutSection />
  <StatsSection :stats="stats" />
  <LifeSection />
  <SkillsSection />
  <ProjectsSection />
  <ContactSection />
  <SiteFooter />
</template>
