# Add behavior without touching the function

`createChargeOrder` of the workshop shop does three jobs at once (`src/decorator/shop.ts`): it charges, it retries and it measures. It retries a declined card, a failed call is never measured, and `createLoadPrice` cannot reuse any of it. `src/decorator/shop.test.ts` documents all four bugs, each one passes for the wrong reason.

## Setup

From the repository root:

```sh
npm ci
npx vitest run packages/swap-create/src/decorator
```

## Exercise

1. Run the tests and read `src/decorator/shop.test.ts`: why does the card get charged three times?
2. Write `withTiming(fn, name, record, now)` in a new file `src/decorator/decorators.ts`. It returns a function with the signature of `fn` and records `{ name, ms }`, also when `fn` fails.
3. Write `withRetry(fn, { attempts, retryOn })`. Only errors for which `retryOn(error)` returns true are repeated. Keep it simple: no backoff here.
4. Write `withCache(fn)`. The key is `JSON.stringify(args)`, and a failed call is not stored.
5. Reduce `createChargeOrder` to a call of the gateway and build the result from the outside: `withTiming(withRetry(charge, ...), ...)`. Build `loadPrice` the same way with `withRetry` and `withCache`.
6. Swap `withTiming` and `withRetry` and write a test that shows the difference.
7. Wrap an async Express handler with `withTiming`. Check with a test that a thrown error still reaches the error handler and still gets measured.
8. Try the same with an error handler. Why does Express no longer call it? Look at `fn.length`.
9. Replace the bug tests and the `it.todo` entries with tests for the correct behavior.

## Solution

`solution/decorator/` contains a possible solution: `npx vitest run packages/swap-create/solution/decorator`.
