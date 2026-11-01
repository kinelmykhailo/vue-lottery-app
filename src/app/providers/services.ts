import { ServiceProvider } from '@/shared/api'
import { UserService } from '@/entities/user'
import { AuthService } from '@/entities/session'

export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}
