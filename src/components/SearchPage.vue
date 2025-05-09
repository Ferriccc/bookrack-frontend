<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BookGrid from './BookGrid.vue'
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

const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<Book[]>([])
const maxPrice = ref(5000)

const handleSearch = async () => {
  isSearching.value = true
  searchResults.value = []

  try {
    const endpoint = API_ENDPOINTS.SEARCH(searchQuery.value, maxPrice.value)
    const data = await apiClient.fetch(endpoint)
    searchResults.value = data
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  await handleSearch()
})
</script>

<template>
  <div class="search-page">
    <div class="search-container">
      <div class="search-header">
        <h1>Find Your Next Book</h1>
        <p class="search-subtitle">Search through millions of books in our collection</p>
      </div>

      <div class="search-filters">
        <div class="search-box-container">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by title, author, or ISBN..."
              @keyup.enter="handleSearch"
              class="search-input"
            />
            <button class="search-button" @click="handleSearch" :disabled="isSearching">
              <span v-if="!isSearching">Search</span>
              <span v-else>Searching...</span>
            </button>
          </div>
        </div>

        <div class="price-filter">
          <div class="price-filter-header">
            <span>Max Price: ₹{{ maxPrice }}</span>
          </div>
          <input
            type="range"
            v-model="maxPrice"
            min="1000"
            max="5000"
            step="5"
            class="price-slider"
            @change="handleSearch"
          />
          <div class="price-range-labels">
            <span>₹1000</span>
            <span>₹5000</span>
          </div>
        </div>
      </div>

      <div class="search-results">
        <div v-if="searchResults.length > 0" class="results-info">
          <span>{{ searchQuery ? 'Found' : 'Showing' }} {{ searchResults.length }} books</span>
        </div>
        <BookGrid :books="searchResults" :loading="isSearching" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding-top: 6rem;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.search-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.search-box-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.search-icon {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  margin: 0 1rem;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.1rem;
  padding: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.search-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  color: rgba(255, 255, 255, 0.7);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .search-container {
    padding: 1rem;
  }

  .search-box {
    flex-direction: column;
    padding: 1rem;
  }

  .search-input {
    width: 100%;
    margin: 0.5rem 0;
  }

  .search-button {
    width: 100%;
    margin-top: 0.5rem;
  }
}

.search-results {
  margin-top: 3rem;
}

.results-info {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.search-filters {
  max-width: 800px;
  margin: 0 auto;
}

.price-filter {
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 0 1rem;
}

.price-filter-header {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.price-slider {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  -webkit-appearance: none;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.price-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.price-range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .price-filter {
    max-width: 100%;
  }

  .search-filters {
    padding: 0 1rem;
  }
}
</style>
