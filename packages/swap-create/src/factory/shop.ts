import express from 'express'

export type OrderInput = Readonly<{ items: readonly { productId: string; quantity: number }[] }>
export type PlacedOrder = Readonly<{ number: string; totalCents: number; createdAt: string }>

const catalog = new Map([
  ['p-1', 1_290],
  ['p-2', 450],
])
const priceCache = new Map<string, number>()
let lastNumber = 1_000

export const updateCatalogPrice = (productId: string, priceCents: number) =>
  catalog.set(productId, priceCents)

const lookupPrice = (productId: string): number => {
  const cached = priceCache.get(productId)
  if (cached !== undefined) return cached
  const price = catalog.get(productId)
  if (price === undefined) throw new Error(`Unknown product: ${productId}`)
  priceCache.set(productId, price)
  return price
}

export const placeOrder = (input: OrderInput): PlacedOrder => ({
  number: `WS-${++lastNumber}`,
  totalCents: input.items.reduce(
    (sum, item) => sum + item.quantity * lookupPrice(item.productId),
    0,
  ),
  createdAt: new Date().toISOString(),
})

export const app = express()
app.use(express.json())
app.post('/orders', (req, res) => {
  res.status(201).json(placeOrder(req.body))
})
