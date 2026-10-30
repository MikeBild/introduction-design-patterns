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

const validOrder = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 1 }] }

it('stores the order although the key was wrong, and answers 401 with the order', async () => {
  const response = await post(validOrder, { 'x-api-key': 'wrong' })
  expect(response.status).toBe(401)
  expect(await response.json()).toMatchObject({ customerId: 'c-1' })
})

it('answers an invalid order with 500 and an HTML page', async () => {
  const response = await post({ customerId: 'c-1' }, { 'x-api-key': 'secret' })
  expect(response.status).toBe(500)
  expect(response.headers.get('content-type')).toContain('text/html')
})

it('lists all orders without any key', async () => {
  const response = await fetch(`${baseUrl}/orders`)
  expect(response.status).toBe(200)
})

// Your turn, see the exercise in README.md.
it.todo('chain: runs the handlers in order and returns the reply of the last one')
it.todo('chain: stops as soon as a handler does not call next')
it.todo('express: answers a wrong key with 401 and stores nothing')
it.todo('express: answers an invalid order with 400 and JSON')
it.todo('express: protects every route of the orders router')
it.todo('express: turns an unknown error into a JSON 500')
