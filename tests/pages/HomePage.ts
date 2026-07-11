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
    // The hero CTA used to read "Start editing"; it now renders as
    // `<a href="/edit-pdf" aria-label="Edit a PDF online — open the editor">Edit PDF</a>`.
    // Match by the destination + the visible/aria text so the locator survives
    // either wording (and survives a <button> rewrite too).
    this.startEditingBtn = page
      .locator('a[href="/edit-pdf"], button')
      .filter({ hasText: /start editing|edit (a )?pdf/i })
      .first();
    this.pdfToolsLink   = page.getByRole('link', { name: /all tools/i }).first();
    this.heroHeading    = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto('/');
  }
}
