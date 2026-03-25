<script setup>
import { skills } from '../data/portfolioData'
</script>

<template>
  <section id="skills" class="section">
    <h2 class="section-title">专业技能</h2>
    <div class="skills-grid">
      <div v-for="skill in skills" :key="skill.title" class="skill-card">
        <i :class="skill.iconClass"></i>
        <h3>{{ skill.title }}</h3>
        <p>{{ skill.description }}</p>
      </div>
    </div>
  </section>
</template>
