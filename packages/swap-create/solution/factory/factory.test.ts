import { expect, it, vi } from 'vitest'
import express from 'express'
import type { AddressInfo } from 'node:net'
import {
  createOrderNumbers,
  createOrderRoutes,
  createPlaceOrder,
  createPriceLookup,
  type PlacedOrder,
} from './shop.ts'

const oneHammer = { items: [{ productId: 'p-1', quantity: 1 }] }
const clockAt = (iso: string) => () => new Date(iso)

it('counts from its own start value, in every shop', () => {
  const workshop = createOrderNumbers({ prefix: 'WS', start: 1_000 })
  const outlet = createOrderNumbers({ prefix: 'OUT', start: 0 })
  expect([workshop(), workshop(), outlet()]).toEqual(['WS-1001', 'WS-1002', 'OUT-1'])
})

it('fetches a price once, then again after the time to live', () => {
  const loadPrice = vi.fn(() => 1_290)
  let now = new Date('2026-10-30T09:00:00.000Z')
  const lookupPrice = createPriceLookup({ loadPrice, ttlMs: 60_000, clock: () => now })

  lookupPrice('p-1')
  lookupPrice('p-1')
  expect(loadPrice).toHaveBeenCalledTimes(1)

  now = new Date('2026-10-30T09:01:00.000Z')
  lookupPrice('p-1')
  expect(loadPrice).toHaveBeenCalledTimes(2)
})

it('stamps an order with the injected clock', () => {
  const placeOrder = createPlaceOrder({
    nextNumber: () => 'WS-1',
    lookupPrice: () => 1_290,
    clock: clockAt('2026-10-30T09:00:00.000Z'),
  })
  expect(placeOrder(oneHammer)).toEqual({
    number: 'WS-1',
    totalCents: 1_290,
    createdAt: '2026-10-30T09:00:00.000Z',
  })
})

it('serves the route from an injected placeOrder', async () => {
  const order: PlacedOrder = {
    number: 'WS-1',
    totalCents: 1_290,
    createdAt: '2026-10-30T09:00:00.000Z',
  }
  const app = express()
  app.use(express.json())
  app.use('/orders', createOrderRoutes({ placeOrder: () => order }))
  const server = app.listen(0)
  const { port } = server.address() as AddressInfo

  const response = await fetch(`http://localhost:${port}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(oneHammer),
  })
  server.close()

  expect(response.status).toBe(201)
  expect(await response.json()).toEqual(order)
})
