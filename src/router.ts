import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import BookDescription from '@/components/BookDescription.vue'
import SearchPage from '@/components/SearchPage.vue'
import RecommendationPage from '@/components/RecommendationPage.vue'
import WishlistPage from '@/components/WishlistPage.vue'
import CartPage from '@/components/CartPage.vue'
import MyBooks from '@/components/MyBooks.vue'
const routes = [
  { path: '/', component: LandingPage },
  { path: '/search', component: SearchPage, name: 'search' },
  { path: '/recommendations', component: RecommendationPage, name: 'recommendations' },
  { path: '/wishlist', component: WishlistPage, name: 'wishlist' },
  { path: '/cart', component: CartPage, name: 'cart' },
  { path: '/book/:id', component: BookDescription, name: 'BookDescription' },
  { path: '/mybooks', component: MyBooks, name: 'mybooks' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
