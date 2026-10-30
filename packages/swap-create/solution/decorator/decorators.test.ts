import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import express, { type ErrorRequestHandler, type Request, type Response } from 'express'
import { afterEach, expect, it, vi } from 'vitest'
import { withCache, withRetry, withTiming } from './decorators.ts'
import { createChargeOrder, createLoadPrice, gatewayError } from './shop.ts'

const retryAll = { attempts: 3, retryOn: () => true }

it('withRetry: repeats a transient error and gives up after the last attempt', async () => {
  const flaky = vi
    .fn<(id: string) => Promise<string>>()
    .mockRejectedValueOnce(gatewayError('unavailable'))
    .mockResolvedValue('receipt')
  await expect(withRetry(flaky, retryAll)('o-1')).resolves.toBe('receipt')
  expect(flaky).toHaveBeenCalledTimes(2)

  const broken = vi.fn<() => Promise<string>>().mockRejectedValue(gatewayError('unavailable'))
  await expect(withRetry(broken, retryAll)()).rejects.toThrow('unavailable')
  expect(broken).toHaveBeenCalledTimes(3)
})

it('withRetry: does not repeat a declined card', async () => {
  const gateway = vi.fn().mockRejectedValue(gatewayError('declined'))
  await expect(createChargeOrder(gateway, () => {})('o-1', 1299)).rejects.toThrow('declined')
  expect(gateway).toHaveBeenCalledTimes(1)
})

it('withTiming: measures failed calls too', async () => {
  const record = vi.fn()
  const times = [10, 35]
  const timed = withTiming(
    async () => {
      throw new Error('Gateway down')
    },
    'charge',
    record,
    () => times.shift() ?? 0,
  )
  await expect(timed()).rejects.toThrow('down')
  expect(record).toHaveBeenCalledWith({ name: 'charge', ms: 25 })
})

it('withCache: answers a known key without calling the function', async () => {
  const priceApi = vi.fn().mockResolvedValue(1299)
  const loadPrice = createLoadPrice(priceApi)
  await loadPrice('p-1')
  await expect(loadPrice('p-1')).resolves.toBe(1299)
  expect(priceApi).toHaveBeenCalledTimes(1)
})

it('withCache: does not store a failed call', async () => {
  const priceApi = vi.fn().mockRejectedValueOnce(new Error('down')).mockResolvedValue(1299)
  const loadPrice = withCache(priceApi)
  await expect(loadPrice('p-1')).rejects.toThrow('down')
  await expect(loadPrice('p-1')).resolves.toBe(1299)
})

it('layers: withTiming outside measures all attempts, inside each attempt', async () => {
  const flaky = () =>
    vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(gatewayError('unavailable'))
      .mockResolvedValue('receipt')

  const outside = vi.fn()
  await withTiming(withRetry(flaky(), retryAll), 'charge', outside)()
  expect(outside).toHaveBeenCalledTimes(1)

  const inside = vi.fn()
  await withRetry(withTiming(flaky(), 'charge', inside), retryAll)()
  expect(inside).toHaveBeenCalledTimes(2)
})

let server: Server | undefined
afterEach(() => server?.close())

const start = (app: express.Express) => {
  server = app.listen(0)
  return `http://localhost:${(server.address() as AddressInfo).port}`
}

const failing = async (_req: Request, _res: Response) => {
  throw new Error('Database unavailable')
}
const errorHandler: ErrorRequestHandler = (_error, _req, res, _next) => {
  res.status(500).json({ error: 'Something went wrong.' })
}

it('express: withTiming wraps a handler, and errors reach the error handler', async () => {
  const record = vi.fn()
  const app = express()
  app.get('/orders', withTiming(failing, 'getOrders', record))
  app.use(errorHandler)

  const response = await fetch(`${start(app)}/orders`)
  expect(response.status).toBe(500)
  expect(await response.json()).toEqual({ error: 'Something went wrong.' })
  expect(record).toHaveBeenCalledOnce()
})

it('express: a wrapped error handler is ignored, because fn.length is 0', async () => {
  const wrapped = withTiming(
    async (...args: Parameters<ErrorRequestHandler>) => {
      errorHandler(...args)
    },
    'errorHandler',
    () => {},
  )
  expect(wrapped.length).toBe(0)

  const app = express()
  app.get(
    '/orders',
    withTiming(failing, 'getOrders', () => {}),
  )
  app.use(wrapped as unknown as ErrorRequestHandler)

  const response = await fetch(`${start(app)}/orders`)
  expect(response.headers.get('content-type')).toContain('text/html')
})
