import express, { Router, type ErrorRequestHandler, type RequestHandler } from 'express'
import type { Order } from '../../src/chain/app.ts'

const httpError = (status: number, message: string) => Object.assign(new Error(message), { status })

const requireApiKey =
  (apiKey: string): RequestHandler =>
  (req, res, next) => {
    if (req.get('x-api-key') === apiKey) return next()
    // No next(): the response ends the chain.
    res.status(401).json({ error: 'Check your API key.' })
  }

const validateOrder: RequestHandler = (req, _res, next) => {
  const { customerId, items } = req.body as Partial<Order>
  if (customerId && items?.length) return next()
  // next(error) skips everything up to the error handler.
  next(httpError(400, 'customerId and items are required'))
}

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = typeof error.status === 'number' ? error.status : 500
  res.status(status).json({ error: status === 500 ? 'Something went wrong.' : error.message })
}

export const createApp = (apiKey: string) => {
  const orders: Order[] = []

  const ordersRouter = Router()
  ordersRouter.use(requireApiKey(apiKey))
  ordersRouter.get('/', (_req, res) => {
    res.json(orders)
  })
  ordersRouter.post('/', validateOrder, (req, res) => {
    if (req.body.customerId === 'c-broken') throw new Error('Database unavailable')
    const order = { id: `o-${orders.length + 1}`, ...(req.body as Omit<Order, 'id'>) }
    orders.push(order)
    res.status(201).json(order)
  })

  const app = express()
  app.use(express.json())
  app.use('/orders', ordersRouter)
  app.use(errorHandler)
  return app
}
