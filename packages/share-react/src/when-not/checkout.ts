export type LineItem = Readonly<{ quantity: number; priceCents: number }>
export type OrderSummary = Readonly<{ netCents: number; vatCents: number; grossCents: number }>

// Singleton: one shared registry for the whole process
const services = new Map<string, unknown>()

// Service locator: anything can fetch anything by name
export const serviceLocator = {
  register: (name: string, service: unknown) => services.set(name, service),
  get: <T>(name: string) => services.get(name) as T,
}

// Strategy: there is one tax rule, and there has only ever been one
export type TaxStrategy = (netCents: number) => number
const germanVat: TaxStrategy = (netCents) => Math.round((netCents * 19) / 100)

// Factory for the only strategy
const createTaxStrategyFactory = () => ({ create: (): TaxStrategy => germanVat })
serviceLocator.register('taxStrategyFactory', createTaxStrategyFactory())

// Builder for an object with three fields
const createOrderSummaryBuilder = () => {
  let netCents = 0
  let vatCents = 0
  const builder = {
    withNet: (cents: number) => {
      netCents = cents
      return builder
    },
    withVat: (cents: number) => {
      vatCents = cents
      return builder
    },
    build: (): OrderSummary => ({ netCents, vatCents, grossCents: netCents + vatCents }),
  }
  return builder
}

export const orderSummary = (items: readonly LineItem[]): OrderSummary => {
  const netCents = items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
  const factory = serviceLocator.get<{ create: () => TaxStrategy }>('taxStrategyFactory')
  const tax = factory.create()
  return createOrderSummaryBuilder().withNet(netCents).withVat(tax(netCents)).build()
}
