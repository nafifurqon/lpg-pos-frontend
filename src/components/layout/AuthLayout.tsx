import { Flame } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
}

/**
 * Layout wrapper for authentication pages (login and register).
 *
 * Mobile  : full-screen centered card
 * Desktop : split layout — branding panel on the left, form panel on the right
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel (hidden on mobile) ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12 text-white">
        <div className="max-w-sm text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-white/20 rounded-full p-5">
              <Flame className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">LPG POS</h1>
            <p className="mt-2 text-lg text-white/80">
              Sistem Point of Sales
            </p>
            <p className="text-white/70">
              Pangkalan Gas LPG
            </p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Kelola penjualan, stok, dan laporan pangkalan gas LPG Anda dengan mudah dan efisien.
          </p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-background">
        {/* Mobile logo — visible only on small screens */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="bg-primary rounded-full p-2">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">LPG POS</span>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
