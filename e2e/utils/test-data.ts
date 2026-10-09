import fs from 'node:fs';
import path from 'node:path';
import type { CustomerScenario } from '../data/customer-queries';

export type CustomerPool = Record<CustomerScenario, string[]>;

export const CUSTOMER_POOL_ENV_KEY = 'TEST_CUSTOMERS';
export const CUSTOMER_POOL_FILE = () =>
  path.resolve(process.cwd(), 'e2e', '.data', `customers.${process.env.TEST_ENV ?? 'ft'}.json`);

let cache: CustomerPool | undefined;

/** Reads the pool written by globalSetup (env var first, JSON file as fallback). */
export function getCustomerPool(): CustomerPool {
  if (cache) return cache;

  const fromEnv = process.env[CUSTOMER_POOL_ENV_KEY];
  if (fromEnv) {
    cache = JSON.parse(fromEnv) as CustomerPool;
    return cache;
  }

  const file = CUSTOMER_POOL_FILE();
  if (fs.existsSync(file)) {
    cache = JSON.parse(fs.readFileSync(file, 'utf-8')) as CustomerPool;
    return cache;
  }

  cache = {} as CustomerPool;
  return cache;
}

/**
 * Picks a customer for a scenario. Spreads parallel workers across the list
 * (worker 0 → first id, worker 1 → second id…) so tests don't collide on the same customer.
 * Returns undefined when no data exists.
 */
export function pickCustomer(scenario: CustomerScenario, workerIndex = 0): string | undefined {
  const ids = getCustomerPool()[scenario] ?? [];
  if (ids.length === 0) return undefined;
  return ids[workerIndex % ids.length];
}
