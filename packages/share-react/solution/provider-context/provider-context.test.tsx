import { renderToString } from 'react-dom/server'
import { expect, it } from 'vitest'
import { audit, handleOrder } from './audit.ts'
import { whoAmI } from './graphql.ts'
import { CartNote, CustomerContext, Greeting, Shop } from './greeting.tsx'

it('fails with a clear message when the provider is missing', () => {
  expect(() => renderToString(<Greeting />)).toThrow('useCustomer needs a CustomerContext')
})

it('passes the value down the tree', () => {
  const html = renderToString(<Shop customer={{ name: 'Ada' }} />)
  expect(html).toContain('Ada')
  expect(html).toContain('Cart of')
})

it('reads the context inside a condition', () => {
  expect(renderToString(<CartNote show={false} />)).toBe('')
  expect(
    renderToString(
      <CustomerContext value={{ name: 'Ada' }}>
        <CartNote show />
      </CustomerContext>,
    ),
  ).toContain('Ada')
})

it('gives every operation its own customer through contextValue', async () => {
  const [first, second] = await Promise.all([whoAmI('c-1'), whoAmI('c-2')])
  expect(first.me?.name).toBe('Ada')
  expect(second.me?.name).toBe('Grace')
})

it('keeps the request id of overlapping requests apart', async () => {
  const lines = await Promise.all([handleOrder('r-1', 'o-1'), handleOrder('r-2', 'o-2')])
  expect(lines).toEqual(['[r-1] stock reserved for o-1', '[r-2] stock reserved for o-2'])
})

it('fails with a clear message when audit runs outside a request', () => {
  expect(() => audit('no request')).toThrow('audit needs a running request')
})
