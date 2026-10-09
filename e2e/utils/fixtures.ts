import { test as base, expect } from '@playwright/test';
import type { CustomerScenario } from '../data/customer-queries';
import { CustomerOverviewPage } from '../pages/CustomerOverviewPage';
import { InvoicesPage } from '../pages/InvoicesPage';
import { api, type ApiClient } from './api-client';
import { log } from './logger';
import { pickCustomer } from './test-data';

type Fixtures = {
  /** Returns a customer id for the scenario, or skips the test (with a coloured log) if none exist. */
  customerFor: (scenario: CustomerScenario) => string;
  api: ApiClient;
  customerOverviewPage: CustomerOverviewPage;
  invoicesPage: InvoicesPage;
};

export const test = base.extend<Fixtures>({
  customerFor: async ({}, use, testInfo) => {
    await use((scenario) => {
      const id = pickCustomer(scenario, testInfo.parallelIndex);

      if (!id) {
        const reason = `no test data for scenario "${scenario}" in ${process.env.TEST_ENV?.toUpperCase()}`;
        log.skip(testInfo.title, reason);
        testInfo.annotations.push({ type: 'skip-reason', description: reason });
        testInfo.skip(true, reason);
      }

      testInfo.annotations.push({ type: 'customer', description: `${scenario}=${id}` });
      return id!;
    });
  },

  api: async ({}, use) => use(api),

  customerOverviewPage: async ({ page }, use) => use(new CustomerOverviewPage(page)),
  invoicesPage: async ({ page }, use) => use(new InvoicesPage(page)),
});

export { expect };

/** Tag helpers so tests read clearly: test('x', { tag: TAGS.both }, ...) */
export const TAGS = {
  ft: ['@ft'],
  st: ['@st'],
  both: ['@ft', '@st'],
} as const satisfies Record<string, string[]>;
