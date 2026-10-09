import { test, expect, TAGS } from '../utils/fixtures';
import { uniqueEmail } from '../utils/helpers';

test.describe('Customer overview', () => {
  test('shows an active customer', { tag: TAGS.both }, async ({ customerFor, customerOverviewPage }) => {
    const customerId = customerFor('activeCustomer');

    await customerOverviewPage.open(customerId);

    await expect(customerOverviewPage.statusBadge).toHaveText(/active/i);
  });

  // Only in FT — we don't mutate customer data in ST
  test('can update customer email', { tag: TAGS.ft }, async ({ customerFor, customerOverviewPage }) => {
    const customerId = customerFor('activeCustomer');
    const email = uniqueEmail('customer');

    await customerOverviewPage.open(customerId);
    await customerOverviewPage.updateEmail(email);

    await customerOverviewPage.expectToast(/saved/i);
    await expect(customerOverviewPage.emailInput).toHaveValue(email);
  });

  test('shows warning for blocked customer', { tag: TAGS.st }, async ({ customerFor, customerOverviewPage }) => {
    const customerId = customerFor('blockedCustomer'); // skipped + logged if none found

    await customerOverviewPage.open(customerId);

    await expect(customerOverviewPage.blockedAlert).toContainText(/blocked/i);
    await expect(customerOverviewPage.editButton).toBeDisabled();
  });
});
