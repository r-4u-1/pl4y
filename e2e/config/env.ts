/**
 * Per-environment settings, read straight from process.env.
 * Non-secret URLs have defaults here; anything exported in the shell wins.
 * Secrets (API_TOKEN) are never hardcoded — export them or set them in CI.
 */
export type TestEnv = 'ft' | 'st';

const defaults: Record<TestEnv, { baseURL: string; apiBaseURL: string }> = {
  ft: {
    baseURL: 'https://ft.myapp.example.com',
    apiBaseURL: 'https://api.ft.myapp.example.com',
  },
  st: {
    baseURL: 'https://st.myapp.example.com',
    apiBaseURL: 'https://api.st.myapp.example.com',
  },
};

export const TEST_ENV = (process.env.TEST_ENV ?? 'ft') as TestEnv;

if (!(TEST_ENV in defaults)) {
  throw new Error(`Unknown TEST_ENV "${TEST_ENV}". Use "ft" or "st".`);
}

// Make sure workers and globalSetup see the resolved value
process.env.TEST_ENV = TEST_ENV;

export const env = {
  name: TEST_ENV,
  baseURL: process.env.BASE_URL ?? defaults[TEST_ENV].baseURL,
  apiBaseURL: process.env.API_BASE_URL ?? defaults[TEST_ENV].apiBaseURL,
  apiToken: process.env.API_TOKEN,
};
