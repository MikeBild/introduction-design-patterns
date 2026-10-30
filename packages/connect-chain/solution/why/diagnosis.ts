import type { Diagnosis } from '../../src/why/diagnosis.ts'

export const diagnosis: Diagnosis = {
  'stock-api': {
    problem: 'A foreign interface does not match the shape the shop works with.',
    pattern: 'adapter',
  },
  checkout: {
    problem: 'Callers know the order of three services and repeat it.',
    pattern: 'facade',
  },
  'price-lookup': {
    problem: 'Callers need the same contract, but access to it is too expensive.',
    pattern: 'proxy',
  },
  'order-route': {
    problem: 'Several independent steps run in order, and each one may end the request.',
    pattern: 'chain',
  },
  'payment-retry': {
    problem: 'A function needs additional behavior without being changed.',
    pattern: 'decorator',
  },
  shipping: {
    problem: 'One calculation has many variants, and new ones keep arriving.',
    pattern: 'strategy',
  },
  'order-total': {
    problem: 'Nothing is wrong: one function with one caller solves it.',
    pattern: 'no pattern',
  },
}
