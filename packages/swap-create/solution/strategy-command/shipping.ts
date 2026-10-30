export type OrderItem = Readonly<{ productId: string; quantity: number; priceCents: number }>
export type Order = Readonly<{ items: readonly OrderItem[] }>

export type ShippingStrategy = (subtotalCents: number) => number

export const standardShipping: ShippingStrategy = (subtotal) => (subtotal >= 5_000 ? 0 : 490)
export const expressShipping: ShippingStrategy = () => 990
export const pickupShipping: ShippingStrategy = () => 0
export const overnightShipping: ShippingStrategy = () => 1_990

export const subtotalCents = (order: Order): number =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

export const orderTotalCents = (order: Order, shipping: ShippingStrategy): number => {
  const subtotal = subtotalCents(order)
  return subtotal + shipping(subtotal)
}

export const shippingMethods = {
  standard: standardShipping,
  express: expressShipping,
  pickup: pickupShipping,
  overnight: overnightShipping,
} satisfies Record<string, ShippingStrategy>

export type ShippingMethod = keyof typeof shippingMethods

const isShippingMethod = (name: string): name is ShippingMethod =>
  Object.hasOwn(shippingMethods, name)

export const pickShipping = (name: string): ShippingStrategy => {
  if (!isShippingMethod(name)) throw new Error(`Unknown shipping method: ${name}`)
  return shippingMethods[name]
}
