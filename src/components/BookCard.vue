<template>
  <div class="book-card" :class="{ 'skeleton-card': loading }">
    <template v-if="loading">
      <div class="skeleton-cover"></div>
      <div class="skeleton-info">
        <div class="skeleton-title"></div>
        <div class="skeleton-author"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-price"></div>
      </div>
    </template>
    <template v-else>
      <router-link :to="{ name: 'BookDescription', params: { id: book.id } }" class="book-link">
        <div class="book-cover">
          <img :src="book.image_url" :alt="book.title" />
        </div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <div class="book-meta">
            <span class="rating">
              <i class="bi bi-star-fill"></i>
              {{ book.rating.toFixed(1) }}
              <span class="review-count" v-if="book.review_count">({{ book.review_count }})</span>
            </span>
          </div>
          <div class="tags">
            <span v-if="book.tags[0]" class="tag">{{ book.tags[0] }}</span>
            <span v-if="book.tags[1]" class="tag">{{ book.tags[1] }}</span>
          </div>
          <div class="price">₹{{ book.price }}</div>
        </div>
      </router-link>
      <button
        class="wishlist-btn"
        @click.stop="toggleWishlist"
        :class="{
          wishlisted: isWishlisted,
          loading: wishlistLoading,
        }"
        :disabled="wishlistLoading"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore'

interface Book {
  id: string
  title: string
  author: string
  image_url: string
  rating: number
  review_count?: number
  tags: string[]
  price: number
}

const props = defineProps<{
  book: Book
  loading?: boolean
}>()

const bookStore = useWishlistStore()
const wishlistLoading = ref(false)

const isWishlisted = computed(() => {
  return bookStore.wishlistedBookIds.has(props.book.id)
})

async function toggleWishlist() {
  if (wishlistLoading.value) return

  wishlistLoading.value = true
  try {
    await bookStore.toggleWishlist(props.book.id)
  } catch (error) {
    console.error('Failed to toggle wishlist:', error)
  } finally {
    wishlistLoading.value = false
  }
}
</script>

<style scoped>
.book-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.book-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.book-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.book-cover {
  aspect-ratio: 2/3;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 220px;
}

.book-info h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}

.author {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.book-meta {
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.rating i {
  color: #ffd700;
  font-size: 1rem;
}

.review-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin-left: 0.25rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: auto;
  min-height: 28px;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  height: 24px;
  display: inline-flex;
  align-items: center;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.15);
}

.price {
  margin-top: 1rem;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  flex-shrink: 0;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinning {
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* Skeleton Loading Styles */
.skeleton-card {
  pointer-events: none;
}

.skeleton-cover {
  aspect-ratio: 2/3;
  background: rgba(255, 255, 255, 0.05);
  animation: pulse 1.5s infinite;
}

.skeleton-info {
  padding: 1.5rem;
}

.skeleton-title,
.skeleton-author,
.skeleton-meta {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  height: 24px;
  margin-bottom: 0.5rem;
  width: 80%;
}

.skeleton-author {
  height: 18px;
  margin-bottom: 1rem;
  width: 60%;
}

.skeleton-meta {
  height: 16px;
  width: 100%;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  margin-top: 1rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
