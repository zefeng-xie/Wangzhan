<script setup>
import { statsItems } from '../data/portfolioData'

defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="stats-section">
    <div class="stats-grid">
      <div v-for="item in statsItems" :key="item.id" class="stat-item">
        <div class="stat-icon"><i :class="item.iconClass"></i></div>
        <div class="stat-number">
          <span :id="item.id" class="stat-count" :data-target="stats[item.key]">0</span>
        </div>
        <div class="stat-unit">{{ item.unit }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </div>
  </section>
</template>
