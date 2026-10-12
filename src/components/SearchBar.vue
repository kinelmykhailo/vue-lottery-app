<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref('')
const DEBOUNCE_MS = 300

watch(query, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, DEBOUNCE_MS)
})

let debounceTimer: ReturnType<typeof setTimeout> | undefined
</script>

<template>
  <div class="mb-3">
    <input
      v-model="query"
      type="text"
      class="form-control"
      placeholder="Пошук учасника за іменем…"
      aria-label="Пошук учасника за іменем"
    />
  </div>
</template>
