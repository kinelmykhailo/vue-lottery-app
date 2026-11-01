import { http } from '@/shared/api'
import type { LoginCredentials, AuthResponse, AuthUser, RefreshResponse } from '../model/types'

export class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        expiresInMins: credentials.expiresInMins ?? 60
      })
    })
  }

  me(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me')
  }

  refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 60
      })
    })
  }
}
