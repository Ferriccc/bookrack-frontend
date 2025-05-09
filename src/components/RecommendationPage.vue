<script setup lang="ts">
import { ref, computed } from 'vue'
import BookGrid from '@/components/BookGrid.vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

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
const recommendations = ref<Book[]>([])
const selectedTag = ref('All')
const maxPrice = ref(5000)
const error = ref<string | null>(null)

const availableTags = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Art & Design']

const filteredRecommendations = computed(() => {
  let filtered = recommendations.value

  if (selectedTag.value !== 'All') {
    filtered = filtered.filter((book) => book.tags.includes(selectedTag.value))
  }

  filtered = filtered.filter((book) => book.price <= maxPrice.value)
  return filtered
})

async function fetchRecommendations() {
  isLoading.value = true
  error.value = null

  try {
    const endpoint = API_ENDPOINTS.SUGGEST()
    const data = await apiClient.fetch(endpoint)
    recommendations.value = data
  } catch (err) {
    console.error('Error fetching recommendations:', err)
    error.value = 'Failed to load recommendations. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Fetch recommendations when component mounts
fetchRecommendations()
</script>

<template>
  <div class="recommendation-page">
    <div class="recommendation-container">
      <div class="recommendation-header">
        <h1>Curated For You</h1>
        <p class="recommendation-subtitle">
          Personalized book recommendations based on your interests
        </p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <template v-else>
        <div class="filters-section">
          <div class="categories-nav">
            <button
              v-for="tag in availableTags"
              :key="tag"
              class="category-btn"
              :class="{ active: selectedTag === tag }"
              @click="selectedTag = tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <BookGrid :books="filteredRecommendations" :loading="isLoading" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.recommendation-page {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding-top: 6rem;
}

.recommendation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.recommendation-header {
  text-align: center;
  margin-bottom: 3rem;
}

.recommendation-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.recommendation-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.categories-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.category-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover,
.category-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.filters-section {
  margin-bottom: 3rem;
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
  .recommendation-container {
    padding: 1rem;
  }

  .categories-nav {
    padding: 0 1rem;
  }
}
</style>
