import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'
import { ServiceProvider } from '@/services/service-provider'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref<number>(0)
  const limit = ref<number>(10)
  const skip = ref<number>(0)
  const searchQuery = ref<string>('')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Lottery winners: array of user ids
  const winnerIds = ref<number[]>([])

  const currentPage = computed<number>(() => Math.floor(skip.value / limit.value) + 1)
  const totalPages = computed<number>(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const winners = computed<User[]>(() =>
    winnerIds.value
      .map((id) => users.value.find((u) => u.id === id))
      .filter((u): u is User => Boolean(u))
  )

  const canPickWinner = computed<boolean>(
    () =>
      winnerIds.value.length < 3 &&
      users.value.length > 0 &&
      users.value.some((u) => !winnerIds.value.includes(u.id))
  )

  function pickWinner(): void {
    if (!canPickWinner.value) return
    const eligible = users.value.filter((u) => !winnerIds.value.includes(u.id))
    const randomIndex = Math.floor(Math.random() * eligible.length)
    winnerIds.value.push(eligible[randomIndex].id)
  }

  function removeWinner(id: number): void {
    winnerIds.value = winnerIds.value.filter((wId) => wId !== id)
  }

  async function fetchUsers(params: { page?: number; limit?: number; q?: string } = {}): Promise<void> {
    isLoading.value = true
    error.value = null

    if (params.limit !== undefined) {
      limit.value = params.limit
    }

    const page = params.page ?? 1
    skip.value = (page - 1) * limit.value
    searchQuery.value = params.q ?? ''

    try {
      const response = await ServiceProvider.users.getPaginated({
        limit: limit.value,
        skip: skip.value,
        q: searchQuery.value
      })
      users.value = response.users
      total.value = response.total
    } catch (e) {
      error.value = (e as Error).message || 'Помилка завантаження списку користувачів'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null

    try {
      const created = await ServiceProvider.users.create(data)

      // DummyJSON simulates addition by returning created user with new id (e.g. 209).
      // We manually update our local state:
      const fullCreatedUser: User = {
        ...created,
        image: created.image || `https://dummyjson.com/icon/${created.username || 'user'}/128`
      }

      users.value.unshift(fullCreatedUser)
      total.value += 1
      return fullCreatedUser
    } catch (e) {
      error.value = (e as Error).message || 'Помилка створення користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null

    try {
      const updated = await ServiceProvider.users.update(id, data)

      // Update in local array
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated }
      }
      return updated
    } catch (e) {
      error.value = (e as Error).message || 'Помилка оновлення даних користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await ServiceProvider.users.delete(id)

      // Remove from local list
      users.value = users.value.filter((u) => u.id !== id)
      total.value = Math.max(0, total.value - 1)

      // Also remove from winners if present
      removeWinner(id)
    } catch (e) {
      error.value = (e as Error).message || 'Помилка видалення користувача'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    total,
    limit,
    skip,
    searchQuery,
    isLoading,
    error,
    winnerIds,
    winners,
    canPickWinner,
    currentPage,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    pickWinner,
    removeWinner
  }
})
