<script setup lang="ts">
import { Logo } from '@/shared/ui'
import { ThemeSwitcher } from '@/features/theme-switcher'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header border-bottom bg-white sticky-top shadow-sm">
    <div class="container py-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="d-flex align-items-center gap-3">
        <Logo />
        <ThemeSwitcher />
      </div>
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  z-index: 1020;
}
</style>
