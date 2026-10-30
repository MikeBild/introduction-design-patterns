import { expect, it } from 'vitest'
import { checkoutWeb, reorder } from './callers.ts'
import { createServices } from './services.ts'

const hammer = { productId: 'p-1', quantity: 1 }

it('keeps the stock reserved although the payment was declined', async () => {
  const { services, available } = createServices({ 'p-1': 5 }, 0)
  const result = await checkoutWeb(services, { customerId: 'c-1', items: [hammer] })
  expect(result).toEqual({ kind: 'rejected', reason: 'payment-declined' })
  expect(available['p-1']).toBe(4)
})

it('sells a product that is out of stock, because reorder lost a step', async () => {
  const { services, calls } = createServices({ 'p-1': 0 }, 10_000)
  const result = await reorder(services, { customerId: 'c-1', items: [hammer] })
  expect(result).toEqual({ kind: 'placed', totalCents: 1299 })
  expect(calls.charge).toBe(1)
})

it('asks the price service again for a price it already knows', async () => {
  const { services, calls } = createServices({ 'p-1': 5 }, 10_000)
  const input = { customerId: 'c-1', items: [hammer] }
  await checkoutWeb(services, input)
  await checkoutWeb(services, input)
  expect(calls.priceOf).toBe(2)
})

// Your turn, see the exercise in README.md.
it.todo('releases the stock when the payment is declined')
it.todo('rejects an order that is out of stock, for every caller')
it.todo('answers a known price from the cache with the same signature')
it.todo('does not cache a failed price lookup')
