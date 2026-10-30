# One function builds, the rest uses

`shop.ts` works, and it cannot be tested: the order counter, the price cache, the clock and the Express app all live at module level. Every test shares them with the test before it. `factory.test.ts` documents the result, each test passes for the wrong reason.

## Setup

Run this from the repository root:

```sh
npm install
npx vitest run packages/swap-create/src/factory
```

## Exercise

1. Read `factory.test.ts`: why does the first test not know its own order number?
2. Write `createOrderNumbers({ prefix, start })`. It returns a function, and the counter lives in the closure.
3. Write `createPriceLookup({ loadPrice, ttlMs, clock })`. It returns a function with its own cache. `loadPrice` and `clock` are arguments, so a test passes fakes.
4. Write `createPlaceOrder({ nextNumber, lookupPrice, clock })`. No `new`, no import of a shared instance.
5. Write `createOrderRoutes({ placeOrder })`. It returns an `express.Router()`, so the module no longer creates an app.
6. Replace the bug tests and the `it.todo` entries with tests for the correct behaviour. Every test builds what it needs.

Where all factories get wired up in a real service is the topic of `node-architecture` (composition root), so this exercise wires them in the tests only.

## Solution

`solution/factory` contains a possible solution: `npx vitest run packages/swap-create/solution/factory`.
