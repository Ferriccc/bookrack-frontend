<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { API_ENDPOINTS, apiClient } from '@/config/api'
import { useWishlistStore } from '@/stores/wishlistStore'

interface Book {
  id: string
  title: string
  author: string
  image_url: string
  rating: number
  tags: string[]
  price: number
  description: string
  review_count: number
}

const route = useRoute()
const book = ref<Book | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const wishlistStore = useWishlistStore()
const isWishlisted = computed(
  () => book.value && wishlistStore.wishlistedBookIds.has(book.value.id),
)

async function fetchBookDetails(id: string) {
  isLoading.value = true
  error.value = null
  try {
    const data = await apiClient.fetch(API_ENDPOINTS.FETCH_BOOK(id))
    // Verify that the fetched book matches the requested ID
    if (data.id !== id) {
      throw new Error('Received incorrect book data')
    }
    book.value = data
  } catch (err) {
    console.error('Failed to fetch book details:', err)
    error.value = 'Failed to load book details. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Watch for route changes to update the book details
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchBookDetails(newId as string)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="book-description">
    <div class="book-description-container">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="isLoading" class="loading-state">
        <div class="book-card skeleton">
          <div class="book-image skeleton-image"></div>
          <div class="book-details">
            <div class="skeleton-title"></div>
            <div class="skeleton-author"></div>
            <div class="skeleton-meta"></div>
            <div class="skeleton-description"></div>
          </div>
        </div>
      </div>

      <div v-else-if="book" class="book-card">
        <div class="book-image">
          <img :src="book.image_url" :alt="book.title" />
        </div>
        <div class="book-details">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">by {{ book.author }}</p>

          <div class="book-meta">
            <div class="rating">
              <i class="bi bi-star-fill"></i>
              <span>{{ book.rating.toFixed(1) }}</span>
              <span class="review-count">({{ book.review_count }} reviews)</span>
            </div>
            <div class="category">{{ book.tags.join(', ') }}</div>
          </div>

          <div class="price">₹{{ book.price }}</div>

          <div class="description">
            <h2>About this book</h2>
            <p>{{ book.description || 'No description available.' }}</p>
          </div>

          <div class="actions">
            <button class="btn-primary">
              <i class="bi bi-cart-plus"></i>
              Add to Cart
            </button>
            <button
              class="btn-secondary"
              :class="{ wishlisted: isWishlisted }"
              @click="() => book && wishlistStore.toggleWishlist(book.id)"
            >
              <i class="bi" :class="isWishlisted ? 'bi-heart-fill' : 'bi-heart'"></i>
              {{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-description {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding-top: 6rem;
  padding-bottom: 3rem;
}

.book-description-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.book-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

.book-image {
  position: relative;
}

.book-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.book-image img:hover {
  transform: scale(1.02);
}

.book-details {
  color: #ffffff;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.book-author {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.rating i {
  color: #ffd700;
}

.review-count {
  color: rgba(255, 255, 255, 0.5);
  margin-left: 0.25rem;
}

.category {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.price {
  font-size: 2rem;
  font-weight: 700;
  margin: 1.5rem 0;
  color: #ffffff;
}

.description {
  margin: 2rem 0;
}

.description h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.description p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(90deg, #007aff, #339af0);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-secondary.wishlisted {
  background: rgba(255, 64, 129, 0.2);
  border-color: rgba(255, 64, 129, 0.4);
}

.btn-secondary.wishlisted:hover {
  background: rgba(255, 64, 129, 0.3);
}

.btn-secondary.wishlisted i {
  color: #ff4081;
}

.error-message {
  text-align: center;
  color: #ff4081;
  background: rgba(255, 64, 129, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
}

/* Loading State Styles */
.loading-state .book-card {
  opacity: 0.7;
}

.skeleton {
  animation: pulse 1.5s infinite;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 2/3;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.skeleton-title {
  height: 2.5rem;
  width: 80%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.skeleton-author {
  height: 1.2rem;
  width: 40%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.skeleton-meta {
  height: 1rem;
  width: 60%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.skeleton-description {
  height: 8rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
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

@media (max-width: 768px) {
  .book-card {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem;
  }

  .book-image {
    max-width: 250px;
    margin: 0 auto;
  }

  .book-title {
    font-size: 2rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
