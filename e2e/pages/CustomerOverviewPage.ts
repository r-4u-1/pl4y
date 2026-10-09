import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerOverviewPage extends BasePage {
  protected readonly path = '/customers/:customerId';

  // ---- Locators (role-based) ----
  get customerName(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }
  get statusBadge(): Locator {
    return this.page.getByRole('status', { name: /customer status/i });
  }
  get editButton(): Locator {
    return this.page.getByRole('button', { name: 'Edit customer' });
  }
  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }
  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }
  get invoicesTab(): Locator {
    return this.page.getByRole('tab', { name: 'Invoices' });
  }
  get blockedAlert(): Locator {
    return this.page.getByRole('alert');
  }

  // ---- Actions ----
  async open(customerId: string): Promise<void> {
    await this.goto({ customerId });
    await expect(this.customerName).toBeVisible();
  }

  async updateEmail(email: string): Promise<void> {
    await this.editButton.click();
    await this.emailInput.fill(email);
    await this.saveButton.click();
  }

  async openInvoices(): Promise<void> {
    await this.invoicesTab.click();
    await this.waitForLoaded();
  }
}
