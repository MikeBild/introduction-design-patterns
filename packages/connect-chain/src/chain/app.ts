import express from 'express'

export type Order = { id: string; customerId: string; items: unknown[] }

export const createApp = (apiKey: string) => {
  const orders: Order[] = []
  const app = express()
  app.use(express.json())

  app.post('/orders', (req, res) => {
    // Every step lives in the handler. None of them can stop the steps after it.
    if (req.get('x-api-key') !== apiKey) res.status(401)

    const { customerId, items } = req.body as Partial<Order>
    if (!customerId || !items?.length) throw new Error('customerId and items are required')

    const order = { id: `o-${orders.length + 1}`, customerId, items }
    orders.push(order)
    res.json(order)
  })

  // The route was added later, and nobody copied the key check.
  app.get('/orders', (_req, res) => {
    res.json(orders)
  })

  return app
}
