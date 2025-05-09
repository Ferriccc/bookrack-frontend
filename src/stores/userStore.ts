import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_ENDPOINTS, apiClient } from '@/config/api'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(true)

  async function checkAuth() {
    try {
      const data = await apiClient.fetch(API_ENDPOINTS.AUTH.ME)
      user.value = data
    } catch (error) {
      console.error('Auth check failed:', error)
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  function signInWithGoogle() {
    window.location.href = API_ENDPOINTS.AUTH.LOGIN_GOOGLE
  }

  function signOut() {
    user.value = null
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  }

  return {
    user,
    isLoading,
    checkAuth,
    signInWithGoogle,
    signOut,
  }
})
