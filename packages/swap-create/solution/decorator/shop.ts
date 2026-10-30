import {
  gatewayError,
  type Gateway,
  type GatewayError,
  type Measure,
  type PriceApi,
} from '../../src/decorator/shop.ts'
import { withCache, withRetry, withTiming } from './decorators.ts'

export { gatewayError }

const isTransient = (error: unknown) => (error as GatewayError).code === 'unavailable'
const retry = { attempts: 3, retryOn: isTransient }

// The charge function does nothing but charge. Everything else is wrapped around it.
export const createChargeOrder = (
  gateway: Gateway,
  record: (measure: Measure) => void,
  now?: () => number,
) => withTiming(withRetry(gateway, retry), 'chargeOrder', record, now)

export const createLoadPrice = (priceApi: PriceApi) => withCache(withRetry(priceApi, retry))
