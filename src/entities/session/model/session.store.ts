import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider, setStoredTokens, clearStoredTokens } from '@/shared/api'
import type { AuthService, AuthUser, LoginCredentials } from '../index'

const STORAGE_KEY = 'session'

export const useSessionStore = defineStore(
  'session',
  () => {
    const accessToken = ref<string | null>(localStorage.getItem(`${STORAGE_KEY}:token`))
    const refreshToken = ref<string | null>(localStorage.getItem(`${STORAGE_KEY}:refreshToken`))
    const user = ref<AuthUser | null>(getStoredUser())
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => accessToken.value !== null)
    const service = () => ServiceProvider.get<AuthService>('auth')

    function getStoredUser(): AuthUser | null {
      const raw = localStorage.getItem(`${STORAGE_KEY}:user`)
      if (!raw) return null
      try {
        return JSON.parse(raw) as AuthUser
      } catch {
        return null
      }
    }

    function setSession(token: string, refresh?: string, userData?: AuthUser): void {
      accessToken.value = token
      localStorage.setItem(`${STORAGE_KEY}:token`, token)

      if (refresh) {
        refreshToken.value = refresh
        localStorage.setItem(`${STORAGE_KEY}:refreshToken`, refresh)
      }

      if (userData) {
        user.value = userData
        localStorage.setItem(`${STORAGE_KEY}:user`, JSON.stringify(userData))
      }

      setStoredTokens(token, refresh || refreshToken.value || '')
    }

    function clearSession(): void {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      error.value = null
      localStorage.removeItem(`${STORAGE_KEY}:token`)
      localStorage.removeItem(`${STORAGE_KEY}:refreshToken`)
      localStorage.removeItem(`${STORAGE_KEY}:user`)
      clearStoredTokens()
    }

    async function login(credentials: LoginCredentials): Promise<void> {
      isLoading.value = true
      error.value = null

      try {
        const response = await service().login(credentials)
        const userData: AuthUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image
        }

        setSession(response.accessToken, response.refreshToken, userData)
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
        const current = await service().me()
        user.value = current
        localStorage.setItem(`${STORAGE_KEY}:user`, JSON.stringify(current))
      } catch {
        // Token might be invalid
      }
    }

    function logout(): void {
      clearSession()
    }

    return {
      accessToken,
      refreshToken,
      user,
      isLoading,
      error,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      fetchMe,
      logout
    }
  },
  {
    persist: {
      key: 'session:persisted',
      paths: ['accessToken', 'refreshToken', 'user']
    }
  }
)
