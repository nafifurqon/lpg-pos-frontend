export type UserRole = 'owner' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface ApiResponse<T> {
  message: string
  result: T
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
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
