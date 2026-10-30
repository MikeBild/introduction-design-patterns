# First the problem, then the pattern

Seven situations from the workshop shop (`src/why/situations.ts`) and a review that was finished in a hurry (`src/why/diagnosis.ts`): the same pattern seven times, and not one problem written down. `src/why/diagnosis.test.ts` documents that state.

## Setup

From the repository root:

```sh
npm ci
npx vitest run packages/connect-chain/src/why
```

## Exercise

1. Read `src/why/situations.ts`. For each situation, write the problem into `problem` in one sentence of your own, without a pattern name.
2. Only now pick the `pattern`. A situation may also get `'no pattern'`.
3. Replace the bug tests and the `it.todo` entries with tests for your diagnosis: every `problem` is filled in, and at least four different values appear in `pattern`.
4. Compare with `solution/why/diagnosis.ts`. A different answer is fine if your problem sentence explains it.

## Solution

`solution/why/` contains a possible solution: `npx vitest run packages/connect-chain/solution/why`.
