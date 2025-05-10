<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { API_ENDPOINTS, apiClient } from '@/config/api'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'

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
const cartStore = useCartStore()

const isWishlisted = computed(
  () => book.value && wishlistStore.wishlistedBookIds.has(book.value.id),
)

const isInCart = computed(() => book.value && cartStore.cartItems.has(book.value.id))

async function fetchBookDetails(id: string) {
  isLoading.value = true
  error.value = null
  try {
    const data = await apiClient.fetch(API_ENDPOINTS.FETCH_BOOK(id))
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

async function handleCartToggle() {
  if (!book.value) return

  try {
    await cartStore.toggleCart(book.value.id)
  } catch (err) {
    console.error('Failed to update cart:', err)
    error.value = 'Failed to update cart. Please try again later.'
  }
}

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
          <img :src="book.image_url" :alt="book.title" loading="lazy" />
          <div class="image-overlay"></div>
        </div>
        <div class="book-details">
          <div class="book-header">
            <h1 class="book-title">{{ book.title }}</h1>
            <p class="book-author">by {{ book.author }}</p>
          </div>

          <div class="book-meta">
            <div class="rating">
              <i class="bi bi-star-fill"></i>
              <span>{{ book.rating.toFixed(1) }}</span>
              <span class="review-count">({{ book.review_count }} reviews)</span>
            </div>
            <div class="tags">
              <span v-for="tag in book.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>

          <div class="price">₹{{ book.price }}</div>

          <div class="description">
            <h2>About this book</h2>
            <p>{{ book.description || 'No description available.' }}</p>
          </div>

          <div class="actions">
            <button class="btn-primary" :class="{ 'in-cart': isInCart }" @click="handleCartToggle">
              <i class="bi" :class="isInCart ? 'bi-cart-check' : 'bi-cart-plus'"></i>
              {{ isInCart ? 'Remove from Cart' : 'Add to Cart' }}
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
  padding: 6rem 1rem 3rem;
}

.book-description-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.book-card {
  display: grid;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.book-image {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  aspect-ratio: 2/3;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-image:hover img {
  transform: scale(1.05);
}

.book-image:hover .image-overlay {
  opacity: 1;
}

.book-details {
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-header {
  margin-bottom: 0.5rem;
}

.book-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.book-author {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.rating i {
  color: #ffd700;
}

.review-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.description {
  margin: 1rem 0;
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
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(90deg, #007aff, #339af0);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.btn-primary.in-cart {
  background: linear-gradient(90deg, #28a745, #34c759);
}

.btn-primary.in-cart:hover {
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
  border-radius: 12px;
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
  max-width: 300px;
  aspect-ratio: 2/3;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin: 0 auto;
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

@media (min-width: 768px) {
  .book-description {
    padding: 6rem 2rem 3rem;
  }

  .book-description-container {
    padding: 0 2rem;
  }

  .book-card {
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    padding: 2rem;
  }

  .book-image {
    margin: 0;
  }

  .actions {
    flex-direction: row;
  }

  .btn-primary,
  .btn-secondary {
    width: auto;
    flex: 1;
  }
}

@media (min-width: 1024px) {
  .book-description {
    padding: 6rem 3rem 3rem;
  }

  .book-description-container {
    padding: 0 3rem;
  }

  .book-card {
    padding: 3rem;
  }
}
</style>
