import { afterAll, beforeAll, expect, it } from 'vitest'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { app, placeOrder, updateCatalogPrice } from './shop.ts'

const oneHammer = { items: [{ productId: 'p-1', quantity: 1 }] }

let server: Server
beforeAll(() => {
  server = app.listen(0)
})
afterAll(() => server.close())

it('numbers an order by how many orders ran before it, in any test', () => {
  placeOrder(oneHammer)
  expect(placeOrder(oneHammer).number).not.toBe('WS-1001')
})

it('sells at the old price, because the cache lives as long as the module', () => {
  expect(placeOrder(oneHammer).totalCents).toBe(1_290)
  updateCatalogPrice('p-1', 1_490)
  expect(placeOrder(oneHammer).totalCents).toBe(1_290)
})

it('reads the real clock, so a test cannot fix the date', () => {
  expect(placeOrder(oneHammer).createdAt).not.toBe('2026-10-30T09:00:00.000Z')
})

it('shares the counter between the route and every other caller', async () => {
  const { number } = placeOrder(oneHammer)
  const { port } = server.address() as AddressInfo
  const response = await fetch(`http://localhost:${port}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(oneHammer),
  })
  const created = (await response.json()) as { number: string }
  expect(Number(created.number.slice(3))).toBe(Number(number.slice(3)) + 1)
})

// Your turn, see the exercise in README.md.
it.todo('counts from its own start value, in every shop')
it.todo('fetches a price once, then again after the time to live')
it.todo('stamps an order with the injected clock')
it.todo('serves the route from an injected placeOrder')
