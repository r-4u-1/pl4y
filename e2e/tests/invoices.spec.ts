import { test, expect, TAGS } from '../utils/fixtures';

test.describe('Invoices', () => {
  test('lists open invoices', { tag: TAGS.both }, async ({ customerFor, invoicesPage }) => {
    const customerId = customerFor('customerWithOpenInvoices');

    await invoicesPage.open(customerId);
    await invoicesPage.filterByStatus('Open');

    await expect(invoicesPage.rows.first()).toBeVisible();
  });

  test('open invoice count matches backend', { tag: TAGS.ft }, async ({ customerFor, api, invoicesPage }) => {
    const customerId = customerFor('customerWithOpenInvoices');

    const res = await api.get<unknown[]>(`/api/customers/${customerId}/invoices`, { status: 'OPEN' });
    expect(res.ok).toBeTruthy();
    const invoices = res.body;

    await invoicesPage.open(customerId);
    await invoicesPage.filterByStatus('Open');

    await expect(invoicesPage.rows).toHaveCount(invoices.length);
  });
});
