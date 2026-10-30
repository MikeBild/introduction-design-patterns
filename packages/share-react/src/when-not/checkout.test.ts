import { describe, expect, it } from 'vitest'
import { orderSummary, serviceLocator } from './checkout.ts'

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

describe('bugs, delete them together with the patterns', () => {
  it('fails with a poor message when a name in the locator is misspelled', () => {
    expect(() => serviceLocator.get<() => void>('taxStrategyFactroy')()).toThrow(TypeError)
  })

  it('lets one test change the tax of the whole process', () => {
    const original = serviceLocator.get('taxStrategyFactory')
    serviceLocator.register('taxStrategyFactory', { create: () => () => 0 })
    expect(orderSummary([hammer]).vatCents).toBe(0)
    serviceLocator.register('taxStrategyFactory', original)
  })
})
