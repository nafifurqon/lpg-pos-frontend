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
 * Request interceptor: attach the JWT Bearer token to every request.
 * The token is read from localStorage (persisted by Zustand auth store).
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Response interceptor: handle 401 globally.
 * When the backend returns 401, clear the stored token and redirect to login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
