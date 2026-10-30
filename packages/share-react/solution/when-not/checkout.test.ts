import { describe, expect, it } from 'vitest'
import { orderSummary } from './checkout.ts'

const hammer = { quantity: 1, priceCents: 1_290 }
const nails = { quantity: 3, priceCents: 450 }

describe('characterization: these tests stay green', () => {
  it('sums up the net amount and adds 19 percent VAT', () => {
    expect(orderSummary([hammer, nails])).toEqual({
      netCents: 2_640,
      vatCents: 502,
      grossCents: 3_142,
    })
  })

  it('rounds the VAT to whole cents', () => {
    expect(orderSummary([{ quantity: 1, priceCents: 999 }]).vatCents).toBe(190)
  })

  it('returns zeros for an empty order', () => {
    expect(orderSummary([])).toEqual({ netCents: 0, vatCents: 0, grossCents: 0 })
  })
})
