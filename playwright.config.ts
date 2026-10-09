import { defineConfig, devices } from '@playwright/test';
import { env } from './e2e/config/env';

export default defineConfig({
  testDir: './e2e/tests',

  // Runs once before all tests: fetches customer ids from the backend
  globalSetup: './e2e/global-setup.ts',

  // Only run tests tagged for the current environment (@ft / @st)
  grep: new RegExp(`@${env.name}\\b`),

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: `playwright-report/${env.name}`, open: 'never' }],
  ],

  use: {
    baseURL: env.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
