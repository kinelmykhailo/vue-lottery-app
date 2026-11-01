<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import type { User } from '@/entities/user'
import { useUsersStore } from '@/entities/user'

const props = defineProps<{
  id: string | number
}>()

const route = useRoute()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

async function loadUser(userId: number): Promise<void> {
  const cached = usersStore.users.find((u) => u.id === userId)
  if (cached) {
    user.value = { ...cached }
  }

  isLoading.value = true
  error.value = null

  try {
    const fetched = await usersStore.fetchUser(userId)
    if (fetched) {
      user.value = fetched
    }
  } catch (e) {
    if (!user.value) {
      error.value = (e as Error).message || `Користувача з ID ${userId} не знайдено`
    }
  } finally {
    isLoading.value = false
  }
}

function onUserUpdated(updatedUser: User): void {
  user.value = { ...user.value, ...updatedUser }
}

onMounted(() => {
  loadUser(Number(props.id))
})

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadUser(Number(newId))
    }
  }
)
</script>

<template>
  <div class="user-details-layout">
    <!-- Breadcrumbs & back button -->
    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <RouterLink to="/users">Учасники</RouterLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ user ? `${user.firstName} ${user.lastName}` : `Користувач #${props.id}` }}
          </li>
        </ol>
      </nav>
      <RouterLink to="/users" class="btn btn-outline-secondary btn-sm">
        ← Повернутися до списку
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !user" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="mt-2 text-muted">Завантаження даних користувача...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !user" class="alert alert-danger">
      <h5 class="alert-heading">Помилка</h5>
      <p class="mb-0">{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="user">
      <!-- User Header Card -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3">
              <img
                :src="user.image || `https://dummyjson.com/icon/${user.username}/128`"
                :alt="user.username"
                class="rounded-circle border"
                width="72"
                height="72"
              />
              <div>
                <h3 class="fw-bold mb-1">{{ user.firstName }} {{ user.lastName }}</h3>
                <div class="text-muted small">
                  @{{ user.username }} • <span class="badge bg-light text-secondary border">{{ user.role || 'user' }}</span>
                </div>
              </div>
            </div>

            <!-- Route Navigation Tabs -->
            <ul class="nav nav-pills">
              <li class="nav-item">
                <RouterLink
                  :to="`/users/${props.id}`"
                  class="nav-link"
                  :class="{ active: route.name === 'user-details' }"
                >
                  Перегляд
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink
                  :to="`/users/${props.id}/edit`"
                  class="nav-link"
                  :class="{ active: route.name === 'user-edit' }"
                >
                  Редагувати
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Nested child view -->
      <RouterView :user="user" @user-updated="onUserUpdated" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-pills .nav-link {
  color: #475569;
  font-weight: 500;
  border-radius: 0.375rem;

  &.active {
    background-color: #2563eb;
    color: #fff !important;
  }
}
</style>
