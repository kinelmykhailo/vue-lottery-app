import { http, type Readable, type Creatable, type Editable, type Deletable } from '@/shared/api'
import type { User, CreateUserDto, UpdateUserDto, UsersResponse, UserQueryParams } from '../model/types'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll({ limit = 10, skip = 0 }: { limit?: number; skip?: number } = {}): Promise<User[]> {
    const data = await http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
    return data.users
  }

  async getPaginated({ limit = 10, skip = 0, q = '' }: UserQueryParams = {}): Promise<UsersResponse> {
    const trimmed = q.trim()
    if (trimmed) {
      return http<UsersResponse>(
        `/users/search?q=${encodeURIComponent(trimmed)}&limit=${limit}&skip=${skip}`
      )
    }
    return http<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
