export type Listener<T> = (value: T) => void
export type Teardown = () => void

export const createNotifier = <T>() => {
  const listeners = new Set<Listener<T>>()

  return {
    subscribe: (listener: Listener<T>): Teardown => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    notify: (value: T) => {
      for (const listener of [...listeners]) listener(value)
    },
  }
}
