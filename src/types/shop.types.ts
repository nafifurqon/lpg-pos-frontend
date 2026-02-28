export interface Shop {
  id: string
  name: string
  address: string
  registrationNumber: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateShopPayload {
  /** Display name of the LPG shop ("Pangkalan"). Max 100 chars. */
  name: string
  /** Full address of the shop. Max 500 chars. */
  address: string
  /** Optional government registration number. Max 50 chars. */
  registrationNumber?: string
}
