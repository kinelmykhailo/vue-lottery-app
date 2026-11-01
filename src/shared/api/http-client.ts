const BASE_URL = (import.meta.env.VITE_API_URL || 'https://dummyjson.com').replace(/\/+$/, '')

const ACCESS_TOKEN_KEY = 'auth:accessToken'
const REFRESH_TOKEN_KEY = 'auth:refreshToken'

let isRefreshing = false
let refreshSubscribers: Array<(token: string | null) => void> = []

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb)
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setStoredTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem('auth:user')
  localStorage.removeItem('session:token')
  localStorage.removeItem('session:user')
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken, expiresInMins: 60 })
    })

    if (!response.ok) {
      clearStoredTokens()
      return null
    }

    const data = (await response.json()) as { accessToken: string; refreshToken?: string }
    setStoredTokens(data.accessToken, data.refreshToken || refreshToken)
    return data.accessToken
  } catch {
    clearStoredTokens()
    return null
  }
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${BASE_URL}${normalizedPath}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }

  const token = getStoredAccessToken() || localStorage.getItem('session:token')
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(url, {
    ...options,
    headers
  })

  // 401 Interceptor: refresh token automatically
  const isAuthEndpoint =
    normalizedPath.startsWith('/auth/login') || normalizedPath.startsWith('/auth/refresh')
  if (response.status === 401 && !isAuthEndpoint && getStoredRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true
      const newToken = await refreshAccessToken()
      isRefreshing = false
      onRefreshed(newToken)

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, {
          ...options,
          headers
        })
      }
    } else {
      const newToken = await new Promise<string | null>((resolve) => {
        subscribeTokenRefresh((t) => resolve(t))
      })

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, {
          ...options,
          headers
        })
      }
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errData = await response.json()
      if (errData && typeof errData === 'object' && 'message' in errData) {
        errorMessage = String((errData as { message: unknown }).message)
      }
    } catch {
      // Keep fallback
    }
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return response.json() as Promise<T>
}
