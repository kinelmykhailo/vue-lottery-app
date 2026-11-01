import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app/App.vue'
import router from '@/app/providers/router'
import '@/app/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
