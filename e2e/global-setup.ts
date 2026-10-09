import type { FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { customerQueries, type CustomerScenario } from './data/customer-queries';
import { api } from './utils/api-client';
import { log } from './utils/logger';
import { CUSTOMER_POOL_ENV_KEY, CUSTOMER_POOL_FILE, type CustomerPool } from './utils/test-data';

/**
 * Calls the backend once per scenario and builds a pool like:
 * { activeCustomer: ['123', '456'], customerWithOpenInvoices: ['789'], ... }
 *
 * The pool is stored in:
 *  1. process.env.TEST_CUSTOMERS (inherited by all worker processes)
 *  2. e2e/.data/customers.<env>.json (fallback + easy debugging)
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  log.header(`Global setup — fetching test customers for [${process.env.TEST_ENV?.toUpperCase()}]`);

  const pool = {} as CustomerPool;

  const entries = Object.entries(customerQueries) as [
    CustomerScenario,
    (typeof customerQueries)[CustomerScenario],
  ][];

  await Promise.all(
    entries.map(async ([scenario, query]) => {
      try {
        const res = await api.get(query.endpoint, query.params);

        if (!res.ok) {
          log.warn(`${scenario}: ${query.endpoint} responded ${res.status} — no customers`);
          pool[scenario] = [];
          return;
        }

        const ids = [...new Set(query.extractIds(res.body))].map(String);
        pool[scenario] = ids;

        if (ids.length === 0) log.warn(`${scenario}: 0 customers found`);
        else log.success(`${scenario}: ${ids.length} customer(s) → ${ids.join(', ')}`);
      } catch (err) {
        log.error(`${scenario}: request to ${query.endpoint} failed — ${(err as Error).message}`);
        pool[scenario] = [];
      }
    }),
  );

  process.env[CUSTOMER_POOL_ENV_KEY] = JSON.stringify(pool);

  const file = CUSTOMER_POOL_FILE();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(pool, null, 2));
  log.info(`Customer pool written to ${path.relative(process.cwd(), file)}`);
}
