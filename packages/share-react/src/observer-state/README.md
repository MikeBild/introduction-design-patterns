# Whoever subscribes gets notified

`order-tracker.ts` tracks the status of an order and tells its listeners. Two things are wrong. Any status can follow any other, so a draft ships without being paid. And the listener handling leaks: an inline listener can never be removed, and removing one during a notification skips the next. `observer-state.test.ts` documents all of it, each test passes for the wrong reason.

## Setup

Run this from the repository root:

```sh
npm install
npx vitest run packages/share-react/src/observer-state
```

## Exercise

1. Read `observer-state.test.ts`: why does the mail listener miss the status change?
2. **Observer.** Write `createNotifier<T>()` in a new file `notifier.ts` with `subscribe(listener)` and `notify(value)`. `subscribe` returns a teardown function. Hold the listeners in a `Set` and notify over a copy.
3. **State machine.** Write the table in `order-machine.ts`, typed as `Record<OrderStatus, Partial<Record<OrderAction, OrderStatus>>>`, with the actions `place`, `pay`, `ship` and `cancel`. The rules: draft → placed → paid → shipped, `cancelled` only from draft or placed.
4. Write `createOrderMachine()` with `status()`, `subscribe` and `send(action)`. `send` looks up the table and returns `{ kind: 'moved', status }` or `{ kind: 'rejected', status, action }`. Only a move notifies.
5. Replace the bug tests and the `it.todo` entries with tests for the correct behaviour.
6. Delete `order-tracker.ts`.

## Solution

`solution/observer-state` contains a possible solution: `npx vitest run packages/share-react/solution/observer-state`.
