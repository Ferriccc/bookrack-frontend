<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BookGrid from '@/components/BookGrid.vue'
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
}

const isLoading = ref(true)
const wishlistBooks = ref<Book[]>([])
const error = ref<string | null>(null)
const wishlistStore = useWishlistStore()
const currentSort = ref<'title' | 'rating' | 'price'>('title')

const sortedBooks = computed(() => {
  if (!wishlistBooks.value.length) return []

  return [...wishlistBooks.value].sort((a, b) => {
    switch (currentSort.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'rating':
        return b.rating - a.rating
      case 'price':
        return a.price - b.price
      default:
        return 0
    }
  })
})

async function fetchWishlistBooks() {
  isLoading.value = true
  error.value = null
  wishlistBooks.value = []

  try {
    const bookPromises = Array.from(wishlistStore.wishlistedBookIds).map((id) =>
      apiClient.fetch(API_ENDPOINTS.FETCH_BOOK(id)),
    )

    wishlistBooks.value = await Promise.all(bookPromises)
  } catch (err) {
    console.error('Error fetching wishlist books:', err)
    error.value = 'Failed to load your wishlist. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWishlistBooks()
})
</script>

<template>
  <div class="wishlist-page">
    <div class="wishlist-container">
      <div class="wishlist-header">
        <h1>Your Wishlist</h1>
        <p class="wishlist-subtitle">Books you've saved for later</p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="!isLoading && wishlistBooks.length === 0" class="empty-state">
        <i class="bi bi-heart text-muted"></i>
        <h2>Your wishlist is empty</h2>
        <p>Start adding books you love to your wishlist</p>
        <router-link to="/search" class="explore-btn">
          Explore Books
          <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>

      <template v-else>
        <div class="wishlist-stats">
          <span class="book-count">{{ wishlistBooks.length }} books</span>
          <div class="sort-filter">
            <select v-model="currentSort" class="sort-select">
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
        <BookGrid :books="sortedBooks" :loading="isLoading" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding-top: 6rem;
}

.wishlist-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.wishlist-header {
  text-align: center;
  margin-bottom: 3rem;
}

.wishlist-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.wishlist-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.wishlist-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.book-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.sort-filter {
  display: flex;
  gap: 1rem;
}

.sort-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='rgba(255,255,255,0.7)' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 0.75rem) center;
}

.sort-select:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.sort-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.sort-select option {
  background: rgb(28, 28, 28);
  color: rgba(255, 255, 255, 0.9);
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 2rem;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.explore-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
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

@media (max-width: 768px) {
  .wishlist-container {
    padding: 1rem;
  }

  .wishlist-stats {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
