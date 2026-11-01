<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'date'
    placeholder?: string
    error?: string
    touched?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
    touched: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="mb-3">
    <label class="form-label fw-semibold">{{ label }}</label>
    <input
      class="form-control"
      :class="{
        'is-invalid-field': touched && error,
        'is-valid-field': touched && !error
      }"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      @blur="emit('blur')"
    />
    <p v-if="touched && error" class="field-error">{{ error }}</p>
  </div>
</template>
