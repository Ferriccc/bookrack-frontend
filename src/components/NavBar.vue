<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { API_ENDPOINTS } from '@/config/api'

const isSignedIn = ref(false)
const userName = ref('')
const isAuthLoading = ref(true)

const router = useRouter()
const route = useRoute()

function handleGoogleSignIn() {
  window.location.href = API_ENDPOINTS.AUTH.LOGIN_GOOGLE
}

async function handleLogout() {
  try {
    fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      window.location.href = '/'
    })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

async function checkAuth() {
  isAuthLoading.value = true
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.ME, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Not authenticated')
    }

    const data = await response.json()
    isSignedIn.value = true
    userName.value = data.name || 'User'
  } catch (error) {
    console.error('Auth check failed:', error)
    isSignedIn.value = false
    userName.value = ''
    // Clear any stale state if auth check fails
    localStorage.clear()
    sessionStorage.clear()
  } finally {
    isAuthLoading.value = false
  }
}

// Prevent auto-login after mount if logout was recent
onMounted(() => {
  checkAuth()
  // const lastLogoutTime = localStorage.getItem('lastLogoutTime')
  // const currentTime = new Date().getTime()

  // // Only check auth if no recent logout (within last 2 seconds)
  // if (!lastLogoutTime || currentTime - parseInt(lastLogoutTime) > 2000) {
  //   checkAuth()
  // }

  // // Check if we're returning from OAuth
  // const urlParams = new URLSearchParams(window.location.search)
  // if (urlParams.has('auth_success')) {
  //   checkAuth()
  // }
})

// Compute which tab is active based on route
const activeTab = computed(() => {
  if (route.path === '/' || route.name === 'CoverPage') return 'home'
  if (route.path.startsWith('/wishlist')) return 'wishlist'
  if (route.path.startsWith('/mybooks')) return 'mybooks'
  return ''
})

// Optional: react to route changes if needed
watch(route, () => {}, { immediate: true })
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-blur notch-navbar fixed-top d-flex justify-content-center"
  >
    <div class="container notch-inner mx-3">
      <a class="navbar-brand fw-bold d-flex align-items-center" href="#">
        <img src="/logo_text.png" alt="BookRack" class="navbar-logo me-2" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0 align-items-center">
          <li class="nav-item">
            <a
              class="nav-link nav-accent"
              :class="{ active: activeTab === 'home' }"
              aria-current="page"
              href="#"
              @click.prevent="router.push('/')"
              >Home</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link nav-accent"
              :class="{ active: activeTab === 'wishlist' }"
              href="#"
              @click.prevent="router.push('/wishlist')"
              >Wishlist</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link nav-accent"
              :class="{ active: activeTab === 'mybooks' }"
              href="#"
              @click.prevent="router.push('/mybooks')"
              >My Books</a
            >
          </li>

          <!-- Auth Loading State -->
          <li class="nav-item" v-if="isAuthLoading">
            <span class="nav-link">
              <i class="bi bi-arrow-repeat spinning me-2"></i>
            </span>
          </li>

          <!-- Signed In State -->
          <li class="nav-item dropdown" v-else-if="isSignedIn">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="profileDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-2"></i>
              <span>{{ userName }}</span>
            </a>
            <div class="dropdown-backdrop"></div>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <a class="dropdown-item" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Logout
                </a>
              </li>
            </ul>
          </li>

          <!-- Signed Out State -->
          <li class="nav-item" v-else>
            <a
              class="nav-link d-flex align-items-center"
              href="#"
              @click.prevent="handleGoogleSignIn"
            >
              <i class="bi bi-google me-2"></i>
              <span>Sign In with Google</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://vercel.com/font/geist-sans');

.navbar-blur {
  background: transparent;
  border-bottom: none;
}

.notch-navbar {
  width: 100%;
  background: transparent;
  padding-top: 1rem;
  position: fixed;
  top: 0;
  z-index: 1000;
  margin: 0;
}

.notch-inner {
  background: rgba(18, 18, 18, 0.95);
  border-radius: 8px;
  padding: 0.75rem 2rem;
  max-width: 1400px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}

.navbar-brand {
  font-weight: bold;
  color: white;
}

.navbar-logo {
  height: 32px;
  width: auto;
  filter: brightness(1);
  transition: filter 0.2s ease;
}

.navbar-brand:hover .navbar-logo {
  filter: brightness(1.1);
}

.navbar-brand {
  font-weight: bold;
  letter-spacing: -0.02em;
  color: #ffffff;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-logo {
  height: 1.75rem;
  width: auto;
  display: inline-block;
  filter: brightness(0) invert(1);
}

.brand-text {
  font-family:
    'Geist Sans',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-top: 2px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem !important;
  margin: 0 0.2rem;
  position: relative;
  outline: none !important;
}

.nav-link:focus {
  outline: none !important;
  box-shadow: none !important;
}

.nav-accent {
  color: rgba(255, 255, 255, 0.7) !important;
}

.nav-accent.active,
.nav-accent.active:focus,
.nav-accent.active:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-weight: 500;
}

.nav-accent.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #ffffff;
  border-radius: 2px;
}

.nav-accent:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.7%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.dropdown {
  position: relative;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: none;
}

.dropdown.show .dropdown-backdrop {
  display: block;
}

.dropdown-menu {
  background: rgba(18, 18, 18, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

@media (max-width: 992px) {
  .notch-inner {
    padding: 0.75rem 1rem;
    margin: 0 1rem;
    border-radius: 8px;
  }

  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgb(24, 24, 24);
    border-radius: 8px;
    padding: 1rem;
    margin: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .nav-link {
    padding: 0.75rem 1rem !important;
    margin: 0.25rem 0;
  }

  .nav-accent.active::after {
    display: none;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}
</style>
