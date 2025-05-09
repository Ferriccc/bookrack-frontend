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
  <div class="books-grid">
    <template v-if="loading">
      <div v-for="n in 8" :key="n" class="book-skeleton">
        <div class="skeleton-cover"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-author"></div>
          <div class="skeleton-meta"></div>
          <div class="skeleton-price"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </template>
  </div>
</template>

<style scoped>
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

@media (min-width: 640px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
  }
}

/* Skeleton Loading Animation */
.book-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-cover {
  aspect-ratio: 2/3;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-title {
  height: 1rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-author {
  height: 0.875rem;
  width: 70%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-meta {
  height: 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  margin-top: 0.5rem;
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
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
