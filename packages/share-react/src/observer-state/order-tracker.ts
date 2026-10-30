export type OrderStatus = 'draft' | 'placed' | 'paid' | 'shipped' | 'cancelled'
export type Listener = (status: OrderStatus) => void

export const createOrderTracker = () => {
  let status: OrderStatus = 'draft'
  const listeners: Listener[] = []

  return {
    status: () => status,
    listenerCount: () => listeners.length,
    subscribe: (listener: Listener) => {
      listeners.push(listener)
    },
    unsubscribe: (listener: Listener) => {
      listeners.splice(listeners.indexOf(listener), 1)
    },
    setStatus: (next: OrderStatus) => {
      status = next
      listeners.forEach((listener) => listener(next))
    },
  }
}
