<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlistStore'

const router = useRouter()

// Typing effect for tagline
const fullTagline = 'Discover your next favorite book in our curated collection.'
const displayedTagline = ref('')
const typingIndex = ref(0)
let typingInterval: number | undefined

const wishlistStore = useWishlistStore()

function typeTagline() {
  typingInterval = window.setInterval(() => {
    if (typingIndex.value < fullTagline.length) {
      displayedTagline.value += fullTagline[typingIndex.value]
      typingIndex.value++
    } else {
      clearInterval(typingInterval)
    }
  }, 60)
}

function navigateToSearch() {
  router.push('/search')
}

onMounted(async () => {
  typeTagline()
  await wishlistStore.updateStore()
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<template>
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="title-line">The Modern</span>
        <span class="title-line">Library</span>
      </h1>
      <p class="hero-tagline">{{ displayedTagline }}<span class="typing-cursor"></span></p>
      <div class="button-group">
        <button class="explore-btn" @click="navigateToSearch">
          <span class="btn-text">Explore Books</span>
          <i class="bi bi-arrow-right ms-2"></i>
        </button>
        <button class="curated-btn" @click="router.push('/recommendations')">
          <span class="btn-text">Curated for You</span>
          <i class="bi bi-stars ms-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  width: 100%;
  background: rgb(18, 18, 18);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* .hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 0%, rgba(24, 24, 24, 0.9), transparent 70%),
    radial-gradient(circle at 0% 50%, rgba(147, 51, 234, 0.35), transparent 50%),
    radial-gradient(circle at 100% 50%, rgba(6, 182, 212, 0.35), transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(236, 72, 153, 0.2), transparent 50%);
  pointer-events: none;
} */

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  margin-top: 2rem;
}

.hero-title {
  font-family:
    'Geist Sans',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: 2rem;
}

.title-line {
  display: block;
}

.hero-tagline {
  font-family:
    'Geist Sans',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-bottom: 3rem;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.explore-btn,
.curated-btn {
  min-width: 200px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-geist-sans);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.explore-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.explore-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.curated-btn {
  background: #ffffff;
  border: 1px solid #ffffff;
  color: rgb(18, 18, 18);
}

.curated-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: rgba(255, 255, 255, 0.7);
  margin-left: 4px;
  animation: blink 0.8s steps(1) infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 0 1rem;
  }

  .explore-btn,
  .curated-btn {
    width: 100%;
    min-width: unset;
  }
}
</style>
