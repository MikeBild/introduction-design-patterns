import { expect, it } from 'vitest'
import { chain, type Handler } from './chain.ts'

type Req = { apiKey: string; visited: string[] }

const log: Handler<Req> = (request, next) => {
  request.visited.push('log')
  return next()
}
const requireKey: Handler<Req> = async (request, next) => {
  request.visited.push('key')
  return request.apiKey === 'secret' ? next() : { status: 401 }
}
const place: Handler<Req> = async (request) => {
  request.visited.push('place')
  return { status: 201, body: { id: 'o-1' } }
}

const placeOrder = chain(log, requireKey, place)

it('runs the handlers in order and returns the reply of the last one', async () => {
  const request = { apiKey: 'secret', visited: [] }
  expect(await placeOrder(request)).toEqual({ status: 201, body: { id: 'o-1' } })
  expect(request.visited).toEqual(['log', 'key', 'place'])
})

it('stops as soon as a handler does not call next', async () => {
  const request = { apiKey: 'wrong', visited: [] }
  expect(await placeOrder(request)).toEqual({ status: 401 })
  expect(request.visited).toEqual(['log', 'key'])
})

it('lets a handler change the reply on the way back', async () => {
  const tag: Handler<Req> = async (_request, next) => ({ ...(await next()), body: 'tagged' })
  expect(await chain(tag, place)({ apiKey: '', visited: [] })).toEqual({
    status: 201,
    body: 'tagged',
  })
})

it('answers 404 when the chain runs out of handlers', async () => {
  expect(await chain(log)({ apiKey: '', visited: [] })).toEqual({ status: 404 })
})
