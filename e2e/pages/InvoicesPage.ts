import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InvoicesPage extends BasePage {
  protected readonly path = '/customers/:customerId/invoices';

  get table(): Locator {
    return this.page.getByRole('table', { name: 'Invoices' });
  }
  get rows(): Locator {
    // skip the header row
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell') });
  }
  get statusFilter(): Locator {
    return this.page.getByRole('combobox', { name: 'Status' });
  }

  rowByInvoiceNumber(invoiceNumber: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('cell', { name: invoiceNumber }) });
  }

  async open(customerId: string): Promise<void> {
    await this.goto({ customerId });
  }

  async filterByStatus(status: 'Open' | 'Paid' | 'Overdue'): Promise<void> {
    await this.statusFilter.selectOption({ label: status });
    await this.waitForLoaded();
  }
}
