import type { Readable, Creatable, Editable, Deletable } from '../interfaces'
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user'

export class FakeUserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  private items: User[] = [
    {
      id: 1,
      firstName: 'Emily',
      lastName: 'Johnson',
      age: 28,
      gender: 'female',
      email: 'emily.johnson@x.dummyjson.com',
      phone: '+81 965-431-3024',
      username: 'emilys'
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Williams',
      age: 35,
      gender: 'male',
      email: 'michael.williams@x.dummyjson.com',
      phone: '+1 202-555-0143',
      username: 'michaelw'
    }
  ]

  async getAll({ limit = 10, skip = 0 }: { limit?: number; skip?: number } = {}): Promise<User[]> {
    return this.items.slice(skip, skip + limit)
  }

  async getById(id: number): Promise<User> {
    const item = this.items.find((u) => u.id === id)
    if (!item) throw new Error(`User with id ${id} not found`)
    return item
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: this.items.length ? Math.max(...this.items.map((u) => u.id)) + 1 : 1,
      ...data
    }
    this.items.unshift(newUser)
    return newUser
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const index = this.items.findIndex((u) => u.id === id)
    if (index === -1) throw new Error(`User with id ${id} not found`)
    const updated: User = { ...this.items[index], ...data }
    this.items[index] = updated
    return updated
  }

  async delete(id: number): Promise<void> {
    this.items = this.items.filter((u) => u.id !== id)
  }
}
