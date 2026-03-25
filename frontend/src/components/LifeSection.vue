<script setup>
import { computed, ref } from 'vue'
import PhotoCard from './PhotoCard.vue'
import {
  creativeSection,
  fitnessPhotos,
  fitnessTimeline,
  getCityGallery,
  getMountainGallery,
  lifeTabs,
  mountainTags,
  movieSection,
  travelIntro,
  travelRegions,
} from '../data/portfolioData'

const activeTab = ref('fitness')
const activeCity = ref('')
const activeMountain = ref('')

const selectedCityPhotos = computed(() => (activeCity.value ? getCityGallery(activeCity.value) : []))
const selectedMountainPhotos = computed(() =>
  activeMountain.value ? getMountainGallery(activeMountain.value) : [],
)

function openCity(city) {
  activeCity.value = city
}

function openMountain(mountain) {
  activeMountain.value = mountain
}
</script>

<template>
  <section id="life" class="section section-alt">
    <h2 class="section-title">我的生活</h2>
    <p class="section-subtitle">技能写在简历里，而这里是真实的我</p>

    <div class="life-tabs">
      <button
        v-for="tab in lifeTabs"
        :key="tab.id"
        class="life-tab"
        :class="{ active: activeTab === tab.id }"
        :data-target="tab.id"
        @click="activeTab = tab.id"
      >
        <i :class="tab.iconClass"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="life-panel" :class="{ active: activeTab === 'fitness' }" id="fitness">
      <div class="story-card">
        <h4 class="mini-title"><i class="fa-solid fa-person-running"></i> 我的运动历程</h4>
        <div class="story-timeline">
          <div v-for="item in fitnessTimeline" :key="item.title" class="timeline-item">
            <div class="timeline-icon" :class="item.iconTone">
              <i :class="item.iconClass"></i>
            </div>
            <div class="timeline-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.text }}</p>
              <div v-if="item.photos?.length" class="photo-grid photo-grid-3 timeline-photos">
                <PhotoCard
                  v-for="photo in item.photos"
                  :key="photo.id"
                  :src="photo.src"
                  :alt="photo.alt"
                  :hint="photo.hint"
                  :placeholder-icon="photo.placeholderIcon"
                  :aspect-ratio="photo.aspectRatio"
                />
              </div>
            </div>
          </div>
        </div>

        <h4 class="mini-title"><i class="fa-solid fa-mountain-sun"></i> 爬山足迹</h4>
        <div class="mountain-view" v-show="!activeMountain">
          <p class="travel-click-tip"><i class="fa-solid fa-hand-pointer"></i> 点击山名查看登山照片</p>
          <div class="tag-cloud">
            <span
              v-for="mountain in mountainTags"
              :key="mountain"
              class="tag tag-mountain"
              :data-mountain="mountain"
              @click="openMountain(mountain)"
            >
              {{ mountain }}
            </span>
          </div>
        </div>
        <div class="mountain-gallery" :class="{ active: !!activeMountain }">
          <button class="mountain-gallery-back" type="button" @click="activeMountain = ''">
            <i class="fa-solid fa-arrow-left"></i> 返回爬山足迹
          </button>
          <h4 class="mountain-gallery-title mini-title">
            <i class="fa-solid fa-mountain"></i> {{ activeMountain }} · 登山记录
          </h4>
          <div class="photo-grid photo-grid-3 mountain-photos">
            <PhotoCard
              v-for="photo in selectedMountainPhotos"
              :key="photo.id"
              :src="photo.src"
              :alt="photo.alt"
              :hint="photo.hint"
              :aspect-ratio="photo.aspectRatio"
              item-class="city-photo-item"
            />
          </div>
        </div>

        <h4 class="mini-title"><i class="fa-solid fa-camera"></i> 健身记录</h4>
        <div class="photo-grid photo-grid-2">
          <PhotoCard
            v-for="photo in fitnessPhotos"
            :key="photo.id"
            :src="photo.src"
            :alt="photo.alt"
            :hint="photo.hint"
            :aspect-ratio="photo.aspectRatio"
          />
        </div>

        <div class="story-quote">
          <blockquote>"无论是健身房的铁片、泳池的水花，还是山顶的清风，运动教会我的是如何管理自己、坚持到底。"</blockquote>
        </div>
      </div>
    </div>

    <div class="life-panel" :class="{ active: activeTab === 'movies' }" id="movies">
      <div class="story-card">
        <p class="panel-intro">{{ movieSection.intro }}</p>

        <template v-for="group in movieSection.groups" :key="group.title">
          <h4 class="mini-title"><i :class="group.iconClass"></i> {{ group.title }}</h4>
          <p v-if="group.note && group.notePosition === 'before'" class="panel-note">
            {{ group.note }}
          </p>
          <div class="tag-cloud">
            <span
              v-for="(item, index) in group.items"
              :key="item"
              class="tag"
              :class="group.tagClassByItem ? group.tagClassByItem[index] : group.tagClass"
            >
              {{ item }}
            </span>
          </div>
          <p v-if="group.note && group.notePosition === 'after'" class="panel-note">
            {{ group.note }}
          </p>
        </template>

        <div class="story-quote">
          <blockquote>"{{ movieSection.quote }}"</blockquote>
        </div>
      </div>
    </div>

    <div class="life-panel" :class="{ active: activeTab === 'travel' }" id="travel">
      <div class="story-card">
        <p class="panel-intro">{{ travelIntro }}</p>

        <div class="travel-city-view" v-show="!activeCity">
          <h4 class="mini-title"><i class="fa-solid fa-map-location-dot"></i> 去过的地方</h4>
          <p class="travel-click-tip"><i class="fa-solid fa-hand-pointer"></i> 点击城市名查看旅途照片</p>
          <div class="travel-map">
            <div v-for="region in travelRegions" :key="region.name" class="travel-region">
              <h5>{{ region.name }}</h5>
              <div class="tag-cloud">
                <span
                  v-for="city in region.cities"
                  :key="city.name"
                  class="tag tag-travel"
                  :data-city="city.name"
                  @click="openCity(city.name)"
                >
                  {{ city.label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="city-gallery" :class="{ active: !!activeCity }">
          <button class="city-gallery-back" type="button" @click="activeCity = ''">
            <i class="fa-solid fa-arrow-left"></i> 返回所有城市
          </button>
          <h4 class="city-gallery-title mini-title">
            <i class="fa-solid fa-camera"></i> {{ activeCity }} · 旅途印记
          </h4>
          <div class="photo-grid photo-grid-3 city-photos">
            <PhotoCard
              v-for="photo in selectedCityPhotos"
              :key="photo.id"
              :src="photo.src"
              :alt="photo.alt"
              :hint="photo.hint"
              :aspect-ratio="photo.aspectRatio"
              item-class="city-photo-item"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="life-panel" :class="{ active: activeTab === 'creative' }" id="creative">
      <div class="story-card">
        <p class="panel-intro">{{ creativeSection.intro }}</p>

        <h4 class="mini-title"><i class="fa-solid fa-paintbrush"></i> 油画棒作品</h4>
        <div class="photo-grid photo-grid-3">
          <PhotoCard
            v-for="photo in creativeSection.artPhotos"
            :key="photo.id"
            :src="photo.src"
            :alt="photo.alt"
            :hint="photo.hint"
            :aspect-ratio="photo.aspectRatio"
          />
        </div>

        <h4 class="mini-title"><i class="fa-solid fa-camera-retro"></i> 风景摄影</h4>
        <div class="photo-grid photo-grid-3">
          <PhotoCard
            v-for="photo in creativeSection.landscapePhotos"
            :key="photo.id"
            :src="photo.src"
            :alt="photo.alt"
            :hint="photo.hint"
            :aspect-ratio="photo.aspectRatio"
          />
        </div>

        <div class="story-quote">
          <blockquote>"{{ creativeSection.quote }}"</blockquote>
        </div>
      </div>
    </div>
  </section>
</template>
