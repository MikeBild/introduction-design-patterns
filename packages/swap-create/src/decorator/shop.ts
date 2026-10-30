export type Measure = { name: string; ms: number }

export type GatewayError = Error & { code: 'declined' | 'unavailable' }
export const gatewayError = (code: GatewayError['code']): GatewayError =>
  Object.assign(new Error(`Payment gateway: ${code}`), { code })

export type Gateway = (orderId: string, amountCents: number) => Promise<string>
export type PriceApi = (productId: string) => Promise<number>

// Payment, retry and timing are tangled in one function.
export const createChargeOrder =
  (gateway: Gateway, record: (measure: Measure) => void, now = () => performance.now()) =>
  async (orderId: string, amountCents: number): Promise<string> => {
    const start = now()
    for (let attempt = 1; ; attempt += 1) {
      try {
        const receipt = await gateway(orderId, amountCents)
        record({ name: 'chargeOrder', ms: now() - start })
        return receipt
      } catch (error) {
        if (attempt === 3) throw error
      }
    }
  }

// Retry lives inside createChargeOrder, so this function has none.
export const createLoadPrice = (priceApi: PriceApi) => (productId: string) => priceApi(productId)
