import { createNotifier } from './notifier.ts'

export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type OrderAction = 'place' | 'pay' | 'ship' | 'cancel'

export const transitions: Record<OrderStatus, Partial<Record<OrderAction, OrderStatus>>> = {
  draft: { place: 'placed', cancel: 'cancelled' },
  placed: { pay: 'paid', cancel: 'cancelled' },
  paid: { ship: 'shipped' },
  shipped: {},
  cancelled: {},
}

export type SendResult =
  | Readonly<{ kind: 'moved'; status: OrderStatus }>
  | Readonly<{ kind: 'rejected'; status: OrderStatus; action: OrderAction }>

export const createOrderMachine = () => {
  let status: OrderStatus = 'draft'
  const changes = createNotifier<OrderStatus>()

  return {
    status: () => status,
    subscribe: changes.subscribe,
    send: (action: OrderAction): SendResult => {
      const next = transitions[status][action]
      if (!next) return { kind: 'rejected', status, action }
      status = next
      changes.notify(next)
      return { kind: 'moved', status }
    },
  }
}
