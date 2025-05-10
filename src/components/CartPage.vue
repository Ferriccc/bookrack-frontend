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
        {{ error }}
      </div>

      <div v-else-if="!isLoading && cartBooks.length === 0" class="empty-state">
        <i class="bi bi-cart text-muted"></i>
        <h2>Your cart is empty</h2>
        <p>Start adding books to your cart</p>
        <router-link to="/search" class="explore-btn">
          Explore Books
          <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>

      <template v-else>
        <div class="cart-content">
          <div class="cart-books">
            <div class="cart-stats">
              <span class="book-count">{{ cartBooks.length }} books</span>
            </div>
            <BookGrid :books="cartBooks" :loading="isLoading" />
          </div>

          <div class="cart-summary">
            <div class="summary-card">
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>₹{{ totalPrice.toFixed(2) }}</span>
              </div>
              <button
                class="checkout-btn"
                @click="handleCheckout"
                :disabled="isLoading || cartBooks.length === 0"
              >
                <i class="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </button>
            </div>
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
  padding-top: 6rem;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cart-header h1 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-books {
  flex: 1;
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

.cart-summary {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
}

.summary-card h2 {
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.summary-row.total {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(90deg, #007aff, #339af0);
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .cart-container {
    padding: 1rem;
  }

  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    margin-top: 2rem;
  }
}
</style>
