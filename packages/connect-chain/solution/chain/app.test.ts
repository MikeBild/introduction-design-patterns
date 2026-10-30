import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { createApp } from './app.ts'

let server: Server
let baseUrl: string

beforeAll(() => {
  server = createApp('secret').listen(0)
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
})
afterAll(() => server.close())

const post = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

const authorized = { 'x-api-key': 'secret' }
const validOrder = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 1 }] }

const listOrders = async () => {
  const response = await fetch(`${baseUrl}/orders`, { headers: authorized })
  return (await response.json()) as unknown[]
}

it('answers a wrong key with 401 and stores nothing', async () => {
  const before = await listOrders()
  const response = await post(validOrder, { 'x-api-key': 'wrong' })
  expect(response.status).toBe(401)
  expect(await listOrders()).toEqual(before)
})

it('answers an invalid order with 400 and JSON', async () => {
  const response = await post({ customerId: 'c-1' }, authorized)
  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({ error: 'customerId and items are required' })
})

it('places a valid order', async () => {
  const response = await post(validOrder, authorized)
  expect(response.status).toBe(201)
  expect(await response.json()).toMatchObject({ customerId: 'c-1' })
})

it('protects every route of the orders router', async () => {
  const response = await fetch(`${baseUrl}/orders`)
  expect(response.status).toBe(401)
})

it('turns an unknown error into a JSON 500', async () => {
  const response = await post({ ...validOrder, customerId: 'c-broken' }, authorized)
  expect(response.status).toBe(500)
  expect(await response.json()).toEqual({ error: 'Something went wrong.' })
})
