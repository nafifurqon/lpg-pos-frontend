import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { RegisterShopPage } from '@/pages/onboarding/RegisterShopPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'

export const router = createBrowserRouter([
  // ── Guest-only routes (redirect if already authenticated) ──────────────────
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── Onboarding: requires auth, but does NOT require shop yet ───────────────
  {
    element: <ProtectedRoute requireShop={false} />,
    children: [
      { path: '/onboarding/shop', element: <RegisterShopPage /> },
    ],
  },

  // ── Protected app routes: requires auth + shop ─────────────────────────────
  {
    element: <ProtectedRoute requireShop={true} />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },

  // ── Fallback ───────────────────────────────────────────────────────────────
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
