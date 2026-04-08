<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
  aspectRatio: {
    type: String,
    default: '',
  },
  placeholderIcon: {
    type: String,
    default: 'fa-solid fa-image',
  },
  itemClass: {
    type: String,
    default: '',
  },
})

const imageStyle = computed(() => (props.aspectRatio ? { aspectRatio: props.aspectRatio } : undefined))

const placeholderStyle = computed(() => {
  const style = { display: 'none' }
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  }
  return style
})

function handleImageError(event) {
  const image = event.target

  if (image.src.includes('.webp')) {
    image.src = image.src.replace('.webp', '.jpg')
    return
  }

  if (image.src.includes('.jpg')) {
    image.src = image.src.replace('.jpg', '.png')
    return
  }

  image.style.display = 'none'
  image.nextElementSibling?.style.setProperty('display', 'flex')
}
</script>

<template>
  <div :class="['photo-item', itemClass]">
    <img :src="src" :alt="alt" class="photo-img" :style="imageStyle" @error="handleImageError" />
    <div class="photo-placeholder" :style="placeholderStyle">
      <i :class="placeholderIcon"></i>
      <p>{{ alt }}</p>
      <span class="photo-hint">{{ hint }}</span>
    </div>
  </div>
</template>
