import axios from 'axios'

/**
 * Axios instance configured for the LPG POS backend.
 * Base URL is read from the VITE_API_BASE_URL environment variable.
 * Default: http://localhost:6000
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: attach the JWT access token to every outgoing request.
 * The token is read from localStorage where the auth store persists it.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Response interceptor: handle 401 with a refresh-then-retry strategy.
 *
 * On 401:
 *   1. Read the refresh token from localStorage.
 *   2. Call POST /auth/refresh via raw axios (not apiClient) to avoid re-entrance.
 *   3. Persist the new token pair to localStorage.
 *   4. Retry the original request once with the new access token.
 *
 * If the refresh fails, or there is no refresh token stored, clear all tokens
 * and redirect to /login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const config = error.config as (typeof error.config & { _retry?: boolean }) | undefined

    // Already retried once — give up, clear state and redirect
    if (!config || config._retry) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    const storedRefreshToken = localStorage.getItem('refresh_token')
    if (!storedRefreshToken) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    config._retry = true

    try {
      // Raw axios call — bypasses the apiClient interceptors to prevent infinite loop
      const { data } = await axios.post<{ result: { access_token: string; refresh_token: string } }>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        null,
        { headers: { Authorization: `Bearer ${storedRefreshToken}` } },
      )
      const { access_token, refresh_token } = data.result
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // Retry the original request with the refreshed access token
      config.headers.Authorization = `Bearer ${access_token}`
      return apiClient(config)
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
  },
)

export default apiClient
