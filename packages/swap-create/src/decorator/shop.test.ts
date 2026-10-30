import { expect, it, vi } from 'vitest'
import { createChargeOrder, createLoadPrice, gatewayError } from './shop.ts'

it('tries a declined card three times', async () => {
  const gateway = vi.fn().mockRejectedValue(gatewayError('declined'))
  const chargeOrder = createChargeOrder(gateway, () => {})
  await expect(chargeOrder('o-1', 1299)).rejects.toThrow('declined')
  expect(gateway).toHaveBeenCalledTimes(3)
})

it('measures nothing when the call fails', async () => {
  const record = vi.fn()
  const chargeOrder = createChargeOrder(vi.fn().mockRejectedValue(gatewayError('declined')), record)
  await expect(chargeOrder('o-1', 1299)).rejects.toThrow()
  expect(record).not.toHaveBeenCalled()
})

it('fails on the first hiccup of the price API, because the retry is out of reach', async () => {
  const priceApi = vi
    .fn()
    .mockRejectedValueOnce(gatewayError('unavailable'))
    .mockResolvedValue(1299)
  await expect(createLoadPrice(priceApi)('p-1')).rejects.toThrow('unavailable')
})

it('calls the price API for a price it already knows', async () => {
  const priceApi = vi.fn().mockResolvedValue(1299)
  const loadPrice = createLoadPrice(priceApi)
  await loadPrice('p-1')
  await loadPrice('p-1')
  expect(priceApi).toHaveBeenCalledTimes(2)
})

// Your turn, see the exercise in README.md.
it.todo('withRetry: repeats a transient error and gives up after the last attempt')
it.todo('withRetry: does not repeat a declined card')
it.todo('withTiming: measures failed calls too')
it.todo('withCache: answers a known key without calling the function')
it.todo('layers: withTiming outside measures all attempts, inside each attempt')
it.todo('express: withTiming wraps a handler, and errors reach the error handler')
