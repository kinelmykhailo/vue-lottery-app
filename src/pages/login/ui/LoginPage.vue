<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const schema = yup.object({
  username: yup.string().required("Ім'я користувача (username) є обов'язковим"),
  password: yup
    .string()
    .required("Пароль є обов'язковим")
    .min(6, 'Пароль має містити щонайменше 6 символів')
})

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: ''
  }
})

const [username, usernameProps] = defineField('username')
const [password, passwordProps] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login({
      username: values.username,
      password: values.password
    })

    const redirect = (route.query.redirect as string) || '/users'
    router.push(redirect)
  } catch {
    // Error is handled in store and displayed below
  }
})

function fillTestCredentials(): void {
  setValues({
    username: 'emilys',
    password: 'emilyspass'
  })
}
</script>

<template>
  <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
    <div class="text-center mb-4">
      <h2 class="fw-bold mb-1">Авторизація</h2>
      <p class="text-muted small">Введіть свої дані або скористайтеся тестовим акаунтом</p>
    </div>

    <!-- Error Alert -->
    <div v-if="authStore.error" class="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="me-2 flex-shrink-0">
        <circle cx="12" cy="12" r="10" stroke-width="2" />
        <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
      </svg>
      <span>{{ authStore.error }}</span>
    </div>

    <!-- Test credentials hint banner -->
    <div class="alert alert-info py-2 px-3 small mb-3 border-0 bg-info-subtle">
      <div class="fw-semibold mb-1">Тестові облікові дані:</div>
      <div class="d-flex justify-content-between align-items-center">
        <span><code>emilys</code> / <code>emilyspass</code></span>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm py-0 px-2"
          @click="fillTestCredentials"
        >
          Підставити
        </button>
      </div>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label for="username" class="form-label fw-semibold small">Ім'я користувача (username)</label>
        <input
          id="username"
          v-model="username"
          v-bind="usernameProps"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
          placeholder="Введіть username"
          autocomplete="username"
        />
        <div v-if="errors.username" class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>

      <div class="mb-4">
        <label for="password" class="form-label fw-semibold small">Пароль</label>
        <input
          id="password"
          v-model="password"
          v-bind="passwordProps"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          placeholder="••••••••"
          autocomplete="current-password"
        />
        <div v-if="errors.password" class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>

      <div class="d-grid mb-3">
        <button
          type="submit"
          class="btn btn-primary py-2 fw-semibold"
          :disabled="authStore.isLoading"
        >
          <span
            v-if="authStore.isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          {{ authStore.isLoading ? 'Вхід...' : 'Увійти' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.2);
}
</style>
