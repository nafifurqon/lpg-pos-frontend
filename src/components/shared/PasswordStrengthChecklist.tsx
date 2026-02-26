import { Check, X } from 'lucide-react'
import { passwordRules } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface PasswordStrengthChecklistProps {
  password: string
}

/**
 * Displays a live checklist of password strength rules.
 * Each rule shows a green check when satisfied, red cross when not.
 * Renders only when the password field has at least 1 character.
 */
export function PasswordStrengthChecklist({ password }: PasswordStrengthChecklistProps) {
  if (!password) return null

  return (
    <ul className="space-y-1 mt-2" aria-label="Persyaratan password">
      {passwordRules.map((rule) => {
        const passed = rule.test(password)
        return (
          <li
            key={rule.id}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              passed ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {passed ? (
              <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}
