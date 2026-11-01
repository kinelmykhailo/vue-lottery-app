<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const technologies = [
  { name: 'Vue 3', desc: 'Composition API, <script setup lang="ts">, реактивні рефи та обчислювані властивості' },
  { name: 'Vue Router 4', desc: 'SPA-маршрутизація, динамичні параметри (/users/:id), вкладені маршрути (/edit), navigation guards, meta-поля' },
  { name: 'Pinia', desc: 'Централізоване керування станом користувачів, лотереї та JWT-авторизації' },
  { name: 'TypeScript', desc: 'Сувора типізація моделей, DTO, інтерфейсів та HTTP-клієнта' },
  { name: 'Repository Pattern', desc: 'Відокремлення логіки доступу до даних (Readable, Creatable, Editable, Deletable, ServiceProvider)' },
  { name: 'VeeValidate + Yup', desc: 'Декларативна валідація форм реєстрації, редагування та входу з детальними помилками' },
  { name: 'DummyJSON REST API', desc: 'Інтеграція з REST API (користувачі, JWT-авторизація, пагінація, пошук та імітація мутацій)' },
  { name: 'SCSS & Bootstrap 5', desc: 'Модульний імпорт необхідних SCSS-партіалів без зайвого CSS' }
]

const features = [
  {
    title: 'Управління користувачами',
    description: 'Отримання списку з DummyJSON REST API, пагінація, пошук з синхронізацією у URL query (/users?page=1&q=...).'
  },
  {
    title: 'Динамічні та вкладені маршрути',
    description: 'Детальний профіль користувача (/users/:id) та вкладений маршрут редагування (/users/:id/edit).'
  },
  {
    title: 'JWT Авторизація',
    description: 'Вхід за JWT, захист маршрутів Navigation Guards, автооновлення токена через refresh interceptor.'
  },
  {
    title: 'Модуль розіграшу (Lottery)',
    description: 'Випадковий вибір до 3 переможців серед завантажених користувачів з можливістю видалення.'
  }
]
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="p-5 mb-4 bg-white rounded-3 shadow-sm border text-center hero-banner">
      <div class="container-fluid py-3">
        <div class="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
          Лабораторна робота №5 • Vue Router & Repository Pattern
        </div>
        <h1 class="display-5 fw-bold text-dark mb-3">
          Vue <span class="text-primary">Lottery App</span>
        </h1>
        <p class="col-md-9 mx-auto fs-5 text-muted mb-4">
          Сучасний односторінковий додаток (SPA) на базі Vue 3, TypeScript та Vue Router з використанням
          патерну Repository, JWT-авторизації та REST API.
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <RouterLink
            :to="authStore.isAuthenticated ? '/users' : '/login'"
            class="btn btn-primary btn-lg px-4 gap-3 fw-medium"
          >
            {{ authStore.isAuthenticated ? 'Перейти до учасників' : 'Увійти до системи' }} →
          </RouterLink>
          <a
            href="https://github.com/kinelmykhailo/vue-lottery-app"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline-secondary btn-lg px-4 fw-medium d-inline-flex align-items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            GitHub репозиторій
          </a>
        </div>
      </div>
    </div>

    <!-- Capabilities / Features Grid -->
    <div class="row g-4 mb-4">
      <div v-for="(feat, index) in features" :key="index" class="col-md-6">
        <div class="card h-100 border-0 shadow-sm p-4">
          <div class="d-flex align-items-center mb-2">
            <span class="feature-number me-2">{{ index + 1 }}</span>
            <h5 class="card-title mb-0 fw-bold">{{ feat.title }}</h5>
          </div>
          <p class="card-text text-muted">{{ feat.description }}</p>
        </div>
      </div>
    </div>

    <!-- Technologies Section -->
    <div class="card border-0 shadow-sm p-4 mb-4">
      <h3 class="fw-bold mb-3 text-dark">Стек технологій</h3>
      <div class="row g-3">
        <div v-for="tech in technologies" :key="tech.name" class="col-md-6">
          <div class="p-3 border rounded-3 bg-light h-100">
            <div class="fw-bold text-primary mb-1">{{ tech.name }}</div>
            <div class="text-secondary small">{{ tech.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero-banner {
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
}

.feature-number {
  width: 28px;
  height: 28px;
  background-color: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
}
</style>
