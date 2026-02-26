# LPG POS — Frontend Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| UI Components | Shadcn/ui + Tailwind CSS |
| State Management | Zustand (with `persist` middleware) |
| HTTP Client | Axios (with interceptors) |
| Form Handling | React Hook Form + Zod |
| Routing | React Router v6 |
| Google Auth | @react-oauth/google |

## Folder Structure (`src/`)

```
src/
├── api/                        # All HTTP calls to the backend
│   ├── client.ts               # Axios instance — base URL + auth interceptors
│   ├── auth.api.ts             # registerWithEmail, loginWithEmail, loginWithGoogle
│   └── shop.api.ts             # createShop, getShop
│
├── components/
│   ├── ui/                     # Shadcn/ui primitives (Button, Input, Card, Form, …)
│   ├── layout/                 # Page layout wrappers (AuthLayout, AppLayout)
│   └── shared/                 # Reusable business components
│       ├── GoogleOAuthButton.tsx
│       └── PasswordStrengthChecklist.tsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── onboarding/
│   │   └── RegisterShopPage.tsx
│   └── dashboard/
│       └── DashboardPage.tsx
│
├── router/
│   ├── index.tsx               # Route definitions (createBrowserRouter)
│   └── ProtectedRoute.tsx      # Auth + onboarding guards (GuestRoute, ProtectedRoute)
│
├── store/
│   ├── auth.store.ts           # Zustand: user, token, isAuthenticated, actions
│   └── shop.store.ts           # Zustand: current shop, createShop action
│
├── types/
│   ├── auth.types.ts           # User, AuthResponse, RegisterPayload, LoginPayload
│   └── shop.types.ts           # Shop, CreateShopPayload
│
├── lib/
│   ├── utils.ts                # cn() from shadcn, misc helpers
│   └── validations.ts          # Shared Zod schemas (password rules, etc.)
│
├── index.css                   # Tailwind base styles
└── main.tsx                    # App entry point
```

## Routing

Routes are defined in `src/router/index.tsx` using React Router v6 `createBrowserRouter`.

| Path | Component | Guard |
|---|---|---|
| `/login` | `LoginPage` | `GuestRoute` — redirects to `/dashboard` if auth + has shop |
| `/register` | `RegisterPage` | `GuestRoute` — redirects to `/dashboard` if auth + has shop |
| `/onboarding/shop` | `RegisterShopPage` | `ProtectedRoute(requireShop=false)` — requires auth |
| `/dashboard` | `DashboardPage` | `ProtectedRoute(requireShop=true)` — requires auth + shop |
| `/` | Redirect | → `/login` |
| `*` | Redirect | → `/login` |

### Auth & Onboarding Flow

```
/register or /login
    ↓ (on success)
auth.store sets user + token + isAuthenticated = true
    ↓
ProtectedRoute checks: has shop?
    → No  → /onboarding/shop
    → Yes → /dashboard
```

## State Management

### `auth.store.ts` (Zustand + persist)

| State | Type | Persisted |
|---|---|---|
| `user` | `User \| null` | Yes |
| `token` | `string \| null` | Yes |
| `isAuthenticated` | `boolean` | Yes |

Actions: `register(payload)`, `loginWithEmail(payload)`, `loginWithGoogle(code)`, `logout()`

Persisted to `localStorage` key `auth-storage` so state survives page refresh.

### `shop.store.ts` (Zustand + persist)

| State | Type | Persisted |
|---|---|---|
| `shop` | `Shop \| null` | Yes |

Actions: `createShop(payload)`, `setShop(shop)`, `clearShop()`

## HTTP Client (`src/api/client.ts`)

Axios instance with:
- Base URL from `import.meta.env.VITE_API_BASE_URL`
- Request interceptor: attaches `Authorization: Bearer <token>` from `auth-storage`
- Response interceptor: handles `401` (clears auth state, redirects to `/login`)

## Form Validation

All forms use **React Hook Form** + **Zod** resolver.

Shared schemas are defined in `src/lib/validations.ts`:
- `passwordSchema` — min 8 chars, ≥1 upper, ≥1 lower, ≥1 digit, ≥1 symbol

Page-level schemas compose from shared schemas and add field-specific rules (max lengths, etc.).

## Google OAuth Flow (Frontend Side)

1. User clicks `GoogleOAuthButton`
2. `@react-oauth/google` opens the Google popup
3. Google returns an authorization `code`
4. Frontend calls `auth.store.loginWithGoogle(code)`
5. Store calls `POST /auth/google` with `{ code }`
6. Backend exchanges `code` with Google (using `client_secret` — backend-only)
7. Backend returns `{ user, accessToken }` + sets `refresh_token` cookie
8. Store saves user + token, sets `isAuthenticated = true`
9. Router redirects to `/onboarding/shop` or `/dashboard`

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (e.g. `http://localhost:6000`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (public — never the secret) |

See `frontend/.env.example` for the full reference.

> **Security note**: `client_secret` is backend-only. Never put it in any frontend `.env` file.

## Naming Conventions

- **Code / TypeScript symbols**: English only — `ShopStore`, `createShop()`, `shop.types.ts`, `RegisterShopPage`
- **UI labels / user-facing strings**: Indonesian — "Pangkalan", "Masuk", "Daftar"
- **Files**: `kebab-case`; React components: `PascalCase`
- API functions named by HTTP action + resource: `loginWithEmail`, `createShop`

## Running the Frontend

```bash
# From frontend/
npm run dev   # http://localhost:5173
```

Requires `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID` set in `frontend/.env`.

## Adding a New Frontend Feature

1. Add types to `src/types/`
2. Add API function to `src/api/` (start with mock return if backend not ready yet)
3. Update/create Zustand store action
4. Add Zod schema to `src/lib/validations.ts` if needed
5. Create page component in `src/pages/`
6. Register route in `src/router/index.tsx`
7. Add story to `docs/stories/` and implementation plan to `docs/plans/`
