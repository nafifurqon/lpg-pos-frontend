import apiClient from '@/api/client'
import type { ApiResponse } from '@/types/auth.types'
import type { Shop, CreateShopPayload } from '@/types/shop.types'

/**
 * Register a new shop for the authenticated owner.
 * Requires a valid Bearer token (set automatically by the Axios request interceptor).
 * Backend endpoint: POST /shops
 */
export async function createShop(payload: CreateShopPayload): Promise<Shop> {
  const { data } = await apiClient.post<ApiResponse<Shop>>('/shops', payload)
  return data.result
}

/**
 * Fetch the authenticated owner's shop. Returns null if none registered yet.
 * Called after every login to rehydrate the shop store.
 * Backend endpoint: GET /shops/mine
 */
export async function getMyShop(): Promise<Shop | null> {
  const { data } = await apiClient.get<ApiResponse<Shop | null>>('/shops/mine')
  return data.result
}
