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
