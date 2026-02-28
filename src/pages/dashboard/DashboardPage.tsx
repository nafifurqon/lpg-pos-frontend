import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, LogOut, MapPin, Hash, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth.store'
import { useShopStore } from '@/store/shop.store'
import apiClient from '@/api/client'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const shop = useShopStore((s) => s.shop)
  const clearShop = useShopStore((s) => s.clearShop)

  // Silent auth verification — confirms the access token is valid on every visit.
  // The Axios interceptor handles 401 transparently (refresh + retry, or redirect to /login).
  useEffect(() => {
    apiClient.get('/dashboard').catch(() => { /* handled by interceptor */ })
  }, [])

  const handleLogout = async () => {
    await logout()
    clearShop()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Top navigation bar ──────────────────────────────────────────────── */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-primary">LPG POS</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali, <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </div>

        <Separator />

        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* User info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-semibold">{user?.email ?? '—'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="inline-block text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium capitalize">
                {user?.role === 'owner' ? 'Pemilik' : 'Admin'}
              </span>
            </CardContent>
          </Card>

          {/* Shop info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Informasi Pangkalan
              </CardTitle>
              <CardDescription>{shop?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{shop?.address}</span>
              </div>
              {shop?.registrationNumber && (
                <div className="flex gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{shop.registrationNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Placeholder content */}
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-sm">
              Fitur-fitur berikutnya akan ditampilkan di sini.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
