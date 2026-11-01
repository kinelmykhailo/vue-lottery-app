<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-view text-center py-5">
    <div class="display-1 fw-bold text-primary mb-3">404</div>
    <h2 class="fw-bold mb-2">Сторінку не знайдено</h2>
    <p class="text-muted mb-4 col-md-6 mx-auto">
      На жаль, запитуваної адреси не існує або сторінка була переміщена. Перевірте правильність введеного URL.
    </p>
    <div>
      <RouterLink to="/" class="btn btn-primary px-4 py-2">
        Повернутися на головну
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found-view {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
