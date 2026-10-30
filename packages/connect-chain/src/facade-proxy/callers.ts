import type { OrderItem, Services } from './services.ts'

export type OrderInput = { customerId: string; items: OrderItem[] }
export type OrderResult =
  | { kind: 'placed'; totalCents: number }
  | { kind: 'rejected'; reason: 'out-of-stock' | 'payment-declined' }

// The web checkout coordinates three services by itself.
export const checkoutWeb = async (services: Services, input: OrderInput): Promise<OrderResult> => {
  const reserved = await services.stock.reserve(input.items)
  if (!reserved) return { kind: 'rejected', reason: 'out-of-stock' }

  let totalCents = 0
  for (const item of input.items) {
    totalCents += (await services.prices.priceOf(item.productId)) * item.quantity
  }

  const paid = await services.payments.charge(input.customerId, totalCents)
  if (!paid) return { kind: 'rejected', reason: 'payment-declined' }
  return { kind: 'placed', totalCents }
}

// The reorder button was copied later, and it lost a step on the way.
export const reorder = async (services: Services, input: OrderInput): Promise<OrderResult> => {
  let totalCents = 0
  for (const item of input.items) {
    totalCents += (await services.prices.priceOf(item.productId)) * item.quantity
  }

  const paid = await services.payments.charge(input.customerId, totalCents)
  if (!paid) return { kind: 'rejected', reason: 'payment-declined' }
  return { kind: 'placed', totalCents }
}
