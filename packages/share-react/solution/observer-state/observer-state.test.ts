import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'
import { createNotifier } from './notifier.ts'
import { createOrderMachine, type OrderAction } from './order-machine.ts'

describe('notifier', () => {
  it('notifies every subscriber', () => {
    const changes = createNotifier<string>()
    const mail = vi.fn()
    const stock = vi.fn()
    changes.subscribe(mail)
    changes.subscribe(stock)
    changes.notify('placed')
    expect(mail).toHaveBeenCalledWith('placed')
    expect(stock).toHaveBeenCalledWith('placed')
  })

  it('stops notifying after the teardown function ran', () => {
    const changes = createNotifier<string>()
    const mail = vi.fn()
    const teardown = changes.subscribe(mail)
    teardown()
    teardown()
    changes.notify('placed')
    expect(mail).not.toHaveBeenCalled()
  })

  it('notifies everyone even if a listener unsubscribes while being notified', () => {
    const changes = createNotifier<string>()
    const seen: string[] = []
    const teardown = changes.subscribe(() => {
      seen.push('once')
      teardown()
    })
    changes.subscribe(() => seen.push('mail'))
    changes.notify('placed')
    changes.notify('paid')
    expect(seen).toEqual(['once', 'mail', 'mail'])
  })

  it('does not notify a listener that subscribes during a notification', () => {
    const changes = createNotifier<string>()
    const late = vi.fn()
    changes.subscribe(() => changes.subscribe(late))
    changes.notify('placed')
    expect(late).not.toHaveBeenCalled()
  })

  it('stops at a throwing listener, just like EventEmitter', () => {
    const fail = () => {
      throw new Error('mail server down')
    }
    const changes = createNotifier<string>()
    const emitter = new EventEmitter()
    const seen: string[] = []
    changes.subscribe(fail)
    changes.subscribe(() => seen.push('notifier'))
    emitter.on('change', fail)
    emitter.on('change', () => seen.push('emitter'))

    expect(() => changes.notify('placed')).toThrow('mail server down')
    expect(() => emitter.emit('change', 'placed')).toThrow('mail server down')
    expect(seen).toEqual([])
  })
})

describe('order machine', () => {
  const run = (...actions: OrderAction[]) => {
    const machine = createOrderMachine()
    return actions.map((action) => machine.send(action).kind)
  }

  it('allows the transitions of the table and no others', () => {
    expect(run('place', 'pay', 'ship')).toEqual(['moved', 'moved', 'moved'])
    expect(run('cancel')).toEqual(['moved'])
    expect(run('place', 'cancel')).toEqual(['moved', 'moved'])
    expect(run('ship')).toEqual(['rejected'])
    expect(run('pay')).toEqual(['rejected'])
    expect(run('place', 'pay', 'cancel')).toEqual(['moved', 'moved', 'rejected'])
    expect(run('cancel', 'pay')).toEqual(['moved', 'rejected'])
  })

  it('rejects a forbidden action without notifying anyone', () => {
    const machine = createOrderMachine()
    const listener = vi.fn()
    machine.subscribe(listener)

    expect(machine.send('ship')).toEqual({ kind: 'rejected', status: 'draft', action: 'ship' })
    expect(listener).not.toHaveBeenCalled()
    expect(machine.status()).toBe('draft')

    expect(machine.send('place')).toEqual({ kind: 'moved', status: 'placed' })
    expect(listener).toHaveBeenCalledExactlyOnceWith('placed')
  })
})
