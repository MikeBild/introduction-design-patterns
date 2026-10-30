import { Router } from 'express'

export type OrderInput = Readonly<{ items: readonly { productId: string; quantity: number }[] }>
export type PlacedOrder = Readonly<{ number: string; totalCents: number; createdAt: string }>
export type Clock = () => Date

export const createOrderNumbers = ({ prefix, start }: { prefix: string; start: number }) => {
  let last = start
  return () => `${prefix}-${++last}`
}

export const createPriceLookup = ({
  loadPrice,
  ttlMs,
  clock,
}: {
  loadPrice: (productId: string) => number
  ttlMs: number
  clock: Clock
}) => {
  const cache = new Map<string, { priceCents: number; expiresAt: number }>()
  return (productId: string): number => {
    const now = clock().getTime()
    const cached = cache.get(productId)
    if (cached && cached.expiresAt > now) return cached.priceCents
    const priceCents = loadPrice(productId)
    cache.set(productId, { priceCents, expiresAt: now + ttlMs })
    return priceCents
  }
}

export const createPlaceOrder =
  ({
    nextNumber,
    lookupPrice,
    clock,
  }: {
    nextNumber: () => string
    lookupPrice: (productId: string) => number
    clock: Clock
  }) =>
  (input: OrderInput): PlacedOrder => ({
    number: nextNumber(),
    totalCents: input.items.reduce(
      (sum, item) => sum + item.quantity * lookupPrice(item.productId),
      0,
    ),
    createdAt: clock().toISOString(),
  })

export const createOrderRoutes = ({
  placeOrder,
}: {
  placeOrder: (input: OrderInput) => PlacedOrder
}) => {
  const router = Router()
  router.post('/', (req, res) => {
    res.status(201).json(placeOrder(req.body))
  })
  return router
}
