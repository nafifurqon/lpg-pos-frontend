import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shop, CreateShopPayload } from '@/types/shop.types'
import { createShop as createShopApi } from '@/api/shop.api'

interface ShopState {
  shop: Shop | null
}

interface ShopActions {
  /** Register a new shop for the current authenticated owner. */
  createShop: (payload: CreateShopPayload) => Promise<void>
  /** Directly set shop state (used to rehydrate after login). */
  setShop: (shop: Shop | null) => void
  /** Clear shop data (e.g. on logout). */
  clearShop: () => void
}

type ShopStore = ShopState & ShopActions

export const useShopStore = create<ShopStore>()(
  persist(
    (set) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      shop: null,

      // ── Actions ────────────────────────────────────────────────────────────
      createShop: async (payload) => {
        const shop = await createShopApi(payload)
        set({ shop })
      },

      setShop: (shop) => {
        set({ shop })
      },

      clearShop: () => {
        set({ shop: null })
      },
    }),
    {
      name: 'shop-storage',
    }
  )
)
