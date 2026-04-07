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
import { fallbackStats, getAllImageSrcs } from './data/portfolioData'
import { getApiUrl } from './lib/api'
import { initPortfolioPage } from './portfolioPage'

const stats = reactive({ ...fallbackStats })

async function loadStats() {
  try {
    const response = await fetch(getApiUrl('/api/stats'))
    if (!response.ok) {
      throw new Error(`Failed to load stats: ${response.status}`)
    }

    const data = await response.json()
    Object.assign(stats, data)
  } catch (error) {
    console.warn('Using fallback stats because API request failed.', error)
  }
}

function preloadImagesSequentially() {
  const srcs = getAllImageSrcs()
  let index = 0

  function loadNext() {
    if (index >= srcs.length) return
    const img = new Image()
    img.onload = img.onerror = () => {
      index++
      setTimeout(loadNext, 100)
    }
    img.src = srcs[index]
  }

  // 等页面关键资源加载完再开始，避免抢带宽
  setTimeout(loadNext, 1000)
}

onMounted(async () => {
  await loadStats()
  await nextTick()
  initPortfolioPage()
  preloadImagesSequentially()
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
