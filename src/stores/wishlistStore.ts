import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

export const useWishlistStore = defineStore('wishlistStore', () => {
  const wishlistedBookIds = ref<Set<string | number>>(new Set())

  async function toggleWishlist(id: string | number) {
    if (wishlistedBookIds.value.has(id)) {
      console.log(`Removing ${id} from wishlist`)
      removeFromWishlist(id)
    } else {
      addToWishlist(id)
    }
  }

  async function addToWishlist(id: string | number) {
    const res = await fetch(API_ENDPOINTS.ADD_TO_WISHLIST(id), {
      credentials: 'include',
    })
    if (res.ok) {
      wishlistedBookIds.value.add(id)
    }
  }

  async function removeFromWishlist(id: string | number) {
    const res = await fetch(API_ENDPOINTS.REMOVE_FROM_WISHLIST(id), {
      credentials: 'include',
    })
    console.log(res)

    if (res.ok) {
      wishlistedBookIds.value.delete(id)
    }
  }

  async function updateStore() {
    const data = await apiClient.fetch(API_ENDPOINTS.FETCH_WISHLIST)
    for (const book_id of data) {
      wishlistedBookIds.value.add(book_id.book_id)
    }
  }

  return { wishlistedBookIds, toggleWishlist, updateStore }
})
