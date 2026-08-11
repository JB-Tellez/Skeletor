# Playwright and Vitest Testing Skeleton Setup

This guide walks you through setting up a modern, single Vite project using three isolated testing strategies:
1. **Vitest (Node Mode):** For fast, isolated utility and unit tests.
2. **Vitest (Browser Mode):** For rendering components inside a real browser using Playwright as the provider.
3. **Playwright (E2E):** For full user-journey, black-box end-to-end testing.

---

## 1. Project Initialization

Create a fresh Vite project and install the core testing dependencies.

```bash
# Create a fresh Vite project with TypeScript
npm create vite@latest testing-skeleton -- --template react-ts
cd testing-skeleton

# Install base dependencies
npm install

# Install Vitest and the browser testing packages
npm i -D vitest @vitest/browser @vitest/browser-playwright vitest-browser-react
```

What each package is for:

| Package | Why it's needed |
| --- | --- |
| `vitest` | The test runner. |
| `@vitest/browser` | Vitest's browser mode. |
| `@vitest/browser-playwright` | The Playwright provider for browser mode. Imported by `vitest.config.ts`. |
| `vitest-browser-react` | Supplies `render()` for React component tests, plus mount/cleanup handling. |

`@playwright/test` and `playwright` are installed by step 2 below, so they are
deliberately absent from this command. All testing packages belong in
`devDependencies` — none of them should end up in `dependencies`.

---

## 2. Setup Playwright E2E Framework

Initialize the dedicated Playwright environment for your user journeys.

```bash
npm init playwright@latest
```

Select the following configuration choices when prompted by the CLI:
* **TypeScript or JavaScript:** `TypeScript`
* **Where to put your E2E tests:** `e2e` *(Change this from the default 'tests')*
* **Add a GitHub Actions workflow:** `No` *(Choose Yes if you want CI configs right away)*
* **Install Playwright browsers:** `Yes`

This installs `@playwright/test` (which depends on `playwright`) and generates
`playwright.config.ts`. It also generates a sample spec that tests
`https://playwright.dev` rather than your app; delete it and write your own
against `localhost` instead.

---

## 3. Configuration Files

### `vitest.config.ts`

