import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { ServiceProvider } from '@/services/service-provider'
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens
} from '@/api/http-client'

const USER_STORAGE_KEY = 'auth:user'

function getInitialUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(getInitialUser())
  const accessToken = ref<string | null>(getStoredAccessToken())
  const refreshToken = ref<string | null>(getStoredRefreshToken())
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed<boolean>(() => Boolean(accessToken.value))

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await ServiceProvider.auth.login(credentials)
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken

      const userData: AuthUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image
      }

      user.value = userData
      setStoredTokens(response.accessToken, response.refreshToken)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    } catch (e) {
      error.value = (e as Error).message || 'Помилка авторизації. Перевірте логін та пароль.'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe(): Promise<void> {
    if (!accessToken.value) return

    try {
      const current = await ServiceProvider.auth.me()
      user.value = current
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(current))
    } catch {
      // If fetching me fails and token is invalid
    }
  }

  function logout(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null
    clearStoredTokens()
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchMe,
    logout
  }
})
