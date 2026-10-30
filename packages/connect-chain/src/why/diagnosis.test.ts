import { expect, it } from 'vitest'
import { diagnosis } from './diagnosis.ts'
import { situations } from './situations.ts'

const entries = Object.values(diagnosis)

it('covers every situation', () => {
  expect(Object.keys(diagnosis).sort()).toEqual(Object.keys(situations).sort())
})

it('names the same pattern seven times, because nobody looked at the problem', () => {
  expect(new Set(entries.map(({ pattern }) => pattern)).size).toBe(1)
})

it('states no problem at all', () => {
  expect(entries.every(({ problem }) => problem === '')).toBe(true)
})

// Your turn, see the exercise in README.md.
it.todo('states the problem of every situation in one sentence')
it.todo('picks a pattern that fits the problem')
it.todo('answers "no pattern" where a plain function is enough')
