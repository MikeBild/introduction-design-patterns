# One value for the whole tree or request

The same pattern in three places of the workshop shop, and three ways to get it wrong. In React, `greeting.tsx` has a fake default, so a missing provider stays unnoticed. In GraphQL, `graphql.ts` keeps the customer in a module variable, so parallel operations see each other's customer. In Node, `audit.ts` does the same with a request id. `provider-context.test.tsx` documents all three.

## Setup

Run this from the repository root:

```sh
npm install
npx vitest run packages/share-react/src/provider-context
```

## Exercise

1. Read `provider-context.test.tsx`: why do both operations answer with Grace?
2. **React.** Change the default of `CustomerContext` to `null`. Write `useCustomer()` with `use(CustomerContext)`, which throws `useCustomer needs a CustomerContext` when there is no provider.
3. Render `<CustomerContext value={customer}>` instead of `.Provider`. React 19 still accepts the old form, but it is the earlier form.
4. Move the read in `CartNote` behind the `show` check. `use` allows that, `useContext` does not.
5. **GraphQL.** Remove `currentCustomerId`. Type the server with `new ApolloServer<Context>`, pass `{ contextValue: { customerId } }` to `executeOperation`, and read it in the third resolver parameter.
6. **Node.** Remove `currentRequestId`. Create an `AsyncLocalStorage<{ requestId: string }>`, wrap `handleOrder` in `storage.run()`, and read the store in `audit`. Outside of a request, `audit` throws.
7. Replace the bug tests and the `it.todo` entries with tests for the correct behaviour.

## Solution

`solution/provider-context` contains a possible solution: `npx vitest run packages/share-react/solution/provider-context`.
