export type Role = 'admin' | 'manager' | 'driver'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: Role
  date_joined: string
}

export interface RegisterData {
  email: string
  first_name: string
  last_name: string
  password: string
  role: Role
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: RegisterData) => Promise<User>
  logout: () => Promise<void>
}
