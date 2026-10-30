import { expect, it } from 'vitest'
import { createOrderTracker } from './order-tracker.ts'

it('jumps from draft to shipped, because every status is allowed', () => {
  const tracker = createOrderTracker()
  tracker.setStatus('shipped')
  expect(tracker.status()).toBe('shipped')
})

it('brings a cancelled order back to paid', () => {
  const tracker = createOrderTracker()
  tracker.setStatus('cancelled')
  tracker.setStatus('paid')
  expect(tracker.status()).toBe('paid')
})

it('keeps an inline listener forever, because nobody holds a reference to it', () => {
  const tracker = createOrderTracker()
  const mount = () => tracker.subscribe((status) => status)
  mount()
  mount()
  mount()
  expect(tracker.listenerCount()).toBe(3)
})

it('skips the next listener when one unsubscribes while being notified', () => {
  const tracker = createOrderTracker()
  const seen: string[] = []
  const once = () => {
    seen.push('once')
    tracker.unsubscribe(once)
  }
  tracker.subscribe(once)
  tracker.subscribe(() => seen.push('mail'))
  tracker.setStatus('placed')
  expect(seen).toEqual(['once'])
})

it('removes the wrong listener when asked for an unknown one', () => {
  const tracker = createOrderTracker()
  const seen: string[] = []
  tracker.subscribe(() => seen.push('mail'))
  tracker.unsubscribe(() => undefined)
  tracker.setStatus('placed')
  expect(seen).toEqual([])
})

// Your turn, see the exercise in README.md.
it.todo('notifies every subscriber')
it.todo('stops notifying after the teardown function ran')
it.todo('notifies everyone even if a listener unsubscribes while being notified')
it.todo('does not notify a listener that subscribes during a notification')
it.todo('allows the transitions of the table and no others')
it.todo('rejects a forbidden action without notifying anyone')
