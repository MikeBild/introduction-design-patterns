import type { Situation } from './situations.ts'

export type Pattern =
  'adapter' | 'facade' | 'proxy' | 'chain' | 'decorator' | 'strategy' | 'singleton' | 'no pattern'

export type Diagnosis = Record<Situation, { problem: string; pattern: Pattern }>

// A hurried review: the pattern came first, the problem was never written down.
export const diagnosis: Diagnosis = {
  'stock-api': { problem: '', pattern: 'singleton' },
  checkout: { problem: '', pattern: 'singleton' },
  'price-lookup': { problem: '', pattern: 'singleton' },
  'order-route': { problem: '', pattern: 'singleton' },
  'payment-retry': { problem: '', pattern: 'singleton' },
  shipping: { problem: '', pattern: 'singleton' },
  'order-total': { problem: '', pattern: 'singleton' },
}
