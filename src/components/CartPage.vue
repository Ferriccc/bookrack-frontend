<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BookGrid from '@/components/BookGrid.vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'
import { useCartStore } from '@/stores/cartStore'
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
const cartBooks = ref<Book[]>([])
const error = ref<string | null>(null)
const cartStore = useCartStore()
const boughtStore = useBoughtStore()

const totalPrice = computed(() => {
  return cartBooks.value.reduce((total, book) => total + book.price, 0)
})

async function fetchCartBooks() {
  isLoading.value = true
  error.value = null
  cartBooks.value = []

  try {
    const bookPromises = Array.from(cartStore.cartItems).map((id) =>
      apiClient.fetch(API_ENDPOINTS.FETCH_BOOK(id)),
    )

    cartBooks.value = await Promise.all(bookPromises)
  } catch (err) {
    console.error('Error fetching cart books:', err)
    error.value = 'Failed to load your cart. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

async function handleCheckout() {
  try {
    isLoading.value = true
    error.value = null

    // Call the checkout endpoint
    const response = await fetch(API_ENDPOINTS.CHECKOUT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Checkout failed')
    }

    // Refresh both stores
    await Promise.all([cartStore.updateStore(), boughtStore.updateStore()])

    // Refresh the cart view
    await fetchCartBooks()
  } catch (err) {
    console.error('Error during checkout:', err)
    error.value = 'Failed to complete checkout. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchCartBooks()
})
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h1>Your Cart</h1>
        <p class="cart-subtitle">Books ready for checkout</p>
      </div>

      <div v-if="error" class="error-message">
        <i class="bi bi-exclamation-circle"></i>
        {{ error }}
      </div>

      <div v-else-if="!isLoading && cartBooks.length === 0" class="empty-state">
        <div class="empty-state-content">
          <div class="empty-state-icon">
            <i class="bi bi-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Start adding books to your cart</p>
          <router-link to="/search" class="explore-btn">
            Explore Books
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <template v-else>
        <div class="cart-content">
          <div class="cart-books">
            <div class="cart-stats">
              <span class="book-count">{{ cartBooks.length }} books</span>
            </div>
            <BookGrid :books="cartBooks" :loading="isLoading" />
          </div>
        </div>
        <div v-if="cartBooks.length > 0" class="cart-summary-bar">
          <div class="summary-bar-content">
            <div class="summary-bar-section">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">₹{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-bar-section">
              <span class="summary-label">Shipping</span>
              <span class="summary-value">Free</span>
            </div>
            <div class="summary-bar-section total">
              <span class="summary-label">Total</span>
              <span class="summary-value">₹{{ totalPrice.toFixed(2) }}</span>
            </div>
            <button
              class="checkout-btn"
              @click="handleCheckout"
              :disabled="isLoading || cartBooks.length === 0"
            >
              <i class="bi bi-credit-card"></i>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: rgb(18, 18, 18);
  padding: 6rem 1rem 3rem;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cart-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-books {
  flex: 1 1 0;
  min-width: 0;
}

.cart-stats {
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

.cart-summary-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 18, 18, 0.98);
  box-shadow: 0 -2px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  padding: 1rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
}

.summary-bar-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  justify-content: space-between;
}

.summary-bar-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 90px;
}

.summary-bar-section.total {
  font-weight: 700;
  color: #fff;
}

.summary-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.summary-value {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.checkout-btn {
  background: linear-gradient(90deg, #007aff, #339af0);
  color: #fff;
  border: none;
  padding: 0.9rem 2.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
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
  .cart-page {
    padding: 6rem 2rem 3rem;
  }
  .cart-container {
    padding: 0 2rem;
  }
  .summary-bar-content {
    gap: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .cart-page {
    padding: 6rem 3rem 3rem;
  }
  .cart-container {
    padding: 0 3rem;
  }
  .summary-bar-content {
    max-width: 1000px;
  }
}
</style>
