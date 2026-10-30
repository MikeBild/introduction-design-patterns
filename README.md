# Design patterns as functions

Exercises for the workshop [Design Patterns als Funktionen](https://workshops.mikebild.dev/w/design-patterns/remote/). Every pattern starts from a problem in the workshop shop and is written as a plain TypeScript function: no classes, no dependency injection container. Afterwards you find it again in Express, React and Apollo.

## Setup

You need Node.js 26 and npm 12. Node.js 26 ships npm 11, so update it first; the `devEngines` entry in `package.json` stops every other version.

```sh
npm install -g npm@12
npm ci
npm test
npm run typecheck
```

npm blocks the install scripts of `fsevents` and `@apollo/protobufjs`. Nothing here needs them. This repository is a workspace with `install-strategy=linked` (`.npmrc`), so a package only sees what it declares.

## Exercises

Each folder has a README with the exercise. Starters live in `src/`, a possible solution in `solution/`. Tests in `src/` document the bugs of the starter, `it.todo` entries are your turn.

### Connect and chain (`packages/connect-chain`)

- [Start from the problem](packages/connect-chain/src/why/README.md)
- [Facade and Proxy](packages/connect-chain/src/facade-proxy/README.md)
- [Chain of Responsibility](packages/connect-chain/src/chain/README.md)

The Adapter exercise is part of [introduction-nodejs](https://github.com/MikeBild/introduction-nodejs/tree/HEAD/EXAMPLES/ARCHITECTURE).

### Swap and create (`packages/swap-create`)

- [Decorator](packages/swap-create/src/decorator/README.md)
- [Strategy and Command](packages/swap-create/src/strategy-command/README.md)
- [Factory](packages/swap-create/src/factory/README.md)

### Share and react (`packages/share-react`)

- [Provider and Context](packages/share-react/src/provider-context/README.md)
- [Observer and State Machine](packages/share-react/src/observer-state/README.md)
- [When not to use a pattern](packages/share-react/src/when-not/README.md)

Run a single package with `npx vitest run packages/share-react`.

## License

MIT
