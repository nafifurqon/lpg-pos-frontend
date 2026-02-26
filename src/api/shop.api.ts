import type { Shop, CreateShopPayload } from '@/types/shop.types'

// ─── Mock data ────────────────────────────────────────────────────────────────
// Remove this section and uncomment the real API calls below once the
// NestJS backend is ready.

const MOCK_DELAY = 800

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Register a new shop for the authenticated owner.
 * Requires a valid Bearer token (set automatically by Axios interceptor).
 * Backend endpoint: POST /shops
 */
export async function createShop(payload: CreateShopPayload): Promise<Shop> {
  // TODO: uncomment when backend is ready
  // const response = await apiClient.post<Shop>('/shops', payload)
  // return response.data

  await new Promise((r) => setTimeout(r, MOCK_DELAY))
  const mockShop: Shop = {
    id: 'mock-shop-id-001',
    name: payload.name,
    address: payload.address,
    registrationNumber: payload.registrationNumber ?? null,
    ownerId: 'mock-user-id-001',
    createdAt: new Date().toISOString(),
  }
  return mockShop
}
