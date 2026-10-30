# Behaviour is an argument

Two parts of the workshop shop that both hide behaviour behind a name. `shipping.ts` picks a shipping rate in a `switch`: a typo lands in `default` and ships for free, and a rate for one customer means another `case`. `cart.ts` knows one way to undo, for removing an item, and it loses the position while doing so. `strategy-command.test.ts` documents these bugs, each one passes for the wrong reason.

## Setup

Run this from the repository root:

```sh
npm install
npx vitest run packages/swap-create/src/strategy-command
```

## Exercise

1. Read `strategy-command.test.ts`: why does `'expres'` cost nothing, and why does the second `undo` not bring back the hammer?
2. **Strategy.** Define `type ShippingStrategy = (subtotalCents: number) => number` and write `standardShipping`, `expressShipping` and `pickupShipping`.
3. Change `orderTotalCents(order, shipping)` to take the strategy itself. A rate for one customer is now a function in the call, no change in `shipping.ts`.
4. Replace the `switch` with a table `shippingMethods`, checked with `satisfies Record<string, ShippingStrategy>`. Add `overnight` as one new line.
5. Write `pickShipping(name: string)` for names from the outside. It throws for unknown names. Use `Object.hasOwn`, because `shippingMethods['constructor']` finds `Object` otherwise.
6. **Command.** Define `type CartCommand = Readonly<{ label: string; execute: (items) => items; undo: (items) => items }>` and write `addItem`, `removeItem` and `changeQuantity`, each one returning a command. The closure keeps what `undo` needs.
7. Rebuild `createCart` around `run(command)`, `undo()`, `enqueue(command)` and `flush()`. A list of finished commands replaces `lastRemoved`.
8. Replace the bug tests and the `it.todo` entries with tests for the correct behaviour.

## Solution

`solution/strategy-command` contains a possible solution: `npx vitest run packages/swap-create/solution/strategy-command`.
