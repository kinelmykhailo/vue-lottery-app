<script setup lang="ts">
import type { ParticipantFormData } from '@/types/participant'
import { useParticipantForm } from '@/composables/useParticipantForm'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  isEmailTaken: (email: string) => boolean
}>()

const emit = defineEmits<{
  register: [data: ParticipantFormData]
}>()

const EMPTY_FORM: ParticipantFormData = {
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
}

const { form, errors, touched, validateAll, handleBlur, resetForm } = useParticipantForm(
  { ...EMPTY_FORM },
  (email) => props.isEmailTaken(email)
)

function onSubmit(): void {
  if (!validateAll()) return

  emit('register', { ...form })
  // Очищення форми не повинно викликати повторну валідацію полів.
  resetForm({ ...EMPTY_FORM })
}
</script>

<template>
  <section class="card-block p-4">
    <h2 class="h6 text-uppercase fw-bold mb-0">Register form</h2>
    <p class="text-muted small mb-3">Please fill in all the fields.</p>

    <form @keyup.enter="onSubmit">
      <BaseInput
        v-model="form.name"
        label="Name"
        placeholder="Enter user name"
        :error="errors.name"
        :touched="touched.name"
        @blur="handleBlur('name')"
      />
      <BaseInput
        v-model="form.dateOfBirth"
        type="date"
        label="Date of Birth"
        :error="errors.dateOfBirth"
        :touched="touched.dateOfBirth"
        @blur="handleBlur('dateOfBirth')"
      />
      <BaseInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="errors.email"
        :touched="touched.email"
        @blur="handleBlur('email')"
      />
      <BaseInput
        v-model="form.phone"
        type="tel"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
        :touched="touched.phone"
        @blur="handleBlur('phone')"
      />

      <div class="d-flex justify-content-end">
        <BaseButton type="button" @click="onSubmit">Save</BaseButton>
      </div>
    </form>
  </section>
</template>
