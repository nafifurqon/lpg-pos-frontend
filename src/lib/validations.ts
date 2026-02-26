import { z } from 'zod'

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special symbol (!@#$%^&*()_+-=[]{}|;':",.<>?/`~\)
 *
 * These same rules should be mirrored in the NestJS backend validator.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
  .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
  .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
  .regex(
    /[!@#$%^&*()\-_=+[\]{}|;':",.<>?/`~\\]/,
    'Password harus mengandung minimal 1 simbol (contoh: !@#$%^&*)'
  )

/** Individual rule checks for live password strength indicator */
export const passwordRules = [
  {
    id: 'minLength',
    label: 'Minimal 8 karakter',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Minimal 1 huruf besar (A-Z)',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Minimal 1 huruf kecil (a-z)',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'digit',
    label: 'Minimal 1 angka (0-9)',
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    id: 'symbol',
    label: 'Minimal 1 simbol (!@#$%^&* dll)',
    test: (value: string) => /[!@#$%^&*()\-_=+[\]{}|;':",.<>?/`~\\]/.test(value),
  },
] as const

/** Register form schema */
export const registerSchema = z
  .object({
    email: z.string().email('Format email tidak valid'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

/** Login form schema */
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

/** Register shop form schema */
export const registerShopSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama pangkalan wajib diisi')
    .max(100, 'Nama pangkalan maksimal 100 karakter'),
  address: z
    .string()
    .min(1, 'Alamat pangkalan wajib diisi')
    .max(500, 'Alamat pangkalan maksimal 500 karakter'),
  registrationNumber: z
    .string()
    .max(50, 'Nomor registrasi maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterShopFormValues = z.infer<typeof registerShopSchema>
