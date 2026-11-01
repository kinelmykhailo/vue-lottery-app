<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { AppToast, AppConfirmDialog } from '@/shared/ui'
import { useThemeStore } from '@/features/theme-switcher'

const route = useRoute()
const themeStore = useThemeStore()

const isAuthLayout = computed(() => route.meta.layout === 'auth')

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="app-root d-flex flex-column min-vh-100">
    <AppToast />
    <AppConfirmDialog />
    <AppHeader v-if="!isAuthLayout" />
    <main class="main-content flex-grow-1">
      <div :class="isAuthLayout ? 'auth-container' : 'container py-4'">
        <RouterView />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.app-root {
  min-height: 100vh;
}
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 2rem 1rem;
}
</style>
