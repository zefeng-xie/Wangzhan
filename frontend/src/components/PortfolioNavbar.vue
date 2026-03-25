<script setup>
import { navLinks } from '../data/portfolioData'
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">谢泽锋</div>
    <ul class="nav-links">
      <li v-for="link in navLinks" :key="link.href">
        <a :href="link.href">{{ link.label }}</a>
      </li>
    </ul>
  </nav>
</template>
