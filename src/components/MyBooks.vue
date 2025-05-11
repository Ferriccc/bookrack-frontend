<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BookGrid from '@/components/BookGrid.vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'
import { useBoughtStore } from '@/stores/boughtStore'

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
const boughtBooks = ref<Book[]>([])
const error = ref<string | null>(null)
const boughtStore = useBoughtStore()
const currentSort = ref<'title' | 'rating' | 'price'>('title')

const sortedBooks = computed(() => {
  if (!boughtBooks.value.length) return []

  return [...boughtBooks.value].sort((a, b) => {
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

const handleSort = () => {
  // The sorting is handled by the computed property
  // This method exists to handle the change event
}

async function fetchBoughtBooks() {
  isLoading.value = true
  error.value = null
  boughtBooks.value = []
  boughtStore.updateStore()

  try {
    const bookPromises = Array.from(boughtStore.boughtItems).map((id) =>
      apiClient.fetch(API_ENDPOINTS.FETCH_BOOK(id)),
    )

    boughtBooks.value = await Promise.all(bookPromises)
  } catch (err) {
    console.error('Error fetching bought books:', err)
    error.value = 'Failed to load your bought books. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBoughtBooks()
})
</script>

<template>
  <div class="bought-page">
    <div class="bought-container">
      <div class="bought-header">
        <h1>Your Bought</h1>
        <p class="bought-subtitle">Books you have bought</p>
      </div>

      <div v-if="error" class="error-message">
        <i class="bi bi-exclamation-circle"></i>
        {{ error }}
      </div>

      <div v-else-if="!isLoading && boughtBooks.length === 0" class="empty-state">
        <div class="empty-state-content">
          <div class="empty-state-icon">
            <i class="bi bi-heart"></i>
          </div>
          <h2>Your bought is empty</h2>
          <p>Start buying books</p>
          <router-link to="/search" class="explore-btn">
            Explore Books
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <template v-else>
        <div class="bought-content">
          <div class="bought-stats">
            <span class="book-count">{{ boughtBooks.length }} books</span>
            <div class="sort-controls">
              <label for="sort-select">Sort by:</label>
              <select
                id="sort-select"
                v-model="currentSort"
                class="sort-select"
                @change="handleSort"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          <BookGrid :books="sortedBooks" :loading="isLoading" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.bought-page {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding: 6rem 1rem 3rem;
}

.bought-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.bought-header {
  text-align: center;
  margin-bottom: 3rem;
}

.bought-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bought-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.bought-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bought-stats {
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

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-controls label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.sort-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sort-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

.empty-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.empty-state-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.empty-state-icon i {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state h2 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
  font-weight: 500;
}

.explore-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.error-message {
  text-align: center;
  color: #ff4081;
  background: rgba(255, 64, 129, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.error-message i {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .bought-page {
    padding: 6rem 2rem 3rem;
  }

  .bought-container {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .bought-page {
    padding: 6rem 3rem 3rem;
  }

  .bought-container {
    padding: 0 3rem;
  }
}
</style>
