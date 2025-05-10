<template>
  <div class="book-card">
    <router-link :to="`/book/${book.id}`" class="book-link">
      <div class="book-image">
        <img :src="book.image_url" :alt="book.title" loading="lazy" @error="handleImageError" />
        <button
          class="wishlist-btn"
          :class="{ wishlisted: isWishlisted, loading: wishlistLoading }"
          @click="toggleWishlist"
          :disabled="wishlistLoading"
          aria-label="Toggle Wishlist"
        >
          <transition name="heart" mode="out-in">
            <i
              v-if="!wishlistLoading"
              class="bi"
              :class="isWishlisted ? 'bi-heart-fill' : 'bi-heart'"
              :key="isWishlisted ? 'filled' : 'empty'"
            ></i>
            <i v-else class="bi bi-arrow-repeat spinning" key="loading"></i>
          </transition>
        </button>
        <div class="book-overlay">
          <div class="overlay-content">
            <span class="view-details">View Details</span>
          </div>
        </div>
      </div>
      <div class="book-content">
        <h3 class="book-title">{{ book.title }}</h3>
        <p class="book-author">{{ book.author }}</p>
        <div class="book-meta">
          <div class="rating">
            <i class="bi bi-star-fill"></i>
            <span>{{ book.rating.toFixed(1) }}</span>
            <span class="review-count">({{ book.review_count }})</span>
          </div>
          <div class="price">₹{{ book.price.toFixed(2) }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore'

const props = defineProps<{
  book: {
    id: string
    title: string
    author: string
    image_url: string
    rating: number
    price: number
    review_count?: number
  }
}>()

const wishlistStore = useWishlistStore()
const wishlistLoading = ref(false)

const isWishlisted = computed(() => wishlistStore.wishlistedBookIds.has(props.book.id))

async function toggleWishlist(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  if (wishlistLoading.value) return
  wishlistLoading.value = true
  try {
    await wishlistStore.toggleWishlist(props.book.id)
  } catch (err) {
    // Optionally show error
  } finally {
    wishlistLoading.value = false
  }
}

const handleImageError = (e: Event) => {
  // Optionally handle image error
  // e.g. e.target.src = '/placeholder-book.jpg'
}
</script>

<style scoped>
.book-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 220px;
  max-width: 100%;
  position: relative;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.book-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-image {
  position: relative;
  width: 100%;
  padding-top: 140%;
  overflow: hidden;
}

.book-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wishlist-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  overflow: hidden;
  z-index: 2;
}

.wishlist-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  transform: scale(1.1);
}

.wishlist-btn.wishlisted {
  color: #ff4081;
  background: rgba(255, 64, 129, 0.2);
}

.wishlist-btn.wishlisted:hover {
  background: rgba(255, 64, 129, 0.3);
}

.wishlist-btn.loading {
  pointer-events: none;
  opacity: 0.8;
}

.heart-enter-active,
.heart-leave-active {
  transition: all 0.3s ease;
}
.heart-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(-45deg);
}
.heart-leave-to {
  opacity: 0;
  transform: scale(1.4) rotate(45deg);
}
.spinning {
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.overlay-content {
  color: #ffffff;
  text-align: center;
  transform: translateY(10px);
  transition: transform 0.2s ease;
}

.book-card:hover .overlay-content {
  transform: translateY(0);
}

.view-details {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.book-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.book-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: break-word;
}

.book-author {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: break-word;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-size: 1rem;
}

.rating i {
  font-size: 1.1rem;
}

.review-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.price {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  white-space: normal;
  overflow-wrap: break-word;
}

@media (min-width: 768px) {
  .book-title {
    font-size: 1.3rem;
  }

  .book-author {
    font-size: 1rem;
  }

  .rating {
    font-size: 1rem;
  }

  .price {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .book-content {
    padding: 1.75rem;
  }

  .book-title {
    font-size: 1.3rem;
  }
}
</style>
