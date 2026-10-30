import { describe, expect, it } from 'vitest'
import { createCart } from './cart.ts'
import { orderTotalCents } from './shipping.ts'

const hammer = { productId: 'p-1', quantity: 1, priceCents: 1_290 }
const nails = { productId: 'p-2', quantity: 2, priceCents: 450 }

describe('shipping', () => {
  it('ships a typo for free, because the switch ends in a default', () => {
    expect(orderTotalCents({ items: [hammer] }, 'expres')).toBe(1_290)
  })

  it('needs a new case in the switch for a single customer rate', () => {
    expect(orderTotalCents({ items: [hammer] }, 'trade-account')).toBe(1_290)
  })

  // Your turn, see the exercise in README.md.
  it.todo('passes the shipping rule as an argument')
  it.todo('adds overnight as one new line in the table')
  it.todo('rejects an unknown method, even one named constructor')
})

describe('cart', () => {
  it('ignores undo after a quantity change', () => {
    const cart = createCart()
    cart.add(hammer)
    cart.changeQuantity('p-1', 5)
    cart.undo()
    expect(cart.items()[0].quantity).toBe(5)
  })

  it('puts a restored item at the end, not where it was', () => {
    const cart = createCart()
    cart.add(hammer)
    cart.add(nails)
    cart.remove('p-1')
    cart.undo()
    expect(cart.items().map((item) => item.productId)).toEqual(['p-2', 'p-1'])
  })

  it('remembers only one removed item', () => {
    const cart = createCart()
    cart.add(hammer)
    cart.add(nails)
    cart.remove('p-1')
    cart.remove('p-2')
    cart.undo()
    cart.undo()
    expect(cart.items()).toEqual([nails])
  })

  // Your turn, see the exercise in README.md.
  it.todo('undoes any change, step by step')
  it.todo('queues changes and runs them later, in order')
  it.todo('lists the changes that ran')
})
