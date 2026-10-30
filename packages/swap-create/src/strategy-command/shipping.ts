export type OrderItem = Readonly<{ productId: string; quantity: number; priceCents: number }>
export type Order = Readonly<{ items: readonly OrderItem[] }>

export const subtotalCents = (order: Order): number =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

export const shippingCents = (order: Order, method: string): number => {
  const subtotal = subtotalCents(order)
  switch (method) {
    case 'standard':
      return subtotal >= 5_000 ? 0 : 490
    case 'express':
      return 990
    case 'pickup':
      return 0
    default:
      return 0
  }
}

export const orderTotalCents = (order: Order, method: string): number =>
  subtotalCents(order) + shippingCents(order, method)
