<script setup lang="ts">
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    loading?: boolean
    disabled?: boolean
    severity?: 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'contrast'
    size?: 'small' | 'large'
    outlined?: boolean
    text?: boolean
    rounded?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    label: undefined,
    icon: undefined,
    loading: false,
    disabled: false,
    severity: undefined,
    size: undefined,
    outlined: false,
    text: false,
    rounded: false,
    type: 'button'
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :label="props.label"
    :icon="props.icon"
    :loading="props.loading"
    :disabled="props.disabled"
    :severity="props.severity"
    :size="props.size"
    :outlined="props.outlined"
    :text="props.text"
    :rounded="props.rounded"
    :type="props.type"
    class="app-button"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<style scoped lang="scss">
.app-button {
  font-family: inherit;
  font-weight: 500;
}
</style>
