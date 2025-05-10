import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

export const useCartStore = defineStore('cartStore', () => {
  const cartItems = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function toggleCart(id: string) {
    try {
      if (cartItems.value.has(id)) {
        await removeFromCart(id)
      } else {
        await addToCart(id)
      }
    } catch (err) {
      console.error('Failed to toggle cart:', err)
      error.value = 'Failed to update cart. Please try again.'
      throw err
    }
  }

  async function addToCart(id: string) {
    try {
      const res = await fetch(API_ENDPOINTS.ADD_TO_CART(id), {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to add to cart')
      }
      cartItems.value.add(id)
    } catch (err) {
      console.error('Failed to add to cart:', err)
      error.value = 'Failed to add to cart. Please try again.'
      throw err
    }
  }

  async function removeFromCart(id: string) {
    try {
      const res = await fetch(API_ENDPOINTS.REMOVE_FROM_CART(id), {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to remove from cart')
      }
      cartItems.value.delete(id)
    } catch (err) {
      console.error('Failed to remove from cart:', err)
      error.value = 'Failed to remove from cart. Please try again.'
      throw err
    }
  }

  async function updateStore() {
    isLoading.value = true
    error.value = null
    try {
      const data = await apiClient.fetch(API_ENDPOINTS.FETCH_CART)
      cartItems.value.clear()
      for (const book of data) {
        cartItems.value.add(book.book_id)
      }
    } catch (err) {
      console.error('Failed to update cart store:', err)
      error.value = 'Failed to fetch cart. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    cartItems,
    isLoading,
    error,
    toggleCart,
    updateStore,
  }
})
