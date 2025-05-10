<template>
  <div class="book-card">
    <router-link :to="`/book/${book.id}`" class="book-link">
      <div class="book-image">
        <img :src="book.image_url" :alt="book.title" loading="lazy" @error="handleImageError" />
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
import { ref } from 'vue'

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

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/placeholder-book.jpg'
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
}

.book-author {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
