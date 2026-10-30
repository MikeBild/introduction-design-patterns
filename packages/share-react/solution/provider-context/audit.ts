import { AsyncLocalStorage } from 'node:async_hooks'
import { setTimeout as delay } from 'node:timers/promises'

const storage = new AsyncLocalStorage<{ requestId: string }>()

export const audit = (message: string) => {
  const request = storage.getStore()
  if (!request) throw new Error('audit needs a running request')
  return `[${request.requestId}] ${message}`
}

const reserveStock = async (orderId: string) => {
  await delay(1)
  return audit(`stock reserved for ${orderId}`)
}

export const handleOrder = (requestId: string, orderId: string) =>
  storage.run({ requestId }, () => reserveStock(orderId))
