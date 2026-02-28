import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { GoogleOAuthButton } from '@/components/shared/GoogleOAuthButton'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { useAuthStore } from '@/store/auth.store'
import { useShopStore } from '@/store/shop.store'

export function LoginPage() {
  const navigate = useNavigate()
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail)
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /** After successful auth, redirect based on whether the user has a shop.
   * Reads shop state directly from the store (not from the React hook)
   * to avoid stale closure — the store is updated before this runs.
   */
  const redirectAfterLogin = () => {
    const shop = useShopStore.getState().shop
    navigate(shop ? '/dashboard' : '/onboarding/shop')
  }

  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError(null)
    setIsLoading(true)
    try {
      await loginWithEmail({ email: values.email, password: values.password })
      redirectAfterLogin()
    } catch {
      setGlobalError('Email atau password salah. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleCode = async (code: string) => {
    setGlobalError(null)
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle(code)
      redirectAfterLogin()
    } catch {
      setGlobalError('Google login gagal. Silakan coba lagi.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>Masuk ke akun pangkalan Anda</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google OAuth */}
          <GoogleOAuthButton
            label="Masuk dengan Google"
            onCode={handleGoogleCode}
            onError={(msg) => setGlobalError(msg)}
            isLoading={isGoogleLoading}
            disabled={isLoading}
          />

          {/* Separator */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">atau</span>
            <Separator className="flex-1" />
          </div>

          {/* Global error */}
          {globalError && (
            <p className="text-sm text-destructive text-center rounded-md bg-destructive/10 px-3 py-2">
              {globalError}
            </p>
          )}

          {/* Email & Password form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        autoComplete="email"
                        disabled={isLoading || isGoogleLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Masukkan password"
                          autoComplete="current-password"
                          disabled={isLoading || isGoogleLoading}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>
          </Form>

          {/* Link to register */}
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
