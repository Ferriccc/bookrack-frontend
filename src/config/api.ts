const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
}

// API Endpoints
export const API_ENDPOINTS = {
  SEARCH: (searchQuery?: string, maxPrice?: number) =>
    `${API_CONFIG.BASE_URL}/api/search/${encodeURIComponent(searchQuery || '0')}/upper_price${maxPrice ? `/${maxPrice}` : ''}`,
  SUGGEST: () => `${API_CONFIG.BASE_URL}/api/suggest`,
  FETCH_WISHLIST: `${API_CONFIG.BASE_URL}/api/fetch/wishlist`,
  ADD_TO_WISHLIST: (id: string | number) => `${API_CONFIG.BASE_URL}/api/add/wishlist/${id}`,
  REMOVE_FROM_WISHLIST: (id: string | number) => `${API_CONFIG.BASE_URL}/api/remove/wishlist/${id}`,
  FETCH_BOOK: (id: string | number) => `${API_CONFIG.BASE_URL}/api/fetch/book/${id}`,
  CHAT: (query: string, bookId?: string | number) =>
    `${API_CONFIG.BASE_URL}/api/chat/query/${encodeURIComponent(query)}/book_id${bookId ? `/${bookId}` : ''}`,
  AUTH: {
    ME: `${API_CONFIG.BASE_URL}/api/me`,
    LOGIN_GOOGLE: `${API_CONFIG.BASE_URL}/api/login/google`,
    LOGOUT: `${API_CONFIG.BASE_URL}/api/logout`,
  },
}

// API Client with common configuration
export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include', // Always include credentials
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  },
}
