<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'link'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function onClick(event: MouseEvent): void {
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant === 'link' ? 'link' : variant}`]"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>
