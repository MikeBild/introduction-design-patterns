import type { PriceService } from '../../src/facade-proxy/services.ts'

// Proxy: the same contract as PriceService, with a cache in front of it.
export const createCachedPrices = (prices: PriceService): PriceService => {
  const known = new Map<string, number>()

  return {
    priceOf: async (productId) => {
      const cached = known.get(productId)
      if (cached !== undefined) return cached

      const price = await prices.priceOf(productId)
      known.set(productId, price)
      return price
    },
  }
}
