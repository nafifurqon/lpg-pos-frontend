# Feature 01 — Register, Login & Register Shop (Frontend)

## Overview

Implements the complete authentication and onboarding UI: registration, login, Google OAuth, shop registration, and the initial dashboard view. Guards prevent access to wrong routes based on auth and onboarding state.

## Pages & Components

| File | Route | Description |
|---|---|---|
| `pages/auth/LoginPage.tsx` | `/login` | Email + password login; Google OAuth button |
| `pages/auth/RegisterPage.tsx` | `/register` | Email + password registration; Google OAuth button; password strength checklist |
| `pages/onboarding/RegisterShopPage.tsx` | `/onboarding/shop` | Shop name, address, registration number form |
| `pages/dashboard/DashboardPage.tsx` | `/dashboard` | Displays user name, shop name, logout button |
| `components/shared/GoogleOAuthButton.tsx` | — | Reusable Google OAuth trigger button |
| `components/shared/PasswordStrengthChecklist.tsx` | — | Live password rule checklist shown on Register page |
| `components/layout/AuthLayout.tsx` | — | Centered card layout wrapper for auth pages |

## Routes & Guards

```
router/index.tsx
│
├── GuestRoute (redirect to /dashboard if auth + has shop)
│   ├── /login       → LoginPage
│   └── /register    → RegisterPage
│
├── ProtectedRoute(requireShop=false)  (requires auth; redirect to /login if not)
│   └── /onboarding/shop  → RegisterShopPage
│
├── ProtectedRoute(requireShop=true)   (requires auth + shop; redirect accordingly)
│   └── /dashboard   → DashboardPage
│
├── /  → redirect /login
└── *  → redirect /login
```

## Zustand Stores

### `auth.store.ts`

```typescript
// State
user: User | null
token: string | null
isAuthenticated: boolean

// Actions
register(payload: RegisterPayload): Promise<void>
loginWithEmail(payload: LoginPayload): Promise<void>
loginWithGoogle(code: string): Promise<void>
logout(): void
```

Persisted to `localStorage` key `auth-storage`.

### `shop.store.ts`

```typescript
// State
shop: Shop | null

// Actions
createShop(payload: CreateShopPayload): Promise<void>
setShop(shop: Shop): void
clearShop(): void
```

Persisted to `localStorage` key `shop-storage`.

## Form Validation (Zod)

### Register

```typescript
{
  email: z.string().email(),
  password: passwordSchema,   // min 8, upper, lower, digit, symbol
  confirmPassword: // must match password
}
```

### Login

```typescript
{
  email: z.string().email(),
  password: z.string().min(1)
}
```

### Register Shop

```typescript
{
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  registrationNumber: z.string().max(50).optional()
}
```

Shared `passwordSchema` is defined in `src/lib/validations.ts`.

## API Functions (`src/api/auth.api.ts`)

| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `registerWithEmail(payload)` | POST | `/auth/register` | `AuthResponse` |
| `loginWithEmail(payload)` | POST | `/auth/login` | `AuthResponse` |
| `loginWithGoogle(code)` | POST | `/auth/google` | `AuthResponse` |

`src/api/shop.api.ts`:

| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `createShop(payload)` | POST | `/shops` | `Shop` |
| `getShop()` | GET | `/shops/mine` | `Shop` |

## Mock Data

Used while the backend is not yet connected:

```typescript
const mockUser = {
  id: "mock-user-id-001",
  email: "owner@example.com",
  name: "Mock Owner",
  role: "owner" as const,
};

const mockToken = "mock-jwt-token-xxx";

const mockShop = {
  id: "mock-shop-id-001",
  name: "Pangkalan Jaya Abadi",
  address: "Jl. Raya Bogor No. 123",
  registrationNumber: "REG-001",
  ownerId: "mock-user-id-001",
  createdAt: "2026-02-25T00:00:00.000Z",
};
```

> When backend is ready: uncomment real API calls in each store action and remove mock returns.

## UI/UX Notes

- Password strength checklist appears live as user types on the Register page
- Character counters are shown on constrained fields (shop name, address, reg number)
- All user-facing labels and strings are in **Indonesian**
- Auth pages use `AuthLayout` (centered card, max-width wrapper)
- After logout → all auth + shop state cleared → redirect to `/login`

## localStorage Keys

| Key | Content |
|---|---|
| `auth-storage` | `{ user, token, isAuthenticated }` |
| `shop-storage` | `{ shop }` |
| `auth-token` | Raw token string (also set via `localStorage.setItem` for interceptor use) |
