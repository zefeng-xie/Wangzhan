<script setup>
import { aboutParagraphs } from '../data/portfolioData'
</script>

<template>
  <section id="about" class="section">
    <h2 class="section-title">关于我</h2>
    <div class="about-content">
      <p v-for="paragraph in aboutParagraphs" :key="paragraph">
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>
