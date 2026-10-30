import type { OrderItem } from './shipping.ts'

type Items = readonly OrderItem[]

export type CartCommand = Readonly<{
  label: string
  execute: (items: Items) => Items
  undo: (items: Items) => Items
}>

export const addItem = (item: OrderItem): CartCommand => {
  let index = -1
  return {
    label: `add ${item.productId}`,
    execute: (items) => {
      index = items.length
      return [...items, item]
    },
    // Undo removes this one line: an earlier line of the same product stays.
    undo: (items) => items.toSpliced(index, 1),
  }
}

export const removeItem = (productId: string): CartCommand => {
  let index = -1
  let removed: OrderItem | undefined
  return {
    label: `remove ${productId}`,
    execute: (items) => {
      index = items.findIndex((item) => item.productId === productId)
      removed = items[index]
      return items.filter((item) => item.productId !== productId)
    },
    undo: (items) => (removed ? items.toSpliced(index, 0, removed) : items),
  }
}

export const changeQuantity = (productId: string, quantity: number): CartCommand => {
  let previous = quantity
  const setQuantity = (items: Items, next: number) =>
    items.map((item) => (item.productId === productId ? { ...item, quantity: next } : item))
  return {
    label: `change ${productId} to ${quantity}`,
    execute: (items) => {
      previous = items.find((item) => item.productId === productId)?.quantity ?? quantity
      return setQuantity(items, quantity)
    },
    undo: (items) => setQuantity(items, previous),
  }
}

export const createCart = () => {
  let items: Items = []
  const done: CartCommand[] = []
  const queued: CartCommand[] = []

  const run = (command: CartCommand) => {
    items = command.execute(items)
    done.push(command)
  }

  return {
    items: () => items,
    log: () => done.map((command) => command.label),
    run,
    undo: () => {
      const command = done.pop()
      if (command) items = command.undo(items)
    },
    enqueue: (command: CartCommand) => {
      queued.push(command)
    },
    flush: () => queued.splice(0).forEach(run),
  }
}
