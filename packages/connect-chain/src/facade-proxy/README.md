# A facade simplifies, a proxy controls

Two callers of the workshop shop coordinate stock, prices and payment by themselves (`src/facade-proxy/callers.ts`). The web checkout never releases reserved stock, the copied `reorder` forgot the stock completely, and both pay for every price lookup. `src/facade-proxy/callers.test.ts` documents all three bugs, each one passes for the wrong reason.

## Setup

From the repository root:

```sh
npm ci
npx vitest run packages/connect-chain/src/facade-proxy
```

## Exercise

1. Run the tests and read `src/facade-proxy/callers.test.ts`: which step does `reorder` skip, and which step is missing in both?
2. **Facade:** write `createPlaceOrder(services)` in a new file `src/facade-proxy/place-order.ts`. It returns `placeOrder(input)` with the result type `OrderResult` and coordinates the three services in one place: reserve, sum up, charge, and release the stock when the payment is declined.
3. Make `checkoutWeb` and `reorder` one-line calls of `placeOrder`.
4. **Proxy:** write `createCachedPrices(prices)` in a new file `src/facade-proxy/cached-prices.ts`. It returns a `PriceService`, so no caller changes. A known price is answered from a `Map`, a failed lookup is not stored.
5. Replace the bug tests and the `it.todo` entries with tests for the correct behavior.
6. Answer in one sentence: why is `createPlaceOrder` not a proxy, and why would a function that turns `{ sku, qty }` into `OrderItem` be neither?

## Solution

`solution/facade-proxy/` contains a possible solution: `npx vitest run packages/connect-chain/solution/facade-proxy`.
