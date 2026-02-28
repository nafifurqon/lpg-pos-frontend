import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, RegisterPayload, LoginPayload } from '@/types/auth.types'
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle as loginWithGoogleApi,
  logoutApi,
} from '@/api/auth.api'
import { getMyShop } from '@/api/shop.api'
import { useShopStore } from '@/store/shop.store'

interface AuthState {
  user: User | null
  /** Access token — also kept in localStorage under 'access_token' for the Axios interceptor. */
  token: string | null
  /** Refresh token — kept in localStorage under 'refresh_token' for the Axios retry interceptor. */
  refreshToken: string | null
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
  /** Invalidate the session on the backend, then clear all auth state. */
  logout: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // ── Actions ────────────────────────────────────────────────────────────
      register: async (payload) => {
        const response = await registerWithEmail(payload)
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        set({
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        })
        // New user — no shop yet; no need to fetch
      },

      loginWithEmail: async (payload) => {
        const response = await loginWithEmail(payload)
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        set({
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        })
        const shop = await getMyShop().catch(() => null)
        useShopStore.getState().setShop(shop)
      },

      loginWithGoogle: async (code) => {
        const response = await loginWithGoogleApi(code)
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        set({
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        })
        const shop = await getMyShop().catch(() => null)
        useShopStore.getState().setShop(shop)
      },

      logout: async () => {
        const { refreshToken } = get()
        if (refreshToken) {
          try {
            await logoutApi(refreshToken)
          } catch {
            // Ignore API errors on logout — always clear local state
          }
        }
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
