export type LineItem = Readonly<{ quantity: number; priceCents: number }>
export type OrderSummary = Readonly<{ netCents: number; vatCents: number; grossCents: number }>

const vatCents = (netCents: number) => Math.round((netCents * 19) / 100)

export const orderSummary = (items: readonly LineItem[]): OrderSummary => {
  const netCents = items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
  const vat = vatCents(netCents)
  return { netCents, vatCents: vat, grossCents: netCents + vat }
}
