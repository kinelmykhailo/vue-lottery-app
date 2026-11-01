import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app/App.vue'
import router from '@/app/providers/router'
import { registerServices } from '@/app/providers/services'
import '@/app/styles/main.scss'

// Register services in ServiceProvider registry (FSD architecture)
registerServices()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
