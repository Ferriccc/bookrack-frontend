import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

export const useBoughtStore = defineStore('boughtStore', () => {
  const boughtItems = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function updateStore() {
    isLoading.value = true
    error.value = null
    try {
      const data = await apiClient.fetch(API_ENDPOINTS.FETCH_BOUGHT)
      boughtItems.value.clear()
      for (const book of data) {
        boughtItems.value.add(book.book_id)
      }
    } catch (err) {
      console.error('Failed to update bought store:', err)
      error.value = 'Failed to fetch bought. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    boughtItems,
    isLoading,
    error,
    updateStore,
  }
})
