<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout(): void {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="d-flex align-items-center flex-wrap gap-2">
    <RouterLink to="/" class="nav-link" exact-active-class="router-link-exact-active">
      Home
    </RouterLink>

    <RouterLink to="/about" class="nav-link">
      About author
    </RouterLink>

    <RouterLink to="/users" class="nav-link">
      Users
    </RouterLink>

    <div class="auth-action ms-2 d-flex align-items-center gap-2">
      <template v-if="authStore.isAuthenticated">
        <span class="user-badge d-none d-sm-inline-flex align-items-center gap-1 text-muted small">
          <img
            v-if="authStore.user?.image"
            :src="authStore.user.image"
            :alt="authStore.user.username"
            class="user-avatar rounded-circle"
            width="24"
            height="24"
          />
          <span class="fw-semibold text-dark">{{ authStore.user?.username || 'Користувач' }}</span>
        </span>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm px-3"
          @click="handleLogout"
        >
          Logout
        </button>
      </template>

      <template v-else>
        <RouterLink to="/login" class="btn btn-primary btn-sm px-3">
          Login
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.user-avatar {
  border: 1px solid #cbd5e1;
  background-color: #f1f5f9;
}

.user-badge {
  background: #f1f5f9;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}
</style>
