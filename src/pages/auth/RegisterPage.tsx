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
import { PasswordStrengthChecklist } from '@/components/shared/PasswordStrengthChecklist'
import { registerSchema, type RegisterFormValues } from '@/lib/validations'
import { useAuthStore } from '@/store/auth.store'
import { useShopStore } from '@/store/shop.store'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = form.watch('password')

  /** After Google OAuth on the register page, redirect based on whether the user
   * already has a shop. Reads live store state to avoid stale closure.
   */
  const redirectAfterLogin = () => {
    const shop = useShopStore.getState().shop
    navigate(shop ? '/dashboard' : '/onboarding/shop')
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setGlobalError(null)
    setIsLoading(true)
    try {
      await register({ email: values.email, password: values.password })
      navigate('/onboarding/shop')
    } catch {
      setGlobalError('Pendaftaran gagal. Silakan coba lagi.')
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
          <CardTitle className="text-2xl font-bold">Buat Akun</CardTitle>
          <CardDescription>
            Daftarkan diri Anda sebagai pemilik pangkalan
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google OAuth */}
          <GoogleOAuthButton
            label="Daftar dengan Google"
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
                          placeholder="Buat password yang kuat"
                          autoComplete="new-password"
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
                    <PasswordStrengthChecklist password={passwordValue} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Ulangi password"
                          autoComplete="new-password"
                          disabled={isLoading || isGoogleLoading}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                          aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Mendaftar...' : 'Daftar'}
              </Button>
            </form>
          </Form>

          {/* Link to login */}
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
