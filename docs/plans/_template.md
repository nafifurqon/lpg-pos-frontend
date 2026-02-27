# Implementation Plan — [Feature Name]

> Copy this template and fill in each section before starting work.
> File naming: `<YYYY-MM-DD HH.MM.SS>-<TYPE>-<Title>-<TICKET-ID>.md`
> Example: `2026-02-27 10.00.00-TASK-Standardize Response Format-LPG-1.md`
> Ticket ID: `LPG-<incremental number>` — must match the corresponding story/task file

---

## Overview

| Field | Value |
|---|---|
| **Plan ID** | FE-PLAN-NN |
| **Feature** | [Feature name and number] |
| **Related Stories** | [e.g. FE-07, FE-08] |
| **Author** | — |
| **Date** | YYYY-MM-DD |
| **Status** | Draft · In Review · Approved · Done |

## Goal

> One paragraph describing what this plan accomplishes and why.

## Scope

### In Scope
- ...

### Out of Scope
- ...

## Affected Files

| File | Change Type | Notes |
|---|---|---|
| `src/types/example.types.ts` | Create / Modify | |
| `src/api/example.api.ts` | Create / Modify | |
| `src/store/example.store.ts` | Create / Modify | |
| `src/lib/validations.ts` | Modify | Add Zod schema |
| `src/pages/.../ExamplePage.tsx` | Create / Modify | |
| `src/router/index.tsx` | Modify | Register new route |

## Implementation Steps

1. **Types** — Define TypeScript interfaces/types in `src/types/`
2. **API function** — Add function in `src/api/` (use mock return initially if backend not ready)
3. **Zod schema** — Add validation schema to `src/lib/validations.ts`
4. **Store** — Add state and action to relevant Zustand store
5. **Page/Component** — Implement the UI with React Hook Form + Zod resolver
6. **Route** — Register the route in `src/router/index.tsx`; add guard if needed
7. **Wire to backend** — Replace mock return with real API call once backend endpoint is live
8. **Test** — Verify happy path, error states, and route guard behavior

## UI Notes

> Describe any UX details, loading states, error messages, redirect behavior, etc.

| Scenario | Expected Behavior |
|---|---|
| Success | |
| API error | |
| Validation error | |
| Unauthenticated access | Redirect to `/login` |

## New Routes

| Path | Component | Guard | Notes |
|---|---|---|---|
| `/new-path` | `NewPage` | `ProtectedRoute` | |

## Environment Variable Changes

> List any new `.env` keys required.

| Variable | Description | Default |
|---|---|---|
| `VITE_NEW_VAR` | What it does | — |

## Rollback Plan

- Revert route additions in `router/index.tsx`
- Remove new files; restore modified files to previous state

## Verification Checklist

- [ ] All new routes render without console errors
- [ ] Form validation triggers correctly on blur and submit
- [ ] Auth/onboarding guards redirect correctly
- [ ] Store state is correct after each action
- [ ] `localStorage` persistence works after page refresh
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Related stories marked `Done` in `docs/stories/`
