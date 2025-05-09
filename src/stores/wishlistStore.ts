import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

export const useWishlistStore = defineStore('wishlistStore', () => {
  const wishlistedBookIds = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function toggleWishlist(id: string) {
    try {
      if (wishlistedBookIds.value.has(id)) {
        await removeFromWishlist(id)
      } else {
        await addToWishlist(id)
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err)
      error.value = 'Failed to update wishlist. Please try again.'
      throw err
    }
  }

  async function addToWishlist(id: string) {
    try {
      const res = await fetch(API_ENDPOINTS.ADD_TO_WISHLIST(id), {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to add to wishlist')
      }
      wishlistedBookIds.value.add(id)
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
      error.value = 'Failed to add to wishlist. Please try again.'
      throw err
    }
  }

  async function removeFromWishlist(id: string) {
    try {
      const res = await fetch(API_ENDPOINTS.REMOVE_FROM_WISHLIST(id), {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to remove from wishlist')
      }
      wishlistedBookIds.value.delete(id)
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
      error.value = 'Failed to remove from wishlist. Please try again.'
      throw err
    }
  }

  async function updateStore() {
    isLoading.value = true
    error.value = null
    try {
      const data = await apiClient.fetch(API_ENDPOINTS.FETCH_WISHLIST)
      wishlistedBookIds.value.clear()
      for (const book of data) {
        wishlistedBookIds.value.add(book.book_id)
      }
    } catch (err) {
      console.error('Failed to update wishlist store:', err)
      error.value = 'Failed to fetch wishlist. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    wishlistedBookIds,
    isLoading,
    error,
    toggleWishlist,
    updateStore,
  }
})
