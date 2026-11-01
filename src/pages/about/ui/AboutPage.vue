<script setup lang="ts">
const skillCategories = [
  {
    category: 'Frontend розробка',
    items: ['Vue 3 (Composition API)', 'TypeScript', 'Vue Router 4', 'Pinia', 'JavaScript (ES6+)', 'HTML5 & SCSS', 'Bootstrap 5']
  },
  {
    category: 'Архітектура та патерни',
    items: ['Repository Pattern', 'Service Provider / Factory', 'Single Page Application (SPA)', 'RESTful API Integration', 'JWT Authentication & Refresh Interceptor']
  },
  {
    category: 'Інструменти та валідація',
    items: ['Vite', 'VeeValidate', 'Yup', 'ESLint & Prettier', 'Git & GitHub', 'GitHub Pages (CI/CD)']
  }
]
</script>

<template>
  <div class="about-view">
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm p-4 text-center h-100">
          <div class="avatar-placeholder mx-auto mb-3 text-white fw-bold d-flex align-items-center justify-content-center">
            КМ
          </div>
          <h4 class="fw-bold mb-1">Кінель Михайло</h4>
          <p class="text-muted mb-3">Студент • Frontend-розробник</p>
          <div class="badge bg-primary-subtle text-primary mb-4 p-2 rounded">
            Чернівецький національний університет імені Юрія Федьковича
          </div>

          <div class="d-grid gap-2">
            <a
              href="https://github.com/kinelmykhailo"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-dark d-flex align-items-center justify-content-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub Профіль
            </a>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-sm p-4 h-100">
          <h3 class="fw-bold mb-3 text-dark">Про автора</h3>
          <p class="text-secondary mb-4">
            Виконавець лабораторної роботи №5 «Керування маршрутами з використанням vue-router».
            Проєкт демонструє використання архітектурного патерну Repository для абстракції джерел
            даних REST API (DummyJSON), організацію Single Page Application за допомогою Vue Router 4,
            керування станом через Pinia та авторизацію за допомогою JSON Web Tokens (JWT).
          </p>

          <h4 class="fw-bold mb-3 text-dark">Technical Skills</h4>
          <div class="row g-3">
            <div v-for="cat in skillCategories" :key="cat.category" class="col-12">
              <div class="p-3 border rounded-3 bg-light">
                <h6 class="fw-bold text-primary mb-2">{{ cat.category }}</h6>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="item in cat.items"
                    :key="item"
                    class="badge bg-white text-dark border px-2 py-1 fw-normal"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  font-size: 2rem;
  letter-spacing: 1px;
}
</style>
