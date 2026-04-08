<script setup>
import { projects } from '../data/portfolioData'
</script>

<template>
  <section id="projects" class="section section-alt">
    <h2 class="section-title">项目经历</h2>
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.title" class="project-card">
        <h3>{{ project.title }}</h3>
        <p v-if="project.description">{{ project.description }}</p>
        <ul v-if="project.bullets">
          <li v-for="bullet in project.bullets" :key="bullet.label">
            <strong>{{ bullet.label }}</strong>：{{ bullet.text }}
          </li>
        </ul>
        <div class="project-footer">
          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </div>
          <div v-if="project.links" class="project-links">
            <a
              v-for="link in project.links"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              <i :class="link.icon"></i>
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
