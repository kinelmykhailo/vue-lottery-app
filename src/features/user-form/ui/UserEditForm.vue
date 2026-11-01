<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import type { User, UpdateUserDto } from '@/entities/user'
import { useUsersStore } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'

const props = defineProps<{
  id: string | number
  user?: User
}>()

const emit = defineEmits<{
  'user-updated': [user: User]
}>()

const router = useRouter()
const usersStore = useUsersStore()
const toast = useToast()

const isSubmitting = ref(false)

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
    const fetched = await usersStore.fetchUser(Number(props.id))
    if (fetched) {
      populateFromUser(fetched)
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

  try {
    const updated = await usersStore.updateUser(Number(props.id), values)
    emit('user-updated', updated)
    toast.add({
      severity: 'success',
      summary: 'Оновлено',
      detail: 'Дані користувача успішно оновлено (локальний стан синхронізовано)!',
      life: 3000
    })
    setTimeout(() => {
      router.push(`/users/${props.id}`)
    }, 1200)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: (e as Error).message || 'Помилка під час оновлення даних',
      life: 4000
    })
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="user-edit-form-card p-4 bg-white rounded-3 shadow-sm">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold mb-0">Редагування користувача #{{ props.id }}</h4>
      <AppButton
        label="Скасувати"
        severity="secondary"
        size="small"
        outlined
        @click="router.push(`/users/${props.id}`)"
      />
    </div>

    <form @submit.prevent="onSubmit">
      <div class="row g-3 mb-2">
        <div class="col-md-6">
          <AppInput
            v-model="firstName"
            v-bind="firstNameProps"
            label="Ім'я (First name)"
            :error="errors.firstName"
            required
          />
        </div>

        <div class="col-md-6">
          <AppInput
            v-model="lastName"
            v-bind="lastNameProps"
            label="Прізвище (Last name)"
            :error="errors.lastName"
            required
          />
        </div>
      </div>

      <div class="row g-3 mb-2">
        <div class="col-md-6">
          <AppInput
            v-model="email"
            v-bind="emailProps"
            type="email"
            label="Email"
            :error="errors.email"
            required
          />
        </div>

        <div class="col-md-6">
          <AppInput
            v-model="phone"
            v-bind="phoneProps"
            label="Телефон"
            :error="errors.phone"
            required
          />
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <AppInput
            v-model="username"
            v-bind="usernameProps"
            label="Username"
            :error="errors.username"
            required
          />
        </div>

        <div class="col-md-4">
          <AppInput
            v-model.number="age"
            v-bind="ageProps"
            type="number"
            label="Вік"
            :error="errors.age"
            required
          />
        </div>

        <div class="col-md-4">
          <label class="form-label small fw-semibold text-secondary mb-1">
            Стать <span class="text-danger">*</span>
          </label>
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
          <div v-if="errors.gender" class="invalid-feedback small">{{ errors.gender }}</div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <AppButton
          label="Скасувати"
          severity="secondary"
          @click="router.push(`/users/${props.id}`)"
        />
        <AppButton
          type="submit"
          label="Зберегти зміни"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </div>
</template>
