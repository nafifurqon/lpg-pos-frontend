import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, RegisterPayload, LoginPayload } from '@/types/auth.types'
import { registerWithEmail, loginWithEmail, loginWithGoogle as loginWithGoogleApi } from '@/api/auth.api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  /** Register a new user with email and password, then auto-login. */
  register: (payload: RegisterPayload) => Promise<void>
  /** Login with email and password. */
  loginWithEmail: (payload: LoginPayload) => Promise<void>
  /**
   * Login or register via Google OAuth.
   * @param code - Authorization code from Google OAuth popup.
   *               The backend exchanges this with Google using client_secret.
   */
  loginWithGoogle: (code: string) => Promise<void>
  /** Clear auth state and token from storage. */
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Actions ────────────────────────────────────────────────────────────
      register: async (payload) => {
        const response = await registerWithEmail(payload)
        localStorage.setItem('auth-token', response.token)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        })
      },

      loginWithEmail: async (payload) => {
        const response = await loginWithEmail(payload)
        localStorage.setItem('auth-token', response.token)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        })
      },

      loginWithGoogle: async (code) => {
        const response = await loginWithGoogleApi(code)
        localStorage.setItem('auth-token', response.token)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('auth-token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and token; isAuthenticated is derived
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
