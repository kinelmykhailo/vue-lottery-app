import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService, User, CreateUserDto, UpdateUserDto } from '../index'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref<number>(0)
  const limit = ref<number>(10)
  const skip = ref<number>(0)
  const searchQuery = ref<string>('')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Lottery winners (max 3)
  const winnerIds = ref<number[]>([])

  const hasUsers = computed(() => users.value.length > 0)
  const currentPage = computed(() => Math.floor(skip.value / limit.value) + 1)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const winners = computed<User[]>(() =>
    winnerIds.value
      .map((id) => users.value.find((u) => u.id === id))
      .filter((u): u is User => Boolean(u))
  )

  const canPickWinner = computed(
    () =>
      winnerIds.value.length < 3 &&
      users.value.length > 0 &&
      users.value.some((u) => !winnerIds.value.includes(u.id))
  )

  const service = () => ServiceProvider.get<UserService>('users')

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
      const data = await service().getPaginated({
        limit: limit.value,
        skip: skip.value,
        q: searchQuery.value
      })
      users.value = data.users
      total.value = data.total
    } catch (e) {
      error.value = (e as Error).message || 'Помилка завантаження користувачів'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(id: number): Promise<User | null> {
    const existing = users.value.find((u) => u.id === id)
    if (existing) return existing

    isLoading.value = true
    error.value = null

    try {
      const fetched = await service().getById(id)
      return fetched
    } catch (e) {
      error.value = (e as Error).message || `Користувача #${id} не знайдено`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    isLoading.value = true
    error.value = null

    try {
      const created = await service().create(data)
      const fullCreatedUser: User = {
        ...created,
        image: created.image || `https://dummyjson.com/icon/${created.username || 'user'}/128`
      }

      // Manually update local state since DummyJSON mocks mutation
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
      const updated = await service().update(id, data)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated }
      }
      return updated
    } catch (e) {
      error.value = (e as Error).message || 'Помилка оновлення даних'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await service().delete(id)
      // Manually update local state
      users.value = users.value.filter((u) => u.id !== id)
      total.value = Math.max(0, total.value - 1)
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
    hasUsers,
    winnerIds,
    winners,
    canPickWinner,
    currentPage,
    totalPages,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
    pickWinner,
    removeWinner
  }
})
