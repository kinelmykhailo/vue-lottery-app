<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput } from '@/shared/ui'

const sessionStore = useSessionStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

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
    await sessionStore.login({
      username: values.username,
      password: values.password
    })

    toast.add({
      severity: 'success',
      summary: 'Успішний вхід',
      detail: `Вітаємо, ${values.username}!`,
      life: 3000
    })

    const redirect = (route.query.redirect as string) || '/users'
    router.push(redirect)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Помилка авторизації',
      detail: (e as Error).message || 'Невірний логін або пароль',
      life: 4000
    })
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
  <div class="login-form-card p-4 p-md-5 bg-white rounded-4 shadow-lg border-0">
    <div class="text-center mb-4">
      <h2 class="fw-bold mb-1">Авторизація</h2>
      <p class="text-muted small">Введіть свої дані або скористайтеся тестовим акаунтом</p>
    </div>

    <!-- Error Alert -->
    <div v-if="sessionStore.error" class="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3">
      <span class="me-2">⚠️</span>
      <span>{{ sessionStore.error }}</span>
    </div>

    <!-- Test credentials hint -->
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
      <AppInput
        id="username"
        v-model="username"
        v-bind="usernameProps"
        label="Ім'я користувача (username)"
        placeholder="Введіть username"
        :error="errors.username"
        required
      />

      <AppInput
        id="password"
        v-model="password"
        v-bind="passwordProps"
        type="password"
        label="Пароль"
        placeholder="••••••••"
        :error="errors.password"
        required
      />

      <div class="d-grid mt-4">
        <AppButton
          type="submit"
          label="Увійти"
          :loading="sessionStore.isLoading"
          class="w-100 py-2 fw-semibold"
        />
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login-form-card {
  max-width: 440px;
  margin: 0 auto;
}
</style>
