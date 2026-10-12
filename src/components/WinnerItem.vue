<script setup lang="ts">
defineProps<{
  name: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="winner-tag">
    {{ name }}
    <button
      type="button"
      class="winner-tag__remove"
      :aria-label="`Прибрати переможця ${name}`"
      @click="emit('remove')"
    >
      ×
    </button>
  </span>
</template>
