import type { OrderInput } from '../../src/facade-proxy/callers.ts'
import type { Services } from '../../src/facade-proxy/services.ts'
import { createPlaceOrder } from './place-order.ts'

export const checkoutWeb = (services: Services, input: OrderInput) =>
  createPlaceOrder(services)(input)

export const reorder = (services: Services, input: OrderInput) => createPlaceOrder(services)(input)
