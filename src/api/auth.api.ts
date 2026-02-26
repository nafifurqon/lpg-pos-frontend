import type { AuthResponse, RegisterPayload, LoginPayload } from '@/types/auth.types'

// ─── Mock data ────────────────────────────────────────────────────────────────
// Remove this section and uncomment the real API calls below once the
// NestJS backend is ready.

const MOCK_DELAY = 800 // Simulate network latency (ms)

const mockAuthResponse = (email: string): AuthResponse => ({
  user: {
    id: 'mock-user-id-001',
    email,
    name: email.split('@')[0],
    role: 'owner',
  },
  token: 'mock-jwt-token-xxx',
})

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Register a new user with email and password.
 * Backend endpoint: POST /auth/register
 */
export async function registerWithEmail(payload: RegisterPayload): Promise<AuthResponse> {
  // TODO: uncomment when backend is ready
  // const response = await apiClient.post<AuthResponse>('/auth/register', payload)
  // return response.data

  await new Promise((r) => setTimeout(r, MOCK_DELAY))
  return mockAuthResponse(payload.email)
}

/**
 * Login with email and password.
 * Backend endpoint: POST /auth/login
 */
export async function loginWithEmail(payload: LoginPayload): Promise<AuthResponse> {
  // TODO: uncomment when backend is ready
  // const response = await apiClient.post<AuthResponse>('/auth/login', payload)
  // return response.data

  await new Promise((r) => setTimeout(r, MOCK_DELAY))
  return mockAuthResponse(payload.email)
}

/**
 * Exchange a Google OAuth authorization code for an app JWT.
 * The backend verifies the code with Google using the client_secret,
 * then returns the app's own JWT.
 * Backend endpoint: POST /auth/google
 *
 * @param code - Authorization code from Google OAuth popup
 */
export async function loginWithGoogle(code: string): Promise<AuthResponse> {
  // TODO: uncomment when backend is ready
  // const response = await apiClient.post<AuthResponse>('/auth/google', { code })
  // return response.data

  console.info('[Mock] Google login with code:', code.slice(0, 20) + '...')
  await new Promise((r) => setTimeout(r, MOCK_DELAY))
  return mockAuthResponse('google-user@gmail.com')
}
