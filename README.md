# skeletor

A React + TypeScript + Vite skeleton wired for three isolated layers of testing:

| Layer | Runner | Environment | Filename pattern |
| --- | --- | --- | --- |
| Unit | Vitest (`unit` project) | Node | `src/**/*.unit.test.ts` |
| Component | Vitest (`browser` project) | Real Chromium via Playwright | `src/**/*.browser.test.tsx` |
| E2E | Playwright | chromium, firefox, webkit | `e2e/**/*.spec.ts` |

Each layer runs in the environment it actually needs, so unit tests stay fast and
never pay for a browser boot. For how this was assembled from an empty directory
and why each configuration choice was made, see [SETUP.md](SETUP.md).

## Getting started

```bash
npm install
npx playwright install   # one-time browser download, needed by component + E2E tests
npm run dev
```

## Running the tests

```bash
npm run test:unit        # Node unit tests — fast, no browser
npm run test:component   # Component tests in Chromium
npm run test:e2e         # E2E across chromium, firefox, webkit
npm run test:all         # All three in sequence, non-watch, stops at first failure
```

`test:unit` and `test:component` watch by default; add `-- --run` for a single
pass. `test:all` already runs non-watch, which is what makes it usable in CI or a
pre-commit hook.

`test:e2e` starts and stops its own dev server on port 5173, so you don't need
`npm run dev` running first — but it will refuse to start if that port is already
taken. Stop the other process rather than setting `reuseExistingServer: true`;
[SETUP.md](SETUP.md) explains why that setting is a trap.

## Layout

```text
skeletor/
├── e2e/
│   └── App.spec.ts                       # Playwright E2E
├── src/
│   ├── components/
│   │   ├── FunkyButton.tsx
│   │   └── FunkyButton.browser.test.tsx  # Vitest browser-mode component test
│   ├── utils/
│   │   ├── math.ts
│   │   └── math.unit.test.ts             # Vitest Node unit test
│   └── main.tsx
├── playwright.config.ts                  # E2E config; owns the dev-server port
├── vitest.config.ts                      # unit + browser projects
└── tsconfig.node.json                    # type-checks the config files above
```

The filename suffix is what routes a test to its project — a component test named
`Foo.test.tsx` instead of `Foo.browser.test.tsx` matches no `include` pattern and
will be silently skipped. The patterns live in [vitest.config.ts](vitest.config.ts).

## Other scripts

```bash
npm run build   # tsc -b && vite build
npm run lint    # oxlint
npm run preview # serve the production build
```

## Notes

**Type-aware linting.** [.oxlintrc.json](.oxlintrc.json) enables the react,
typescript, and oxc plugins. For a production app, add `"options": { "typeAware":
true }` and install `oxlint-tsgolint` to get rules that use type information. See
the [Oxlint rules docs](https://oxc.rs/docs/guide/usage/linter/rules).

**React Compiler** is not enabled, because of its impact on dev and build times.
To turn it on, see the [installation guide](https://react.dev/learn/react-compiler/installation).

**Vite React plugins.** This uses
[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
(Oxc-based). The alternative is
[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
(SWC-based).
