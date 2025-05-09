import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'

// Disable Vue Devtools in production
const app = createApp(App)
if (import.meta.env.PROD) {
  // @ts-expect-error - devtools config is available but not typed
  app.config.devtools = false
}

app.use(createPinia())
app.use(router)
app.mount('#app')
