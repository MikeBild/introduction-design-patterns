import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'
import { handleOrder } from './audit.ts'
import { whoAmI } from './graphql.ts'
import { Greeting, Shop } from './greeting.tsx'

it('greets a guest when the provider is missing, and nobody notices', () => {
  expect(renderToString(<Greeting />)).toContain('Guest')
})

it('passes the value down the tree', () => {
  expect(renderToString(<Shop customer={{ name: 'Ada' }} />)).toContain('Ada')
})

it('answers two parallel operations with the same customer', async () => {
  const [first, second] = await Promise.all([whoAmI('c-1'), whoAmI('c-2')])
  expect(first.me?.name).toBe('Grace')
  expect(second.me?.name).toBe('Grace')
})

it('writes the wrong request id when two requests overlap', async () => {
  const lines = await Promise.all([handleOrder('r-1', 'o-1'), handleOrder('r-2', 'o-2')])
  expect(lines).toEqual(['[r-2] stock reserved for o-1', '[r-2] stock reserved for o-2'])
})

// Your turn, see the exercise in README.md.
it.todo('fails with a clear message when the provider is missing')
it.todo('reads the context inside a condition')
it.todo('gives every operation its own customer through contextValue')
it.todo('keeps the request id of overlapping requests apart')
it.todo('fails with a clear message when audit runs outside a request')
