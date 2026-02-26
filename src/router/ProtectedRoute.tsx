import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useShopStore } from '@/store/shop.store'

interface ProtectedRouteProps {
  /** If true, the route also requires the user to have a registered shop. */
  requireShop?: boolean
}

/**
 * Guards routes based on authentication and onboarding state.
 *
 * Rules:
 * - Not authenticated           → redirect to /login
 * - Authenticated, no shop yet  → redirect to /onboarding/shop
 *   (only when requireShop=true, e.g. /dashboard)
 */
export function ProtectedRoute({ requireShop = false }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const shop = useShopStore((s) => s.shop)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireShop && !shop) {
    return <Navigate to="/onboarding/shop" replace />
  }

  return <Outlet />
}

/**
 * Redirects already-authenticated users away from auth pages (login/register).
 * If authenticated + has shop → go to /dashboard.
 * If authenticated + no shop  → go to /onboarding/shop.
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const shop = useShopStore((s) => s.shop)

  if (isAuthenticated) {
    return <Navigate to={shop ? '/dashboard' : '/onboarding/shop'} replace />
  }

  return <Outlet />
}
