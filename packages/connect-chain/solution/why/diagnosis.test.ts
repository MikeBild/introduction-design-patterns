import { expect, it } from 'vitest'
import { situations } from '../../src/why/situations.ts'
import { diagnosis } from './diagnosis.ts'

const entries = Object.values(diagnosis)

it('covers every situation', () => {
  expect(Object.keys(diagnosis).sort()).toEqual(Object.keys(situations).sort())
})

it('states the problem of every situation in one sentence', () => {
  expect(entries.every(({ problem }) => problem.endsWith('.'))).toBe(true)
})

it('picks a pattern that fits the problem', () => {
  expect(new Set(entries.map(({ pattern }) => pattern)).size).toBe(7)
  expect(entries.some(({ pattern }) => pattern === 'singleton')).toBe(false)
})

it('answers "no pattern" where a plain function is enough', () => {
  expect(diagnosis['order-total'].pattern).toBe('no pattern')
})
