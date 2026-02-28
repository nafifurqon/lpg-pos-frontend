import apiClient from '@/api/client'
import type { ApiResponse, AuthResponse, RegisterPayload, LoginPayload } from '@/types/auth.types'

/**
 * Register a new user with email and password.
 * Backend endpoint: POST /auth/register
 */
export async function registerWithEmail(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload)
  return data.result
}

/**
 * Login with email and password.
 * Backend endpoint: POST /auth/login
 */
export async function loginWithEmail(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload)
  return data.result
}

/**
 * Exchange a Google OAuth authorization code for an app token pair + user.
 * The backend verifies the code with Google using the client_secret.
 * Backend endpoint: POST /auth/google
 *
 * @param code - Authorization code from Google OAuth popup
 */
export async function loginWithGoogle(code: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { code })
  return data.result
}

/**
 * Use a refresh token to obtain a new token pair + user.
 * Sends the token via Authorization: Bearer header (JwtRefreshStrategy reads from Bearer).
 * NOTE: called by the Axios interceptor in client.ts via raw axios — not this function —
 * to avoid circular re-entrance. This export is for explicit use in the auth store.
 * Backend endpoint: POST /auth/refresh
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/refresh',
    null,
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  )
  return data.result
}

/**
 * Invalidate the current refresh token session on the backend.
 * Sends the refresh token via Authorization: Bearer header.
 * Backend endpoint: POST /auth/logout
 */
export async function logoutApi(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', null, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  })
}
