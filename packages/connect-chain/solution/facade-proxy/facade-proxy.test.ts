import { expect, it } from 'vitest'
import { createServices } from '../../src/facade-proxy/services.ts'
import { createCachedPrices } from './cached-prices.ts'
import { checkoutWeb, reorder } from './callers.ts'
import { createPlaceOrder } from './place-order.ts'

const hammer = { productId: 'p-1', quantity: 1 }
const input = { customerId: 'c-1', items: [hammer] }

it('places an order and sums up the prices', async () => {
  const { services, available } = createServices({ 'p-1': 5, 'p-2': 5 }, 10_000)
  const result = await createPlaceOrder(services)({
    customerId: 'c-1',
    items: [hammer, { productId: 'p-2', quantity: 2 }],
  })
  expect(result).toEqual({ kind: 'placed', totalCents: 2199 })
  expect(available['p-1']).toBe(4)
})

it('releases the stock when the payment is declined', async () => {
  const { services, available } = createServices({ 'p-1': 5 }, 0)
  const result = await checkoutWeb(services, input)
  expect(result).toEqual({ kind: 'rejected', reason: 'payment-declined' })
  expect(available['p-1']).toBe(5)
})

it('rejects an order that is out of stock, for every caller', async () => {
  for (const caller of [checkoutWeb, reorder]) {
    const { services, calls } = createServices({ 'p-1': 0 }, 10_000)
    expect(await caller(services, input)).toEqual({ kind: 'rejected', reason: 'out-of-stock' })
    expect(calls.charge).toBe(0)
  }
})

it('answers a known price from the cache with the same signature', async () => {
  const { services, calls } = createServices({ 'p-1': 5 }, 10_000)
  const cached = { ...services, prices: createCachedPrices(services.prices) }
  await checkoutWeb(cached, input)
  await checkoutWeb(cached, input)
  expect(calls.priceOf).toBe(1)
})

it('does not cache a failed price lookup', async () => {
  let attempts = 0
  const prices = createCachedPrices({
    priceOf: async () => {
      attempts += 1
      if (attempts === 1) throw new Error('Price service unavailable')
      return 1299
    },
  })
  await expect(prices.priceOf('p-1')).rejects.toThrow('unavailable')
  await expect(prices.priceOf('p-1')).resolves.toBe(1299)
})
