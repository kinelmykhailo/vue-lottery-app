<script setup lang="ts">
import InputText from 'primevue/inputtext'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    id?: string
    name?: string
    type?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    size?: 'small' | 'large'
  }>(),
  {
    modelValue: '',
    label: undefined,
    id: undefined,
    name: undefined,
    type: 'text',
    placeholder: undefined,
    error: undefined,
    disabled: false,
    required: false,
    size: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

function onInput(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-wrapper mb-3">
    <label v-if="props.label" :for="props.id" class="form-label small fw-semibold text-secondary mb-1">
      {{ props.label }}
      <span v-if="props.required" class="text-danger">*</span>
    </label>

    <InputText
      :id="props.id"
      :name="props.name"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :size="props.size"
      :class="['w-100', { 'p-invalid': Boolean(props.error) }]"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />

    <small v-if="props.error" class="p-error d-block mt-1">
      {{ props.error }}
    </small>
  </div>
</template>

<style scoped lang="scss">
.app-input-wrapper {
  .p-inputtext {
    width: 100%;
    font-family: inherit;
    font-size: 0.925rem;
    border-radius: 0.375rem;

    &:enabled:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.2);
    }
  }

  .p-error {
    color: #dc2626;
    font-size: 0.8125rem;
  }
}
</style>
