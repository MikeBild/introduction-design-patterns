# Every step decides whether it goes on

`POST /orders` of the workshop shop does everything in one handler (`src/chain/app.ts`). A wrong API key sets the status to 401, but the order is stored anyway. An invalid order ends as an HTML error page. And `GET /orders` has no key check, because nobody copied it. `src/chain/app.test.ts` documents all three bugs, each one passes for the wrong reason.

## Setup

From the repository root:

```sh
npm ci
npx vitest run packages/connect-chain/src/chain
```

## Exercise

1. Run the tests and read `src/chain/app.test.ts`: why does the wrong key not stop the order?
2. **Build it yourself:** write `chain(...handlers)` in a new file `src/chain/chain.ts`, without Express and in a few lines. A handler has the type `(request: Req, next: () => Promise<Reply>) => Promise<Reply>`. Whoever does not call `next` ends the chain, and the reply travels back as the return value. If the chain runs out of handlers, it answers `{ status: 404 }`.
3. Test it with three handlers: all three run in order, and a handler that does not call `next` stops the rest.
4. **Recognize it in Express:** split the route into the middleware functions `requireApiKey` and `validateOrder`. `requireApiKey` answers 401 and does not call `next`. `validateOrder` calls `next(error)` with an error that carries `status: 400`.
5. Put both routes into an `orders` router, and mount `requireApiKey` once in front of them with `router.use`.
6. Add an error handler with four parameters behind all routes. It answers JSON with `error.status`, otherwise `500`.
7. Replace the bug tests and the `it.todo` entries with tests for the correct behavior.

## Solution

`solution/chain/` contains a possible solution: `npx vitest run packages/connect-chain/solution/chain`.
