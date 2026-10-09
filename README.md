# Playwright E2E

```
playwright.config.ts          # reads e2e/config/env.ts, greps @ft/@st, points to global setup
e2e/
  config/env.ts               # TEST_ENV + URLs/token from process.env (with per-env defaults)
  global-setup.ts             # calls backend endpoints → customer id pool (env var + JSON file)
  data/customer-queries.ts    # one entry per customer scenario (endpoint, params, id extractor)
  utils/
    fixtures.ts               # extended `test`: customerFor(), api, page objects, TAGS
    test-data.ts              # reads pool, picks a customer per worker
    api-client.ts             # tiny get/post client on Node's built-in fetch
    logger.ts                 # coloured console logging
    helpers.ts                # uniqueEmail, requireEnv, …
  pages/                      # page objects with role-based locators
  tests/                      # specs tagged @ft / @st
```

## Running
```
export API_TOKEN=xxxx
npm run test:e2e:ft   # TEST_ENV=ft → runs @ft tests against FT
npm run test:e2e:st   # TEST_ENV=st → runs @st tests against ST
```

## Writing a test
```ts
test('my test', { tag: TAGS.both }, async ({ customerFor, customerOverviewPage }) => {
  const id = customerFor('activeCustomer'); // skips + yellow log if no data
  await customerOverviewPage.open(id);
});
```

Add a new customer type by adding a key to `customer-queries.ts` — it's typed, so `customerFor('newKey')` autocompletes.

Add `e2e/.data/` to `.gitignore`.
