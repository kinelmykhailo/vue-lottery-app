<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { User, UpdateUserDto, UserService } from '@/entities/user'
import { useUsersStore } from '@/stores/users'
import { ServiceProvider } from '@/shared/api'

const props = defineProps<{
  id: string | number
  user?: User
}>()

const emit = defineEmits<{
  'user-updated': [user: User]
}>()

const router = useRouter()
const usersStore = useUsersStore()

const isSubmitting = ref(false)
const successMessage = ref<string | null>(null)
const serverError = ref<string | null>(null)

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим").trim(),
  lastName: yup.string().required("Прізвище є обов'язковим").trim(),
  email: yup
    .string()
    .required("Email є обов'язковим")
    .email('Некоректний формат email')
    .trim(),
  username: yup.string().required("Username є обов'язковим").min(3, 'Мінімум 3 символи').trim(),
  age: yup
    .number()
    .typeError('Вік має бути числом')
    .required("Вік є обов'язковим")
    .min(1, 'Мінімальний вік 1')
    .max(120, 'Максимальний вік 120'),
  gender: yup.string().required("Стать є обов'язковою"),
  phone: yup.string().required("Номер телефону є обов'язковим").trim()
})

const { defineField, handleSubmit, errors, setValues } = useForm<UpdateUserDto>({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    age: 18,
    gender: 'male',
    phone: ''
  }
})

const [firstName, firstNameProps] = defineField('firstName')
const [lastName, lastNameProps] = defineField('lastName')
const [email, emailProps] = defineField('email')
const [username, usernameProps] = defineField('username')
const [age, ageProps] = defineField('age')
const [gender, genderProps] = defineField('gender')
const [phone, phoneProps] = defineField('phone')

function populateFromUser(u: User): void {
  setValues({
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    username: u.username,
    age: u.age,
    gender: u.gender,
    phone: u.phone
  })
}

onMounted(async () => {
  if (props.user) {
    populateFromUser(props.user)
  } else {
    try {
      const u = await ServiceProvider.get<UserService>('users').getById(Number(props.id))
      populateFromUser(u)
    } catch (e) {
      serverError.value = (e as Error).message || 'Не вдалося завантажити дані для редагування'
    }
  }
})

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      populateFromUser(newUser)
    }
  }
)

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  serverError.value = null
  successMessage.value = null

  try {
    const updated = await usersStore.updateUser(Number(props.id), values)
    emit('user-updated', updated)
    successMessage.value = 'Дані користувача успішно оновлено (локальний стан синхронізовано)!'
    setTimeout(() => {
      router.push(`/users/${props.id}`)
    }, 1500)
  } catch (e) {
    serverError.value = (e as Error).message || 'Помилка під час оновлення даних'
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="user-edit-view">
    <div class="card border-0 shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0">Редагування користувача #{{ props.id }}</h4>
        <RouterLink :to="`/users/${props.id}`" class="btn btn-outline-secondary btn-sm">
          Скасувати
        </RouterLink>
      </div>

      <!-- Alerts -->
      <div v-if="successMessage" class="alert alert-success d-flex align-items-center py-2 px-3 small mb-3">
        ✓ {{ successMessage }}
      </div>

      <div v-if="serverError" class="alert alert-danger d-flex align-items-center py-2 px-3 small mb-3">
        ⚠ {{ serverError }}
      </div>

      <form @submit.prevent="onSubmit">
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold small">Ім'я (First name)</label>
            <input
              v-model="firstName"
              v-bind="firstNameProps"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.firstName }"
            />
            <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold small">Прізвище (Last name)</label>
            <input
              v-model="lastName"
              v-bind="lastNameProps"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
            />
            <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold small">Email</label>
            <input
              v-model="email"
              v-bind="emailProps"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
            />
            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold small">Телефон</label>
            <input
              v-model="phone"
              v-bind="phoneProps"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.phone }"
            />
            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Username</label>
            <input
              v-model="username"
              v-bind="usernameProps"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
            />
            <div v-if="errors.username" class="invalid-feedback">{{ errors.username }}</div>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold small">Вік</label>
            <input
              v-model.number="age"
              v-bind="ageProps"
              type="number"
              class="form-control"
              :class="{ 'is-invalid': errors.age }"
            />
            <div v-if="errors.age" class="invalid-feedback">{{ errors.age }}</div>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold small">Стать</label>
            <select
              v-model="gender"
              v-bind="genderProps"
              class="form-select"
              :class="{ 'is-invalid': errors.gender }"
            >
              <option value="male">Чоловіча (male)</option>
              <option value="female">Жіноча (female)</option>
              <option value="other">Інша (other)</option>
            </select>
            <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <RouterLink :to="`/users/${props.id}`" class="btn btn-secondary px-3">
            Скасувати
          </RouterLink>
          <button
            type="submit"
            class="btn btn-primary px-4"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" />
            {{ isSubmitting ? 'Збереження...' : 'Зберегти зміни' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
