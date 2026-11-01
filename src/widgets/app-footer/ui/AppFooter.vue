<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer border-top bg-white py-3 mt-auto text-muted small">
    <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <span>© {{ currentYear }} Vue Lottery App. Лабораторна робота №5.</span>
      </div>
      <div>
        <span>Автор: </span>
        <a
          href="https://github.com/kinelmykhailo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none fw-semibold"
        >
          Кінель Михайло
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  font-size: 0.875rem;
}
</style>
