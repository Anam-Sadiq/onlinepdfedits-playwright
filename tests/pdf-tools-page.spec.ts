/**
 * tests/pdf-tools-page.spec.ts
 *
 * Tests for: https://onlinepdfedits.com/pdf-tools
 *
 * Covers:
 *  ✅ Page loads correctly
 *  ✅ Title & headings are visible
 *  ✅ All 7 tool links exist
 *  ✅ Quick-finder section works
 *  ✅ Navigation bar links work
 */

import { test, expect } from '@playwright/test';
import { PdfToolsPage } from './pages/PdfToolsPage';
import { URLS, TOOL_NAMES } from './utils/constants';

// ─── Setup: runs before every test in this file ─────────────────────────────
test.beforeEach(async ({ page }) => {
  const toolsPage = new PdfToolsPage(page);
  await toolsPage.goto();
});

// ─── 1. Page Load ────────────────────────────────────────────────────────────
test.describe('PDF Tools page — page load', () => {

  test('should load /pdf-tools with correct URL', async ({ page }) => {
    await expect(page).toHaveURL(URLS.pdfTools);
  });

  test('should have the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/PDF Tools We Currently Offer/i);
  });

  test('should display the main H1 heading', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.mainHeading).toBeVisible();
  });

  test('should display the "Start from your task" section heading', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.quickFinderHeading).toBeVisible();
  });

  test('page should not have any console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    // We allow known 3rd-party errors, but flag any main domain errors
    expect(errors.filter(e => e.includes('onlinepdfedits.com'))).toHaveLength(0);
  });

});

// ─── 2. Navigation Bar ───────────────────────────────────────────────────────
test.describe('PDF Tools page — navigation bar', () => {

  test('navbar should have a Home link', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.homeNavLink).toBeVisible();
  });

  test('navbar Home link should navigate to /', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.homeNavLink.click();
    await expect(page).toHaveURL(URLS.home);
  });

  test('navbar should have a Security link', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.securityNavLink).toBeVisible();
  });

  test('navbar Security link should navigate to /security', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.securityNavLink.click();
    await expect(page).toHaveURL(URLS.security);
  });

  test('navbar should have a Blog link', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.blogNavLink).toBeVisible();
  });

  test('"Start Editing" button should be visible in the navbar', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.startEditingBtn).toBeVisible();
  });

  test('"Start Editing" button should navigate to /edit-pdf', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.startEditingBtn.click();
    await expect(page).toHaveURL(URLS.editPdf);
  });

});

// ─── 3. Quick Finder Section ─────────────────────────────────────────────────
test.describe('PDF Tools page — quick finder links', () => {

  test('"I need to edit text or images" link goes to /edit-pdf', async ({ page }) => {
    await page.getByText(/I need to edit text or images/i).click();
    await expect(page).toHaveURL(URLS.editPdf);
  });

  test('"I need to remove or keep certain pages" link goes to /extract-pages', async ({ page }) => {
    await page.getByText(/I need to remove or keep certain pages/i).click();
    await expect(page).toHaveURL(new RegExp('extract-pages|delete-pdf-pages'));
  });

  test('"I need to combine multiple PDFs" link goes to /merge-pdf', async ({ page }) => {
    await page.getByText(/I need to combine multiple PDFs/i).click();
    await expect(page).toHaveURL(URLS.mergePdf);
  });

  test('"I need to turn images into one PDF" link goes to /images-to-pdf', async ({ page }) => {
    await page.getByText(/I need to turn images into one PDF/i).click();
    await expect(page).toHaveURL(URLS.imagesToPdf);
  });

});

// ─── 4. Tool Cards — visibility ──────────────────────────────────────────────
test.describe('PDF Tools page — tool cards', () => {

  test('Edit PDF card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.editPdfLink).toBeVisible();
  });

  test('Compress PDF card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.compressPdfLink).toBeVisible();
  });

  test('Merge PDF card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.mergePdfLink).toBeVisible();
  });

  test('Extract Pages card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.extractPagesLink).toBeVisible();
  });

  test('Delete PDF Pages card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.deletePagesLink).toBeVisible();
  });

  test('Images to PDF card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.imagesToPdfLink).toBeVisible();
  });

  test('Protect PDF card should be visible', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.encryptPdfLink).toBeVisible();
  });

});

// ─── 5. Tool Cards — navigation ──────────────────────────────────────────────
test.describe('PDF Tools page — tool card navigation', () => {

  test('clicking Edit PDF opens /edit-pdf', async ({ page }) => {
  const toolsPage = new PdfToolsPage(page);
  await Promise.all([
    page.waitForURL('**/edit-pdf', { timeout: 15_000 }),
    toolsPage.editPdfLink.click(),
  ]);
  await expect(page).toHaveURL(URLS.editPdf);
});

test('clicking Compress PDF opens /compress-pdf', async ({ page }) => {
  const toolsPage = new PdfToolsPage(page);
  await Promise.all([
    page.waitForURL('**/compress-pdf', { timeout: 15_000 }),
    toolsPage.compressPdfLink.click(),
  ]);
  await expect(page).toHaveURL(URLS.compressPdf);
});

test('clicking Merge PDF opens /merge-pdf', async ({ page }) => {
  const toolsPage = new PdfToolsPage(page);
  await Promise.all([
    page.waitForURL('**/merge-pdf', { timeout: 15_000 }),
    toolsPage.mergePdfLink.click(),
  ]);
  await expect(page).toHaveURL(URLS.mergePdf);
});
  test('clicking Extract Pages opens /extract-pages', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.extractPagesLink.click();
    await expect(page).toHaveURL(URLS.extractPages);
  });

  test('clicking Delete PDF Pages opens /delete-pdf-pages', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.deletePagesLink.click();
    await expect(page).toHaveURL(URLS.deletePages);
  });

  test('clicking Images to PDF opens /images-to-pdf', async ({ page }) => {
    const toolsPage = new PdfToolsPage(page);
    await toolsPage.imagesToPdfLink.click();
    await expect(page).toHaveURL(URLS.imagesToPdf);
  });

});

// ─── 6. SEO & Meta ───────────────────────────────────────────────────────────
test.describe('PDF Tools page — SEO and meta tags', () => {

  test('page should have a meta description', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });

  test('meta description should mention PDF tools', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content?.toLowerCase()).toContain('pdf');
  });

  test('page should have an Open Graph title', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

});

// ─── 7. Footer Links ─────────────────────────────────────────────────────────
test.describe('PDF Tools page — footer', () => {

  test('footer Privacy Policy link should be visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /privacy policy/i });
    await expect(link).toBeVisible();
  });

  test('footer Privacy Policy link should navigate correctly', async ({ page }) => {
    await page.getByRole('link', { name: /privacy policy/i }).click();
    await expect(page).toHaveURL(URLS.privacy);
  });

  test('footer Terms link should be visible', async ({ page }) => {
    const link = page.getByRole('link', { name: /terms/i }).first();
    await expect(link).toBeVisible();
  });

  test('footer should display copyright text', async ({ page }) => {
    const footer = page.locator('footer, [class*="footer"]').first();
    await expect(footer).toContainText(/online pdf edits/i);
  });

});

// ─── 8. Responsive / Mobile ──────────────────────────────────────────────────
test.describe('PDF Tools page — mobile viewport', () => {

  test('page should load correctly on mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URLS.pdfTools);
    await expect(page).toHaveURL(URLS.pdfTools);
  });

  test('main heading should still be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URLS.pdfTools);
    const toolsPage = new PdfToolsPage(page);
    await expect(toolsPage.mainHeading).toBeVisible();
  });

});
