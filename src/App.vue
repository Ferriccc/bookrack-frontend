<script setup lang="ts">
import { onMounted, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import ChatBot from '@/components/ChatBot.vue'
import SignInRequiredPopup from '@/components/SignInRequiredPopup.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const isSignedIn = computed(() => userStore.user !== null)

onMounted(() => {
  userStore.checkAuth()
})
</script>

<template>
  <div>
    <SignInRequiredPopup v-if="!isSignedIn" />
    <NavBar />
    <div class="app-content">
      <router-view />
    </div>
    <ChatBot />
  </div>
</template>

<style>
@import url('https://vercel.com/font/geist-sans');
@import url('https://vercel.com/font/geist-mono');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');

:root {
  --font-geist-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}

body,
html,
#app {
  margin: 0;
  padding: 0;
  font-family: var(--font-geist-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'ss01', 'ss02', 'ss03', 'ss04', 'ss05', 'ss06';
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-geist-sans);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

p,
span,
div,
a,
button,
input,
textarea,
select {
  font-family: var(--font-geist-sans);
}

code,
pre {
  font-family: var(--font-geist-mono);
}

/* Font size scale */
h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}
h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
h3 {
  font-size: clamp(1.25rem, 3vw, 2rem);
}
h4 {
  font-size: clamp(1.125rem, 2.5vw, 1.75rem);
}
h5 {
  font-size: clamp(1rem, 2vw, 1.5rem);
}
h6 {
  font-size: clamp(0.875rem, 1.5vw, 1.25rem);
}

body {
  font-size: 16px;
}
</style>
