# When a pattern is too much

`checkout.ts` calculates an order summary. That takes a singleton registry, a service locator, a strategy with one implementation, a factory for that strategy and a builder for three fields. All of it works, and none of it earns its place. `checkout.test.ts` pins the behaviour with characterization tests and shows what the patterns cost.

## Setup

Run this from the repository root:

```sh
npm install
npx vitest run packages/share-react/src/when-not
```

## Exercise

Remove one pattern at a time and run the tests after each step. The three characterization tests stay green.

1. For each pattern, ask: which change does it make easier, and has that change ever happened?
2. **Builder.** Return the object literal directly.
3. **Factory, service locator and singleton.** They hang together, so remove them in one step: call the strategy directly and delete `serviceLocator`. The two bug tests go with it. A misspelled name is now a compile error.
4. **Strategy.** One tax rule needs no strategy. Keep a named function `vatCents(netCents)`. If a second rate ever shows up, a parameter is enough.
5. Compare the line counts before and after. Write down the one pattern you would keep, if any, and why.

## Solution

`solution/when-not` contains a possible solution: `npx vitest run packages/share-react/solution/when-not`.
