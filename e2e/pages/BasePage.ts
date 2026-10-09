import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Shared behaviour for all page objects.
 * Locators are role-based (getByRole/getByLabel) so they match what users see.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  // Common app shell elements
  get mainHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }
  get spinner(): Locator {
    return this.page.getByRole('progressbar');
  }
  get toast(): Locator {
    return this.page.getByRole('status');
  }
  get navigation(): Locator {
    return this.page.getByRole('navigation', { name: 'Main' });
  }

  async goto(params: Record<string, string> = {}): Promise<void> {
    let url = this.path;
    for (const [key, value] of Object.entries(params)) url = url.replace(`:${key}`, value);
    await this.page.goto(url);
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.spinner).toHaveCount(0);
  }

  async navigateTo(linkName: string): Promise<void> {
    await this.navigation.getByRole('link', { name: linkName }).click();
    await this.waitForLoaded();
  }

  async expectToast(text: string | RegExp): Promise<void> {
    await expect(this.toast).toContainText(text);
  }
}
