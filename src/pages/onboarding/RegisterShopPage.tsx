import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Flame, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { registerShopSchema, type RegisterShopFormValues } from '@/lib/validations'
import { useShopStore } from '@/store/shop.store'
import { useAuthStore } from '@/store/auth.store'

export function RegisterShopPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const createShop = useShopStore((s) => s.createShop)

  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<RegisterShopFormValues>({
    resolver: zodResolver(registerShopSchema),
    defaultValues: {
      name: '',
      address: '',
      registrationNumber: '',
    },
  })

  const nameValue = form.watch('name') ?? ''
  const addressValue = form.watch('address') ?? ''
  const regNumberValue = form.watch('registrationNumber') ?? ''

  const onSubmit = async (values: RegisterShopFormValues) => {
    setGlobalError(null)
    setIsLoading(true)
    try {
      await createShop({
        name: values.name,
        address: values.address,
        registrationNumber: values.registrationNumber || undefined,
      })
      navigate('/dashboard')
    } catch {
      setGlobalError('Pendaftaran pangkalan gagal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-primary rounded-full p-2">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">LPG POS</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Daftarkan Pangkalan Anda</CardTitle>
            <CardDescription>
              {user?.name ? `Halo, ${user.name}! ` : ''}
              Lengkapi data pangkalan gas LPG Anda untuk melanjutkan.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {globalError && (
              <p className="text-sm text-destructive text-center rounded-md bg-destructive/10 px-3 py-2 mb-4">
                {globalError}
              </p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Shop Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Nama Pangkalan <span className="text-destructive">*</span>
                        </FormLabel>
                        <span className={`text-xs ${nameValue.length > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {nameValue.length}/100
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Pangkalan Jaya Abadi"
                          disabled={isLoading}
                          maxLength={105}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Shop Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Alamat Pangkalan <span className="text-destructive">*</span>
                        </FormLabel>
                        <span className={`text-xs ${addressValue.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {addressValue.length}/500
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Contoh: Jl. Raya Bogor No. 123, RT 01/RW 02, Kelurahan Cipayung, Jakarta Timur 13840"
                          disabled={isLoading}
                          className="min-h-[100px] resize-none"
                          maxLength={505}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Number (optional) */}
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Nomor Registrasi</FormLabel>
                        <span className={`text-xs ${(regNumberValue?.length ?? 0) > 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {regNumberValue?.length ?? 0}/50
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Contoh: REG-2024-001 (opsional)"
                          disabled={isLoading}
                          maxLength={55}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nomor registrasi resmi dari pemerintah (jika ada).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Mendaftarkan...' : 'Daftarkan Pangkalan'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
