<script setup lang="ts">
import BookCard from './BookCard.vue'

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

defineProps<{
  books: Book[]
  loading?: boolean
}>()
</script>

<template>
  <div class="book-grid">
    <div v-if="loading" class="loading-grid">
      <div v-for="n in 6" :key="n" class="book-card-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-author"></div>
          <div class="skeleton-rating"></div>
          <div class="skeleton-price"></div>
        </div>
      </div>
    </div>
    <div v-else-if="books.length === 0" class="empty-grid">
      <div class="empty-state">
        <div class="empty-state-content">
          <div class="empty-state-icon">
            <i class="bi bi-book"></i>
          </div>
          <h2>No books found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    </div>
    <div v-else class="grid">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<style scoped>
.book-grid {
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 0.5rem;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 0.5rem;
}

.book-card-skeleton {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.skeleton-image {
  width: 100%;
  padding-top: 140%;
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 1.5s infinite;
}

.skeleton-content {
  padding: 1.5rem;
}

.skeleton-title {
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-author {
  height: 1rem;
  width: 60%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-rating {
  height: 1rem;
  width: 40%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-price {
  height: 1.5rem;
  width: 30%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.empty-grid {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state-content {
  text-align: center;
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
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .loading-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .loading-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
