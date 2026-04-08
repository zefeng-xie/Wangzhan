<script setup>
import { contactLinks } from '../data/portfolioData'
</script>

<template>
  <section id="contact" class="section">
    <h2 class="section-title">联系我</h2>
    <div class="contact-content">
      <p>如果你想和我交流，欢迎通过以下方式联系我：</p>
      <div class="contact-links">
        <a
          v-for="link in contactLinks"
          :key="link.label"
          :href="link.href"
          :target="link.newTab ? '_blank' : undefined"
          :rel="link.newTab ? 'noopener noreferrer' : undefined"
          class="contact-item"
        >
          <i :class="link.iconClass"></i>
          <span>{{ link.label }}</span>
          <span v-if="link.tooltip" class="contact-tooltip">{{ link.tooltip }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
