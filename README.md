*English · [Deutsch](README.de.md)*

# Exercises: Design Patterns as Functions

Exercise repo for the workshop “Design patterns as functions”. Each of the nine exercises comes with a README that states the task, a starting point with tests in `src/` and a possible solution in `solution/`. Every pattern starts with a problem in the workshop shop – orders, stock, prices, payment and shipping – and is written as a plain TypeScript function: no classes, no dependency injection container. Afterwards you find it again in Express, React and Apollo Server.

## What you learn

- Name the problem before the pattern and recognize when a plain function is enough
- Write Facade, Proxy, Chain of Responsibility, Decorator, Strategy, Command and Factory as functions and closures
- Recognize Provider, Context, Observer and State Machine in React, GraphQL and Node.js – and take them out again where they add nothing

## Prerequisites

- **Node.js 26** or newer – `engines` in [`package.json`](package.json) says `>=26`.
- **npm 12** – `devEngines` in `package.json` requires `^12.2.0` and stops with any other version. If `npm --version` shows something older, update first: `npm install -g npm@12`.

## Setup

```bash
git clone https://github.com/MikeBild/introduction-design-patterns.git
cd introduction-design-patterns
npm install -g npm@12   # only if npm --version does not show 12 yet
npm ci                  # installs all three packages of the workspace
npm test                # Vitest for starting points and solutions
npm run typecheck       # TypeScript strict
```

During installation npm blocks the install scripts of `fsevents` and `@apollo/protobufjs` and reports that as a warning. Nothing here needs them. The repo is an npm workspace with `install-strategy=linked` ([`.npmrc`](.npmrc)): a package only sees the dependencies it declares itself.

## How to work on an exercise

```text
packages/
  connect-chain/
    package.json           dependencies of this package, here Express 5
    src/
      facade-proxy/
        README.md          task, steps, solution
        callers.ts         your starting point
        services.ts        types and in-memory services of the workshop shop
        callers.test.ts    tests for the current state of the starting point, plus it.todo for your tests
    solution/
      facade-proxy/        a possible solution with tests
```

1. Read the `README.md` of the exercise and open the starting point in `src/`.
2. Run the tests and read them. The tests pin down the bugs of the starting point and pass for the wrong reason; the `it.todo` entries are your part.
3. Work through the steps of the task and replace the bug tests and the `it.todo` entries with tests for the correct behavior.
4. Then compare with `solution/`.

From the root directory:

| Command | What it does |
| --- | --- |
| `npm test` | Vitest for all starting points and solutions |
| `npm run test:watch` | Vitest in watch mode |
| `npx vitest run packages/share-react` | one package only |
| `npx vitest run packages/connect-chain/src/chain` | only the starting point of one exercise |
| `npx vitest run packages/connect-chain/solution/chain` | only the solution of one exercise |
| `npm run typecheck` | TypeScript strict for starting points and solutions |
| `npm run format` | Prettier for the whole repo |

## Exercises

Three packages, nine exercises, from easy to hard. The number sets the order; each exercise is a folder under `src/` with its own README.

### Connect and chain – `packages/connect-chain`

The Chain exercise builds on Express 5.

| No. | Pattern | Lesson | Exercise |
| --- | --- | --- | --- |
| 01 | – | The problem first, then the pattern | [src/why](packages/connect-chain/src/why/README.md) |
| 02 | Facade, Proxy | A Facade simplifies, a Proxy controls | [src/facade-proxy](packages/connect-chain/src/facade-proxy/README.md) |
| 03 | Chain of Responsibility | Every step decides whether to go on | [src/chain](packages/connect-chain/src/chain/README.md) |

The Adapter exercise lives in [introduction-nodejs](https://github.com/MikeBild/introduction-nodejs/tree/HEAD/EXAMPLES/ARCHITECTURE).

### Swap and create – `packages/swap-create`

The Decorator and the Factory exercise build on Express 5.

| No. | Pattern | Lesson | Exercise |
| --- | --- | --- | --- |
| 04 | Decorator | Add behavior without touching the function | [src/decorator](packages/swap-create/src/decorator/README.md) |
| 05 | Strategy, Command | Behavior is an argument | [src/strategy-command](packages/swap-create/src/strategy-command/README.md) |
| 06 | Factory | One function builds, the rest uses | [src/factory](packages/swap-create/src/factory/README.md) |

### Share and react – `packages/share-react`

The Provider exercise runs in React 19, Apollo Server 5 and Node.js.

| No. | Pattern | Lesson | Exercise |
| --- | --- | --- | --- |
| 07 | Provider, Context | One value for the whole tree or request | [src/provider-context](packages/share-react/src/provider-context/README.md) |
| 08 | Observer, State Machine | Whoever subscribes gets notified | [src/observer-state](packages/share-react/src/observer-state/README.md) |
| 09 | – | When a pattern is too much | [src/when-not](packages/share-react/src/when-not/README.md) |

## Workshop and slides

- Workshop: [“Design patterns as functions”](https://workshops.mikebild.dev/w/design-patterns/remote/)
- Slides: [slides.mikebild.dev/introduction-design-patterns](https://slides.mikebild.dev/introduction-design-patterns.html)
- PDF: [slides.mikebild.dev/introduction-design-patterns.pdf](https://slides.mikebild.dev/introduction-design-patterns.pdf)

## License

[MIT](LICENSE)
