<script setup lang="ts">
import Logo from '@/components/Logo.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="auth-layout-wrapper d-flex flex-column min-vh-100">
    <header class="py-3 px-4 border-bottom bg-white">
      <div class="container d-flex justify-content-between align-items-center">
        <Logo />
        <RouterLink to="/" class="btn btn-outline-secondary btn-sm">
          ← На головну
        </RouterLink>
      </div>
    </header>

    <main class="main-content flex-grow-1 d-flex align-items-center justify-content-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.auth-layout-wrapper {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
</style>
