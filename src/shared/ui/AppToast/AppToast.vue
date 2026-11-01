<script setup lang="ts">
import Toast from 'primevue/toast'

const props = withDefaults(
  defineProps<{
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center'
    group?: string
  }>(),
  {
    position: 'top-right',
    group: undefined
  }
)
</script>

<template>
  <Toast :position="props.position" :group="props.group" />
</template>
