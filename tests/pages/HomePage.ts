/**
 * pages/HomePage.ts
 * Page Object for the home page (/)
 */

import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly logo: Locator;
  readonly startEditingBtn: Locator;
  readonly pdfToolsLink: Locator;
  readonly heroHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo           = page.locator('a[href="/"]').first();
    this.startEditingBtn = page.getByRole('link', { name: /start editing/i }).first();
    this.pdfToolsLink   = page.getByRole('link', { name: /all tools/i }).first();
    this.heroHeading    = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto('/');
  }
}
