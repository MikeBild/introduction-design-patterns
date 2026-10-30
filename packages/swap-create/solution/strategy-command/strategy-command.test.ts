import { describe, expect, it } from 'vitest'
import { addItem, changeQuantity, createCart, removeItem } from './cart.ts'
import { expressShipping, orderTotalCents, pickShipping, standardShipping } from './shipping.ts'

const hammer = { productId: 'p-1', quantity: 1, priceCents: 1_290 }
const nails = { productId: 'p-2', quantity: 2, priceCents: 450 }

describe('shipping', () => {
  it('passes the shipping rule as an argument', () => {
    const order = { items: [hammer] }
    expect(orderTotalCents(order, standardShipping)).toBe(1_780)
    expect(orderTotalCents(order, expressShipping)).toBe(2_280)
    expect(orderTotalCents(order, () => 0)).toBe(1_290)
  })

  it('ships for free from 50 euros on', () => {
    expect(standardShipping(4_999)).toBe(490)
    expect(standardShipping(5_000)).toBe(0)
  })

  it('adds overnight as one new line in the table', () => {
    expect(pickShipping('overnight')(1_290)).toBe(1_990)
  })

  it('rejects an unknown method, even one named constructor', () => {
    expect(() => pickShipping('expres')).toThrow('Unknown shipping method: expres')
    expect(() => pickShipping('constructor')).toThrow('Unknown shipping method: constructor')
  })
})

describe('cart', () => {
  it('undoes an add without touching an earlier line of the same product', () => {
    const cart = createCart()
    const line = { productId: 'p-1', quantity: 1, priceCents: 1290 }
    cart.run(addItem(line))
    cart.run(addItem({ ...line, quantity: 2 }))
    cart.undo()
    expect(cart.items()).toEqual([line])
  })

  it('undoes any change, step by step', () => {
    const cart = createCart()
    cart.run(addItem(hammer))
    cart.run(addItem(nails))
    cart.run(changeQuantity('p-1', 5))
    cart.run(removeItem('p-1'))
    expect(cart.items()).toEqual([nails])

    cart.undo()
    expect(cart.items()).toEqual([{ ...hammer, quantity: 5 }, nails])
    cart.undo()
    expect(cart.items()).toEqual([hammer, nails])
    cart.undo()
    cart.undo()
    cart.undo()
    expect(cart.items()).toEqual([])
  })

  it('queues changes and runs them later, in order', () => {
    const cart = createCart()
    cart.enqueue(addItem(hammer))
    cart.enqueue(changeQuantity('p-1', 3))
    expect(cart.items()).toEqual([])

    cart.flush()
    cart.flush()
    expect(cart.items()).toEqual([{ ...hammer, quantity: 3 }])
  })

  it('lists the changes that ran', () => {
    const cart = createCart()
    cart.run(addItem(hammer))
    cart.run(removeItem('p-1'))
    cart.undo()
    expect(cart.log()).toEqual(['add p-1'])
  })
})
