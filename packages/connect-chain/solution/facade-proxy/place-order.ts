import type { OrderInput, OrderResult } from '../../src/facade-proxy/callers.ts'
import type { Services } from '../../src/facade-proxy/services.ts'

// Facade: one function hides the order of three services from every caller.
export const createPlaceOrder =
  ({ stock, prices, payments }: Services) =>
  async (input: OrderInput): Promise<OrderResult> => {
    if (!(await stock.reserve(input.items))) return { kind: 'rejected', reason: 'out-of-stock' }

    let totalCents = 0
    for (const { productId, quantity } of input.items) {
      totalCents += (await prices.priceOf(productId)) * quantity
    }

    if (await payments.charge(input.customerId, totalCents)) return { kind: 'placed', totalCents }

    await stock.release(input.items)
    return { kind: 'rejected', reason: 'payment-declined' }
  }
