<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { CreateUserDto } from '@/types/user'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  modelValue: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: CreateUserDto]
}>()

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим").trim(),
  lastName: yup.string().required("Прізвище є обов'язковим").trim(),
  email: yup
    .string()
    .required("Email є обов'язковим")
    .email('Некоректний формат email')
    .trim(),
  username: yup.string().required("Username є обов'язковим").min(3, 'Мінімум 3 символи').trim(),
  password: yup
    .string()
    .required("Пароль є обов'язковим")
    .min(6, 'Пароль має містити щонайменше 6 символів'),
  age: yup
    .number()
    .typeError('Вік має бути числом')
    .required("Вік є обов'язковим")
    .min(1, 'Мінімальний вік 1')
    .max(120, 'Максимальний вік 120'),
  gender: yup.string().required("Стать є обов'язковою"),
  phone: yup.string().required("Номер телефону є обов'язковим").trim()
})

const { defineField, handleSubmit, errors, resetForm } = useForm<CreateUserDto>({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: 25,
    gender: 'male',
    phone: ''
  }
})

const [firstName, firstNameProps] = defineField('firstName')
const [lastName, lastNameProps] = defineField('lastName')
const [email, emailProps] = defineField('email')
const [username, usernameProps] = defineField('username')
const [password, passwordProps] = defineField('password')
const [age, ageProps] = defineField('age')
const [gender, genderProps] = defineField('gender')
const [phone, phoneProps] = defineField('phone')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

function closeModal(): void {
  emit('update:modelValue', false)
  resetForm()
}
</script>

<template>
  <Modal :model-value="props.modelValue" title="Створити нового користувача" @update:model-value="closeModal">
    <template #body>
      <form id="create-user-form" @submit.prevent="onSubmit">
        <div class="row g-2 mb-2">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Ім'я (First name)</label>
            <input
              v-model="firstName"
              v-bind="firstNameProps"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.firstName }"
              placeholder="Іван"
            />
            <div v-if="errors.firstName" class="invalid-feedback small">{{ errors.firstName }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Прізвище (Last name)</label>
            <input
              v-model="lastName"
              v-bind="lastNameProps"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.lastName }"
              placeholder="Франко"
            />
            <div v-if="errors.lastName" class="invalid-feedback small">{{ errors.lastName }}</div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Email</label>
            <input
              v-model="email"
              v-bind="emailProps"
              type="email"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.email }"
              placeholder="user@example.com"
            />
            <div v-if="errors.email" class="invalid-feedback small">{{ errors.email }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Телефон</label>
            <input
              v-model="phone"
              v-bind="phoneProps"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.phone }"
              placeholder="+380..."
            />
            <div v-if="errors.phone" class="invalid-feedback small">{{ errors.phone }}</div>
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Username</label>
            <input
              v-model="username"
              v-bind="usernameProps"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.username }"
              placeholder="ivanf"
            />
            <div v-if="errors.username" class="invalid-feedback small">{{ errors.username }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Пароль</label>
            <input
              v-model="password"
              v-bind="passwordProps"
              type="password"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.password }"
              placeholder="••••••••"
            />
            <div v-if="errors.password" class="invalid-feedback small">{{ errors.password }}</div>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Вік</label>
            <input
              v-model.number="age"
              v-bind="ageProps"
              type="number"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.age }"
            />
            <div v-if="errors.age" class="invalid-feedback small">{{ errors.age }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Стать</label>
            <select
              v-model="gender"
              v-bind="genderProps"
              class="form-select form-select-sm"
              :class="{ 'is-invalid': errors.gender }"
            >
              <option value="male">Чоловіча (male)</option>
              <option value="female">Жіноча (female)</option>
              <option value="other">Інша (other)</option>
            </select>
            <div v-if="errors.gender" class="invalid-feedback small">{{ errors.gender }}</div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="closeModal">
        Скасувати
      </button>
      <button
        type="submit"
        form="create-user-form"
        class="btn btn-primary btn-sm"
        :disabled="props.isLoading"
      >
        <span v-if="props.isLoading" class="spinner-border spinner-border-sm me-1" role="status" />
        {{ props.isLoading ? 'Створення...' : 'Створити' }}
      </button>
    </template>
  </Modal>
</template>
