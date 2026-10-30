// Three subsystems of the workshop shop, in memory. `calls` counts what a real service would bill.
export type OrderItem = { productId: string; quantity: number }

export type StockService = {
  reserve: (items: OrderItem[]) => Promise<boolean>
  release: (items: OrderItem[]) => Promise<void>
}
export type PriceService = { priceOf: (productId: string) => Promise<number> }
export type PaymentService = {
  charge: (customerId: string, amountCents: number) => Promise<boolean>
}

export type Services = { stock: StockService; prices: PriceService; payments: PaymentService }

const priceList: Record<string, number> = { 'p-1': 1299, 'p-2': 450 }

export const createServices = (initialStock: Record<string, number>, balanceCents: number) => {
  const available = { ...initialStock }
  const calls = { priceOf: 0, charge: 0 }

  const services: Services = {
    stock: {
      reserve: async (items) => {
        if (items.some(({ productId, quantity }) => (available[productId] ?? 0) < quantity))
          return false
        for (const { productId, quantity } of items) available[productId] -= quantity
        return true
      },
      release: async (items) => {
        for (const { productId, quantity } of items) available[productId] += quantity
      },
    },
    prices: {
      priceOf: async (productId) => {
        calls.priceOf += 1
        const price = priceList[productId]
        if (price === undefined) throw new Error(`Unknown product ${productId}`)
        return price
      },
    },
    payments: {
      charge: async (_customerId, amountCents) => {
        calls.charge += 1
        return amountCents <= balanceCents
      },
    },
  }

  return { services, available, calls }
}
