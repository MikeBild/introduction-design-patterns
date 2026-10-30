import type { OrderItem } from './shipping.ts'

export const createCart = () => {
  let items: readonly OrderItem[] = []
  let lastRemoved: OrderItem | undefined

  return {
    items: () => items,
    add: (item: OrderItem) => {
      items = [...items, item]
    },
    remove: (productId: string) => {
      lastRemoved = items.find((item) => item.productId === productId)
      items = items.filter((item) => item.productId !== productId)
    },
    changeQuantity: (productId: string, quantity: number) => {
      items = items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    },
    undo: () => {
      if (!lastRemoved) return
      items = [...items, lastRemoved]
      lastRemoved = undefined
    },
  }
}
