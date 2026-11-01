<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
    <span class="logo-icon-wrapper d-inline-flex align-items-center justify-content-center">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="#ffc107"
          stroke="#e0a800"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="logo-text fw-bold text-dark">
      Vue<span class="text-primary">Lottery</span>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.navbar-brand {
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}

.logo-icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.logo-text {
  font-family: inherit;
}
</style>
