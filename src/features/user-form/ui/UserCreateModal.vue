<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import type { CreateUserDto } from '@/entities/user'
import { useUsersStore } from '@/entities/user'
import { Modal, AppButton, AppInput } from '@/shared/ui'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  created: [user: unknown]
}>()

const usersStore = useUsersStore()
const toast = useToast()

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

const onSubmit = handleSubmit(async (values) => {
  try {
    const created = await usersStore.createUser(values)
    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: `Користувача "${created.firstName} ${created.lastName}" створено!`,
      life: 3000
    })
    emit('created', created)
    closeModal()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Помилка створення',
      detail: (e as Error).message,
      life: 4000
    })
  }
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
            <AppInput
              v-model="firstName"
              v-bind="firstNameProps"
              label="Ім'я (First name)"
              placeholder="Іван"
              :error="errors.firstName"
              required
            />
          </div>
          <div class="col-md-6">
            <AppInput
              v-model="lastName"
              v-bind="lastNameProps"
              label="Прізвище (Last name)"
              placeholder="Франко"
              :error="errors.lastName"
              required
            />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md-6">
            <AppInput
              v-model="email"
              v-bind="emailProps"
              type="email"
              label="Email"
              placeholder="user@example.com"
              :error="errors.email"
              required
            />
          </div>
          <div class="col-md-6">
            <AppInput
              v-model="phone"
              v-bind="phoneProps"
              label="Телефон"
              placeholder="+380..."
              :error="errors.phone"
              required
            />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-md-6">
            <AppInput
              v-model="username"
              v-bind="usernameProps"
              label="Username"
              placeholder="ivanf"
              :error="errors.username"
              required
            />
          </div>
          <div class="col-md-6">
            <AppInput
              v-model="password"
              v-bind="passwordProps"
              type="password"
              label="Пароль"
              placeholder="••••••••"
              :error="errors.password"
              required
            />
          </div>
        </div>

        <div class="row g-2">
          <div class="col-md-6">
            <AppInput
              v-model.number="age"
              v-bind="ageProps"
              type="number"
              label="Вік"
              :error="errors.age"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-secondary mb-1">
              Стать <span class="text-danger">*</span>
            </label>
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
      <AppButton
        label="Скасувати"
        severity="secondary"
        size="small"
        @click="closeModal"
      />
      <AppButton
        type="submit"
        form="create-user-form"
        label="Створити"
        size="small"
        :loading="usersStore.isLoading"
      />
    </template>
  </Modal>
</template>
