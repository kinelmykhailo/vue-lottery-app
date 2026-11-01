<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/entities/user'
import { UsersTable } from '@/widgets/users-table'
import { UserCreateModal } from '@/features/user-form'
import { AppButton, AppInput } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const {
  users,
  total,
  winnerIds,
  winners,
  canPickWinner,
  currentPage,
  totalPages,
  isLoading,
  error,
  searchQuery
} = storeToRefs(usersStore)

const { fetchUsers, pickWinner, removeWinner } = usersStore

const searchInput = ref<string>('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Modals state
const isCreateModalOpen = ref(false)

async function syncAndFetch(): Promise<void> {
  const pageParam = Number(route.query.page) || 1
  const queryParam = typeof route.query.q === 'string' ? route.query.q : ''

  searchInput.value = queryParam

  await fetchUsers({
    page: pageParam,
    limit: 10,
    q: queryParam
  })
}

onMounted(() => {
  syncAndFetch()
})

watch(
  () => [route.query.page, route.query.q],
  () => {
    syncAndFetch()
  }
)

function onSearchInput(val: string): void {
  searchInput.value = val

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    router.push({
      query: {
        ...route.query,
        page: 1,
        q: val.trim() ? val.trim() : undefined
      }
    })
  }, 300)
}

function clearSearch(): void {
  searchInput.value = ''
  router.push({
    query: {
      ...route.query,
      page: 1,
      q: undefined
    }
  })
}

function goToPage(page: number): void {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  router.push({
    query: {
      ...route.query,
      page
    }
  })
}
</script>

<template>
  <div class="users-page">
    <!-- Page Header & Action -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
      <div>
        <h2 class="fw-bold mb-1">Учасники лотереї</h2>
        <p class="text-muted small mb-0">
          Архітектура Feature-Sliced Design • Стор Pinia (setup stores) • UI-бібліотека PrimeVue
        </p>
      </div>
      <div>
        <AppButton
          label="Додати учасника"
          icon="pi pi-plus"
          @click="isCreateModalOpen = true"
        />
      </div>
    </div>

    <!-- Lottery Winners Block -->
    <div class="card p-4 mb-4 border-primary-subtle shadow-sm bg-white">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-4">🏆</span>
          <h5 class="fw-bold mb-0">Переможці розіграшу</h5>
          <span class="badge bg-primary rounded-pill">{{ winnerIds.length }} / 3</span>
        </div>
        <AppButton
          label="Обрати переможця"
          icon="pi pi-sparkles"
          severity="warning"
          size="small"
          :disabled="!canPickWinner"
          @click="pickWinner"
        />
      </div>

      <div v-if="winners.length > 0" class="d-flex flex-wrap gap-2 align-items-center">
        <span
          v-for="winner in winners"
          :key="winner.id"
          class="winner-tag"
        >
          <span>⭐ {{ winner.firstName }} {{ winner.lastName }} (#{{ winner.id }})</span>
          <button
            type="button"
            class="winner-tag__remove"
            title="Прибрати переможця"
            @click="removeWinner(winner.id)"
          >
            ×
          </button>
        </span>
      </div>
      <div v-else class="text-muted small fst-italic">
        Переможців ще не обрано. Натисніть кнопку «Обрати переможця» для випадкового вибору.
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="card border-0 shadow-sm p-3 mb-4 bg-white">
      <div class="row g-2 align-items-center">
        <div class="col-md-6 col-lg-5">
          <div class="d-flex align-items-center gap-2">
            <AppInput
              :model-value="searchInput"
              placeholder="Пошук за ім'ям, email або username..."
              class="mb-0 flex-grow-1"
              @update:model-value="onSearchInput"
            />
            <AppButton
              v-if="searchInput"
              label="✕"
              severity="secondary"
              outlined
              title="Очистити пошук"
              @click="clearSearch"
            />
          </div>
        </div>

        <div class="col-md-6 col-lg-7 text-md-end text-muted small">
          Знайдено користувачів: <strong>{{ total }}</strong>
          <span v-if="searchQuery"> (за запитом "{{ searchQuery }}")</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="mt-2 text-muted">Завантаження користувачів...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <h5 class="alert-heading">Помилка завантаження</h5>
      <p class="mb-0">{{ error }}</p>
    </div>

    <!-- Users Table Widget -->
    <template v-else>
      <UsersTable
        :users="users"
        :winner-ids="winnerIds"
        :is-loading="isLoading"
      />

      <!-- Pagination Footer -->
      <div class="card border-0 shadow-sm bg-white p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div class="text-muted small">
          Сторінка <strong>{{ currentPage }}</strong> з <strong>{{ totalPages }}</strong>
        </div>

        <nav aria-label="Пагінація користувачів">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage <= 1 }">
              <button class="page-link" type="button" @click="goToPage(currentPage - 1)">
                Попередня
              </button>
            </li>

            <li
              v-for="p in Math.min(5, totalPages)"
              :key="p"
              class="page-item"
              :class="{ active: currentPage === p }"
            >
              <button class="page-link" type="button" @click="goToPage(p)">
                {{ p }}
              </button>
            </li>

            <li v-if="totalPages > 5 && currentPage > 3" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
              <button class="page-link" type="button" @click="goToPage(currentPage + 1)">
                Наступна
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </template>

    <!-- Create User Modal Feature -->
    <UserCreateModal v-model="isCreateModalOpen" />
  </div>
</template>

<style scoped lang="scss">
.winner-tag {
  background: #2563eb;
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &__remove {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
