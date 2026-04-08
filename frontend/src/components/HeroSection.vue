<script setup>
import { heroContent } from '../data/portfolioData'
</script>

<template>
  <section id="home" class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1>你好，我是<span class="highlight">{{ heroContent.name }}</span></h1>
        <p class="subtitle">{{ heroContent.subtitle }}</p>
        <p class="tagline">{{ heroContent.tagline }}</p>
        <a :href="heroContent.ctaHref" class="btn">{{ heroContent.ctaLabel }}</a>
      </div>
      <div class="hero-avatar">
        <img :src="'/images/avatar.webp'" alt="谢泽锋" />
      </div>
    </div>
  </section>
</template>
