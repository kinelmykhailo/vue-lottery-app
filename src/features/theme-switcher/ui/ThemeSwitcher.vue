<script setup lang="ts">
import { useThemeStore } from '../model/theme.store'
import { AppButton } from '@/shared/ui'

const themeStore = useThemeStore()
</script>

<template>
  <AppButton
    type="button"
    severity="secondary"
    text
    rounded
    size="small"
    :title="themeStore.currentTheme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'"
    aria-label="Перемикач теми"
    @click="themeStore.toggleTheme"
  >
    <span class="fs-5 lh-1">{{ themeStore.currentTheme === 'dark' ? '☀️' : '🌙' }}</span>
  </AppButton>
</template>
