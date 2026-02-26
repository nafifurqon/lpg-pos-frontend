export type UserRole = 'owner' | 'admin'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface GoogleLoginPayload {
  /** Authorization code returned by Google OAuth. Sent to backend for server-side exchange. */
  code: string
}
