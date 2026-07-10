/**
 * tests/edit-pdf.spec.ts
 *
 * Tests for: https://onlinepdfedits.com/edit-pdf
 *
 * Covers:
 *  ✅ Page loads correctly
 *  ✅ File upload area is visible
 *  ✅ Upload input accepts PDF file type
 *  ✅ Toolbar capabilities are described on the page
 */

import { test, expect } from '@playwright/test';
import { URLS } from './utils/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(URLS.editPdf);
});

// ─── 1. Page Load ────────────────────────────────────────────────────────────
test.describe('Edit PDF page — page load', () => {

  test('should load /edit-pdf at correct URL', async ({ page }) => {
    await expect(page).toHaveURL(URLS.editPdf);
  });

  test('should have a page title mentioning "Edit PDF"', async ({ page }) => {
    await expect(page).toHaveTitle(/edit pdf/i);
  });

  test('page should be fully loaded', async ({ page }) => {
    const state = await page.evaluate(() => document.readyState);
    expect(state).toBe('complete');
  });

});

// ─── 2. Upload Area ───────────────────────────────────────────────────────────
test.describe('Edit PDF page — file upload area', () => {

  test('file upload input should exist on the page', async ({ page }) => {
    // Most PDF tools render a hidden <input type="file">
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1);
  });

  test('file input should accept PDF files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const acceptAttr = await fileInput.getAttribute('accept');
    // Should accept .pdf or application/pdf
    expect(acceptAttr).toMatch(/pdf/i);
  });

  test('upload area / drop zone should be visible', async ({ page }) => {
    // Drop zone is usually a button or div labelled with "upload" / "choose file"
    const dropZone = page.getByText(/upload|choose|drag|drop/i).first();
    await expect(dropZone).toBeVisible();
  });

});

// ─── 3. Toolbar features described on page ───────────────────────────────────
test.describe('Edit PDF page — described capabilities', () => {

  const capabilities = [
    'text',
    'image',
    'signature',
  ];

  for (const cap of capabilities) {
    test(`page should mention "${cap}" as an editable element`, async ({ page }) => {
      const body = await page.locator('body').innerText();
      expect(body.toLowerCase()).toContain(cap);
    });
  }

});

// ─── 4. No signup / free messaging ───────────────────────────────────────────
test.describe('Edit PDF page — trust messaging', () => {

  test('should mention "free" somewhere on the page', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toContain('free');
  });

  test('should not require any login to see the upload area', async ({ page }) => {
    // If the tool is truly free with no signup, the upload input should be
    // present without any auth-gate
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveCount(1);
  });

});
