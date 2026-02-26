# Stories — Feature 01: Register, Login & Register Shop (Frontend)

> **Format:** Each story card lists its ID, type, status, description, and acceptance criteria.
> Status values: `Done` · `In Progress` · `To Do` · `Blocked`

---

## FE-01 — Register Page (Email & Password)

| Field | Value |
|---|---|
| **ID** | FE-01 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As a** new owner,
**I want to** register with my email and password,
**so that** I can create an account.

**Acceptance Criteria:**
- [x] `/register` renders an email + password + confirm-password form
- [x] Password must meet: min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 symbol
- [x] `PasswordStrengthChecklist` shown live as user types — updates per rule in real time
- [x] Form shows inline validation errors on blur / submit
- [x] On success → `auth.store.register()` called → redirect to `/onboarding/shop`
- [x] Already-authenticated users redirected away from `/register`

---

## FE-02 — Login Page (Email & Password)

| Field | Value |
|---|---|
| **ID** | FE-02 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** existing owner,
**I want to** log in with email and password,
**so that** I can access my account.

**Acceptance Criteria:**
- [x] `/login` renders an email + password form
- [x] Invalid credentials show an error message (from API response)
- [x] On success with existing shop → redirect to `/dashboard`
- [x] On success without shop → redirect to `/onboarding/shop`
- [x] Already-authenticated users redirected away from `/login`

---

## FE-03 — Google OAuth Button

| Field | Value |
|---|---|
| **ID** | FE-03 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** owner,
**I want to** sign in or register via Google,
**so that** I don't need to create a separate password.

**Acceptance Criteria:**
- [x] `GoogleOAuthButton` component renders on both Login and Register pages
- [x] Clicking triggers the Google OAuth popup via `@react-oauth/google`
- [x] On Google success → `auth.store.loginWithGoogle(code)` called
- [x] New Google user (no shop) → redirect to `/onboarding/shop`
- [x] Returning Google user (has shop) → redirect to `/dashboard`
- [x] Google error shown as user-facing message

---

## FE-04 — Register Shop (Onboarding) Page

| Field | Value |
|---|---|
| **ID** | FE-04 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** authenticated owner without a shop,
**I want to** register my shop,
**so that** I can start using the POS features.

**Acceptance Criteria:**
- [x] `/onboarding/shop` renders a form with: shop name, address, registration number
- [x] Validation: name required max 100, address required max 500, reg number optional max 50
- [x] Character counter shown on constrained fields
- [x] Unauthenticated users redirected to `/login`
- [x] On success → `shop.store.createShop()` called → redirect to `/dashboard`

---

## FE-05 — Dashboard Page

| Field | Value |
|---|---|
| **ID** | FE-05 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** authenticated owner with a shop,
**I want to** see a dashboard,
**so that** I know I have successfully set up my account.

**Acceptance Criteria:**
- [x] `/dashboard` shows the text "Dashboard"
- [x] Shows current user's name
- [x] Shows current shop's name
- [x] Has a logout button that clears auth + shop state and redirects to `/login`
- [x] Unauthenticated users redirected to `/login`
- [x] Authenticated users without shop redirected to `/onboarding/shop`

---

## FE-06 — Route Guards (ProtectedRoute & GuestRoute)

| Field | Value |
|---|---|
| **ID** | FE-06 |
| **Type** | Task |
| **Status** | Done |
| **Feature** | 01-register-login |

**Acceptance Criteria:**
- [x] `GuestRoute` — redirects authenticated users (with shop) away from `/login` and `/register` to `/dashboard`
- [x] `ProtectedRoute(requireShop=false)` — redirects unauthenticated users to `/login`
- [x] `ProtectedRoute(requireShop=true)` — redirects unauthenticated users to `/login`; users without shop to `/onboarding/shop`
- [x] Persisted auth state (from `localStorage`) is correctly read on page refresh

---

## FE-07 — Axios Client with Auth Interceptor

| Field | Value |
|---|---|
| **ID** | FE-07 |
| **Type** | Task |
| **Status** | Done |
| **Feature** | 01-register-login |

**Acceptance Criteria:**
- [x] `src/api/client.ts` Axios instance uses `VITE_API_BASE_URL` as base URL
- [x] Request interceptor attaches `Authorization: Bearer <token>` on every request
- [x] `401` response clears auth state and redirects to `/login`
