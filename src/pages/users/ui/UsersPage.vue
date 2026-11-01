<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { User, CreateUserDto } from '@/entities/user'
import UserFormModal from '@/components/UserFormModal.vue'
import Modal from '@/shared/ui/Modal/Modal.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const searchInput = ref<string>('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Modals state
const isCreateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const userToDelete = ref<User | null>(null)
const successNotification = ref<string | null>(null)

function showNotification(msg: string): void {
  successNotification.value = msg
  setTimeout(() => {
    successNotification.value = null
  }, 3500)
}

// Sync route queries to state & fetch
async function syncAndFetch(): Promise<void> {
  const pageParam = Number(route.query.page) || 1
  const queryParam = typeof route.query.q === 'string' ? route.query.q : ''

  searchInput.value = queryParam

  await usersStore.fetchUsers({
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

function onSearchInput(e: Event): void {
  const val = (e.target as HTMLInputElement).value
  searchInput.value = val

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    router.push({
      query: {
        ...route.query,
        page: 1, // Reset to page 1 on new search
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
  if (page < 1 || page > usersStore.totalPages || page === usersStore.currentPage) return
  router.push({
    query: {
      ...route.query,
      page
    }
  })
}

// Creation
async function handleCreateUser(data: CreateUserDto): Promise<void> {
  try {
    const created = await usersStore.createUser(data)
    isCreateModalOpen.value = false
    showNotification(`Користувача "${created.firstName} ${created.lastName}" успішно створено!`)
  } catch {
    // Error is set in store
  }
}

// Deletion
function openDeleteModal(user: User): void {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!userToDelete.value) return
  const id = userToDelete.value.id
  const name = `${userToDelete.value.firstName} ${userToDelete.value.lastName}`

  try {
    await usersStore.deleteUser(id)
    isDeleteModalOpen.value = false
    userToDelete.value = null
    showNotification(`Користувача "${name}" успішно видалено!`)
  } catch {
    // Handled in store
  }
}
</script>

<template>
  <div class="users-view">
    <!-- Page Title & Actions -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
      <div>
        <h2 class="fw-bold mb-1">Учасники лотереї</h2>
        <p class="text-muted small mb-0">
          Синхронізація з DummyJSON Users API • Патерн Repository • URL-query пагінація
        </p>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-primary d-inline-flex align-items-center gap-2"
          @click="isCreateModalOpen = true"
        >
          <span class="fs-5 lh-1">+</span> Додати учасника
        </button>
      </div>
    </div>

    <!-- Notification Alert -->
    <div
      v-if="successNotification"
      class="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4"
      role="alert"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="me-2 flex-shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div>{{ successNotification }}</div>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="successNotification = null"
      />
    </div>

    <!-- Lottery Winners Block -->
    <div class="card card-block p-4 mb-4 border-primary-subtle shadow-sm">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-4">🏆</span>
          <h5 class="fw-bold mb-0">Переможці розіграшу</h5>
          <span class="badge bg-primary rounded-pill">{{ usersStore.winnerIds.length }} / 3</span>
        </div>
        <button
          type="button"
          class="btn btn-warning btn-sm fw-semibold"
          :disabled="!usersStore.canPickWinner"
          @click="usersStore.pickWinner"
        >
          🎲 Обрати переможця
        </button>
      </div>

      <div v-if="usersStore.winners.length > 0" class="d-flex flex-wrap gap-2 align-items-center">
        <span
          v-for="winner in usersStore.winners"
          :key="winner.id"
          class="winner-tag"
        >
          <span>⭐ {{ winner.firstName }} {{ winner.lastName }} (#{{ winner.id }})</span>
          <button
            type="button"
            class="winner-tag__remove"
            title="Прибрати переможця"
            @click="usersStore.removeWinner(winner.id)"
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
    <div class="card border-0 shadow-sm p-3 mb-4">
      <div class="row g-2 align-items-center">
        <div class="col-md-6 col-lg-5">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 text-muted">
              🔍
            </span>
            <input
              type="text"
              class="form-control border-start-0"
              placeholder="Пошук за ім'ям, прізвищем, email або username..."
              :value="searchInput"
              @input="onSearchInput"
            />
            <button
              v-if="searchInput"
              class="btn btn-outline-secondary"
              type="button"
              title="Очистити пошук"
              @click="clearSearch"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="col-md-6 col-lg-7 text-md-end text-muted small">
          Знайдено користувачів: <strong>{{ usersStore.total }}</strong>
          <span v-if="usersStore.searchQuery"> (за запитом "{{ usersStore.searchQuery }}")</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="mt-2 text-muted">Завантаження користувачів...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="usersStore.error" class="alert alert-danger">
      <h5 class="alert-heading">Помилка завантаження</h5>
      <p class="mb-0">{{ usersStore.error }}</p>
    </div>

    <!-- Table of Users -->
    <div v-else class="card border-0 shadow-sm overflow-hidden mb-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width: 60px">ID</th>
              <th scope="col">Користувач</th>
              <th scope="col">Контакти</th>
              <th scope="col">Вік / Стать</th>
              <th scope="col" class="text-end" style="min-width: 190px">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in usersStore.users"
              :key="user.id"
              :class="{ 'table-warning': usersStore.winnerIds.includes(user.id) }"
            >
              <td class="fw-bold text-muted">#{{ user.id }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img
                    :src="user.image || `https://dummyjson.com/icon/${user.username}/128`"
                    :alt="user.username"
                    class="rounded-circle border"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div class="fw-semibold text-dark">
                      {{ user.firstName }} {{ user.lastName }}
                      <span v-if="usersStore.winnerIds.includes(user.id)" class="badge bg-warning text-dark ms-1">
                        🏆 Winner
                      </span>
                    </div>
                    <div class="text-muted small">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="small text-truncate" style="max-width: 220px">{{ user.email }}</div>
                <div class="small text-muted">{{ user.phone || '—' }}</div>
              </td>
              <td>
                <span class="small">{{ user.age }} р., <span class="text-capitalize">{{ user.gender }}</span></span>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <RouterLink
                    :to="`/users/${user.id}`"
                    class="btn btn-outline-primary"
                    title="Повна інформація про юзера"
                  >
                    Деталі
                  </RouterLink>
                  <RouterLink
                    :to="`/users/${user.id}/edit`"
                    class="btn btn-outline-secondary"
                    title="Редагувати"
                  >
                    Редагувати
                  </RouterLink>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    title="Видалити"
                    @click="openDeleteModal(user)"
                  >
                    Видалити
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="usersStore.users.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                Користувачів не знайдено.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="card-footer bg-white border-top py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div class="text-muted small">
          Сторінка <strong>{{ usersStore.currentPage }}</strong> з <strong>{{ usersStore.totalPages }}</strong>
        </div>

        <nav aria-label="Пагінація користувачів">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: usersStore.currentPage <= 1 }">
              <button class="page-link" type="button" @click="goToPage(usersStore.currentPage - 1)">
                Попередня
              </button>
            </li>

            <li
              v-for="p in Math.min(5, usersStore.totalPages)"
              :key="p"
              class="page-item"
              :class="{ active: usersStore.currentPage === p }"
            >
              <button class="page-link" type="button" @click="goToPage(p)">
                {{ p }}
              </button>
            </li>

            <li v-if="usersStore.totalPages > 5 && usersStore.currentPage > 3" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li class="page-item" :class="{ disabled: usersStore.currentPage >= usersStore.totalPages }">
              <button class="page-link" type="button" @click="goToPage(usersStore.currentPage + 1)">
                Наступна
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Create User Modal -->
    <UserFormModal
      v-model="isCreateModalOpen"
      :is-loading="usersStore.isLoading"
      @submit="handleCreateUser"
    />

    <!-- Delete Confirmation Modal -->
    <Modal v-model="isDeleteModalOpen" title="Підтвердження видалення">
      <template #body>
        <p v-if="userToDelete" class="mb-0">
          Ви дійсно бажаєте видалити користувача
          <strong>"{{ userToDelete.firstName }} {{ userToDelete.lastName }}"</strong>
          (<em>{{ userToDelete.email }}</em>)?
        </p>
      </template>
      <template #footer>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          @click="isDeleteModalOpen = false"
        >
          Скасувати
        </button>
        <button
          type="button"
          class="btn btn-danger btn-sm"
          :disabled="usersStore.isLoading"
          @click="confirmDelete"
        >
          <span v-if="usersStore.isLoading" class="spinner-border spinner-border-sm me-1" role="status" />
          {{ usersStore.isLoading ? 'Видалення...' : 'Так, видалити' }}
        </button>
      </template>
    </Modal>
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
