<script setup lang="ts">
import type { Participant } from '@/types/participant'
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'

defineProps<{
  winners: Participant[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  'pick-winner': []
  'remove-winner': [id: string]
}>()

defineOptions({ name: 'WinnersBlock' })
</script>

<template>
  <section class="card-block p-3">
    <div class="d-flex align-items-center gap-2">
      <div class="form-control d-flex flex-wrap align-items-center gap-2 py-2">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :name="winner.name"
          @remove="emit('remove-winner', winner.id)"
        />
        <span v-if="winners.length === 0" class="text-muted">Winners</span>
      </div>
      <BaseButton :disabled="!canPickWinner" @click="emit('pick-winner')">
        New winner
      </BaseButton>
    </div>
  </section>
</template>
