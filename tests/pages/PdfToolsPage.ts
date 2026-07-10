/**
 * pages/PdfToolsPage.ts
 *
 * Page Object Model (POM) for /pdf-tools
 *
 * What is a Page Object?
 * Instead of writing selectors directly in every test, we put them here.
 * Tests stay clean; if the page changes, you only update ONE file.
 */

import { Page, Locator } from '@playwright/test';

export class PdfToolsPage {
  readonly page: Page;

  // ── Navigation links ────────────────────────────────────────────────
  readonly editPdfLink: Locator;
  readonly mergePdfLink: Locator;
  readonly compressPdfLink: Locator;
  readonly extractPagesLink: Locator;
  readonly deletePagesLink: Locator;
  readonly imagesToPdfLink: Locator;
  readonly encryptPdfLink: Locator;

  // ── Header / nav bar ────────────────────────────────────────────────
  readonly startEditingBtn: Locator;
  readonly homeNavLink: Locator;
  readonly securityNavLink: Locator;
  readonly blogNavLink: Locator;

  // ── Page headings ────────────────────────────────────────────────────
  readonly mainHeading: Locator;
  readonly toolWorkflowsHeading: Locator;
  readonly quickFinderHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.editPdfLink       = page.getByRole('link', { name: /edit pdf/i }).first();
    this.mergePdfLink      = page.getByRole('link', { name: /merge pdf/i }).first();
    this.compressPdfLink   = page.getByRole('link', { name: /compress pdf/i }).first();
    this.extractPagesLink  = page.getByRole('link', { name: /extract pages/i }).first();
    this.deletePagesLink   = page.getByRole('link', { name: /delete pdf pages/i }).first();
    this.imagesToPdfLink   = page.getByRole('link', { name: /images to pdf/i }).first();
    this.encryptPdfLink    = page.getByRole('link', { name: /protect pdf/i }).first();

    this.startEditingBtn   = page.getByRole('link', { name: /start editing/i }).first();
    this.homeNavLink       = page.getByRole('link', { name: 'Home' }).first();
    this.securityNavLink   = page.getByRole('link', { name: /security/i }).first();
    this.blogNavLink       = page.getByRole('link', { name: /blog/i }).first();

    this.mainHeading         = page.getByRole('heading', { name: /choose the right pdf tool/i });
    this.toolWorkflowsHeading = page.getByRole('heading', { name: /tool workflows/i });
    this.quickFinderHeading  = page.getByRole('heading', { name: /start from your task/i });
  }

  /** Navigate directly to /pdf-tools */
  async goto() {
    await this.page.goto('/pdf-tools');
  }

  /** Returns the page <title> text */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
