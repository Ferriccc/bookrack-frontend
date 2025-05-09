<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <div class="landing-container">
    <HeroSection />
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  position: relative;
  margin: 0;
  padding: 0;
}

.landing-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>
