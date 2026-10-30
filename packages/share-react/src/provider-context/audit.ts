import { setTimeout as delay } from 'node:timers/promises'

let currentRequestId = 'none'

const audit = (message: string) => `[${currentRequestId}] ${message}`

const reserveStock = async (orderId: string) => {
  await delay(1)
  return audit(`stock reserved for ${orderId}`)
}

export const handleOrder = async (requestId: string, orderId: string) => {
  currentRequestId = requestId
  return reserveStock(orderId)
}