Create or overwrite `vitest.config.ts` in your project root. The two test types
need **separate `projects`**: browser mode is all-or-nothing per project, so a
single top-level `browser.enabled` would force your Node unit tests into
Chromium too (and silently override `environment: 'node'`).

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        // 1. Standard Node environment for pure unit tests
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.unit.test.{ts,tsx}'],
        },
      },
      {
        // 2. Browser mode for component/interaction tests
        test: {
          name: 'browser',
          include: [
            'src/**/*.browser.test.{ts,tsx}',
            'tests/**/*.browser.{test,spec}.ts',
            'tests/browser/**/*.{test,spec}.ts',
          ],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
```

The root-level `plugins: [react()]` is inherited by both projects, which is what
lets the browser project compile JSX. If you ever add a `plugins` array to an
individual project, that inheritance stops for that project and you must include
`react()` there explicitly.

### `package.json`

Add distinct test runner entry points to your `scripts` block. Select the Vitest
project with `--project`; note that `--mode` is a *Vite env-file* flag and does
**not** filter tests.

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview",
  "test:unit": "vitest --project unit",
  "test:component": "vitest --project browser",
  "test:e2e": "playwright test",
  "test:all": "vitest run --project unit && vitest run --project browser && playwright test"
}
```

`test:all` chains all three suites for a pre-commit or CI check. It spells out
`vitest run` rather than calling the two Vitest scripts above, because those
default to watch mode and would never hand control back. The `&&` chain stops at
the first failure, so a broken unit test skips the slow E2E pass.

### `playwright.config.ts`

The generated config leaves `webServer` commented out, so `npm run test:e2e`
assumes you already started a dev server — and if something else holds Vite's
port, Vite quietly moves to the next one and your E2E suite tests *that* app
instead. The failure surfaces as a confusing title mismatch.

Define the port once and feed it to both `webServer` and `use.baseURL`:

```typescript
const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run dev -- --strictPort --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
```

Three details carry the weight:

* **`--strictPort`** makes Vite fail loudly rather than drifting to 5174.
* **`reuseExistingServer: false`** guarantees you test this app, not whatever is
  already listening. The common `!process.env.CI` value reuses any local server,
  which is exactly the trap above. Use `false` unless a slow startup makes the
  reuse worth the risk.
* **`baseURL`** lets specs call `page.goto('/')`, so the port lives in one file.

With the port occupied, `npm run test:e2e` now refuses to start:

```text
Error: http://localhost:5173 is already used, make sure that nothing is
running on the port/url or set reuseExistingServer:true in config.webServer.
```

---

## 4. Recommended Directory Layout

Organizing your folder layout ensures that tests execute in their expected target environment. Filename suffixes are what route each file to a project, so they must match the `include` patterns above.

```text
testing-skeleton/
├── e2e/
│   └── App.spec.ts                     # Playwright E2E tests
├── src/
│   ├── components/
│   │   ├── FunkyButton.tsx
│   │   └── FunkyButton.browser.test.tsx  # Vitest Browser component tests
│   ├── utils/
│   │   ├── math.ts
│   │   └── math.unit.test.ts           # Vitest Node unit tests
│   └── main.tsx
├── playwright.config.ts                # Playwright E2E configuration
└── vitest.config.ts                    # Vitest Unit + Browser configuration
```

---

## 5. Reference Boilerplate Code

### Standard Unit Test

`src/utils/math.ts` (The module under test)

```typescript
export const add = (a: number, b: number) => a + b
```

`src/utils/math.unit.test.ts` (Runs quickly inside a Node environment)

```typescript
import { expect, test } from 'vitest'
import { add } from './math'

test('adds numbers correctly in Node', () => {
  expect(add(2, 3)).toBe(5)
})
```

### Browser Component Test

`src/components/FunkyButton.browser.test.tsx` (Renders inside a real browser instance managed by Vitest)

`render` comes from `vitest-browser-react` — `@vitest/browser/context` does not
export one. The returned object exposes locators, and `.click()` is awaited
because it drives a real browser event.

```tsx
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import FunkyButton from './FunkyButton'

test('renders component and registers real click events', async () => {
  let clicked = false

  const screen = await render(
    <FunkyButton onClick={() => clicked = true}>Click Me</FunkyButton>
  )

  const button = screen.getByText('Click Me')
  await button.click()

  expect(clicked).toBe(true)
})
```

### End-to-End Test

`e2e/App.spec.ts` (Full browser validation directly managed by Playwright)

`page.goto('/')` resolves against `use.baseURL`, and Playwright starts the dev
server itself — no need to run `npm run dev` first. Keep the title assertion in
sync with the `<title>` in `index.html`, or this test will fail against a
correctly working app.

```typescript
import { test, expect } from '@playwright/test'

test('should load application homepage successfully', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('skeletor')
})
```

---

## 6. Running the Tests

```bash
npm run test:unit        # Node unit tests only — fast, no browser boot
npm run test:component   # Browser component tests in Chromium
npm run test:e2e         # Playwright E2E across chromium, firefox, webkit
npm run test:all         # All three in sequence, non-watch, stops at first failure
```

`test:e2e` starts and stops its own dev server, so it needs no setup — but it
will refuse to run if something already occupies the port. Stop that process
first rather than reaching for `reuseExistingServer: true`.

Add `--run` to either Vitest script for a single non-watch run
(`npm run test:unit -- --run`).

To confirm the projects are actually split, check the reported file counts: each
Vitest script should pick up only its own tests, and `test:unit` should show
`environment` and total duration far below `test:component`, which pays for
launching a browser.
