export interface UserAddress {
  address: string
  city: string
  state?: string
  stateCode?: string
  postalCode?: string
  country?: string
}

export interface UserCompany {
  department?: string
  name: string
  title: string
  address?: UserAddress
}

export interface UserHair {
  color?: string
  type?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: UserHair
  ip?: string
  address?: UserAddress
  macAddress?: string
  university?: string
  bank?: Record<string, unknown>
  company?: UserCompany
  role?: string
}

export type CreateUserDto = Omit<User, 'id' | 'bank' | 'company' | 'hair' | 'address'> & {
  address?: UserAddress
  company?: UserCompany
}

export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface UserQueryParams {
  limit?: number
  skip?: number
  q?: string
}
