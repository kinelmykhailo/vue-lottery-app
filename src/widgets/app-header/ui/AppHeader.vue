<script setup lang="ts">
import Logo from '@/shared/ui/Logo/Logo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header border-bottom bg-white sticky-top shadow-sm">
    <div class="container py-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  z-index: 1020;
}
</style>
