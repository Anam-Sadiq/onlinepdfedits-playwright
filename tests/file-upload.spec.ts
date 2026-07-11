/**
 * tests/file-upload.spec.ts
 *
 * Tests for file upload functionality across all tools that accept files.
 *
 * ⚠️  IMPORTANT:
 * These tests use real files from the test-data/ folder.
 * Before running, place these files there:
 *   - test-data/sample.pdf   ← any real PDF (1 page is fine)
 *   - test-data/sample.jpg   ← any JPG image
 *   - test-data/sample.txt   ← already included (plain text file)
 *
 * Tests auto-skip cleanly if the files are missing — won't break your run.
 */

import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { URLS } from './utils/constants';

// ── File paths ───────────────────────────────────────────────────────────────
const SAMPLE_PDF = path.join(__dirname, '..', 'test-data', 'sample.pdf');
const SAMPLE_JPG = path.join(__dirname, '..', 'test-data', 'sample.jpg');
const SAMPLE_TXT = path.join(__dirname, '..', 'test-data', 'sample.txt');

// ── Helper: upload a file to the first file input on the page ────────────────
//
// NOTE: these uploaders only wire up their file-input handler once the visible
// "Upload"/"Choose" trigger is clicked (the trigger calls the hidden input's
// .click() which opens a native file chooser). Setting files directly on the
// hidden <input> does NOT trigger the handler, so the editor never mounts.
// We drive the real flow: click the trigger, capture the file chooser, and set
// the file there. Falls back to a direct setInputFiles for plain inputs.
async function uploadFile(page: any, filePath: string): Promise<void> {
  const trigger = page
    .locator('button, [role="button"]')
    .filter({ hasText: /upload|choose|drag|drop|select|import|browse/i })
    .first();

  if (await trigger.count()) {
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 5_000 }).catch(() => null),
      trigger.click().catch(() => {}),
    ]);
    if (chooser) {
      await chooser.setFiles(filePath);
      await page.waitForLoadState('networkidle').catch(() => {});
      return;
    }
  }

  // Fallback: plain <input type="file"> whose handler is already attached.
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 10_000 });
  await fileInput.setInputFiles(filePath);
  await page.waitForLoadState('networkidle').catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. EDIT PDF — Upload
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Edit PDF (/edit-pdf)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.editPdf, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist and accept PDF files', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
    const accept = await input.getAttribute('accept');
    expect(accept).toMatch(/pdf/i);
  });

  test('upload drop-zone should be visible before upload', async ({ page }) => {
    const dropZone = page.getByText(/upload|drag|drop|choose/i).first();
    await expect(dropZone).toBeVisible();
  });

  test('page should mention the 10MB upload limit', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/10\s*mb/i);
  });

  test('page should mention the 50 page limit', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/50\s*page/i);
  });

  test('should accept a valid PDF file via input', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_PDF), 'sample.pdf not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_PDF);

    // After upload: editor canvas / toolbar should appear
    const editorLoaded = page.locator(
      '[class*="editor"], [class*="canvas"], [class*="toolbar"], [class*="viewer"]'
    ).first();

    await expect(editorLoaded).toBeVisible({ timeout: 20_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 2. COMPRESS PDF — Upload
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Compress PDF (/compress-pdf)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.compressPdf, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist on compress page', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
  });

  test('upload area should be visible on compress page', async ({ page }) => {
    const dropZone = page.getByText(/upload|drag|drop|choose/i).first();
    await expect(dropZone).toBeVisible();
  });

  test('should accept a valid PDF file on compress page', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_PDF), 'sample.pdf not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_PDF);

    // After upload: compression controls / preview should appear
    const postUpload = page.locator(
      '[class*="compress"], [class*="preview"], [class*="slider"], [class*="quality"], [class*="result"]'
    ).first();

    await expect(postUpload).toBeVisible({ timeout: 20_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 3. MERGE PDF — Upload (supports multiple files)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Merge PDF (/merge-pdf)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.mergePdf, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist on merge page', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
  });

  test('merge page should allow multiple file selection', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    const multiple = await input.getAttribute('multiple');
    // multiple="" or multiple="multiple" — both are valid
    expect(multiple).not.toBeNull();
  });

  test('should accept a PDF on the merge page', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_PDF), 'sample.pdf not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_PDF);

    // Should show a file list or merge queue
    const fileList = page.locator(
      '[class*="file-list"], [class*="merge"], [class*="queue"], [class*="list"]'
    ).first();

    await expect(fileList).toBeVisible({ timeout: 20_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXTRACT PAGES — Upload
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Extract Pages (/extract-pages)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.extractPages, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist on extract pages', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
  });

  test('should accept a valid PDF file on extract page', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_PDF), 'sample.pdf not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_PDF);

    // Should show page thumbnails or a page selection UI
    const pageSelector = page.locator(
      '[class*="page"], [class*="thumbnail"], [class*="preview"], [class*="extract"]'
    ).first();

    await expect(pageSelector).toBeVisible({ timeout: 20_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 5. DELETE PDF PAGES — Upload
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Delete PDF Pages (/delete-pdf-pages)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.deletePages, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist on delete pages', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
  });

  test('should accept a valid PDF on delete pages', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_PDF), 'sample.pdf not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_PDF);

    const pageSelector = page.locator(
      '[class*="page"], [class*="thumbnail"], [class*="preview"], [class*="delete"]'
    ).first();

    await expect(pageSelector).toBeVisible({ timeout: 20_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 6. IMAGES TO PDF — Upload image files
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — Images to PDF (/images-to-pdf)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.imagesToPdf, { waitUntil: 'domcontentloaded' });
  });

  test('file input should exist on images-to-pdf page', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    await expect(input).toBeAttached();
  });

  test('file input should accept image types', async ({ page }) => {
    const input = page.locator('input[type="file"]').first();
    const accept = await input.getAttribute('accept');
    expect(accept).toMatch(/image|jpg|jpeg|png/i);
  });

  test('should accept a JPG image file', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_JPG), 'sample.jpg not found in test-data/ — add it to run this test');

    await uploadFile(page, SAMPLE_JPG);

    const preview = page.locator(
      '[class*="preview"], [class*="image"], [class*="thumbnail"], [class*="list"]'
    ).first();

    await expect(preview).toBeVisible({ timeout: 15_000 });
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// 7. WRONG FILE TYPE — should be rejected
// ─────────────────────────────────────────────────────────────────────────────
test.describe('File Upload — wrong file type rejection', () => {

  test('uploading a .txt file on /edit-pdf should not load the editor', async ({ page }) => {
    test.skip(!fs.existsSync(SAMPLE_TXT), 'sample.txt not found in test-data/');

    await page.goto(URLS.editPdf, { waitUntil: 'domcontentloaded' });
    await uploadFile(page, SAMPLE_TXT);

    // Give 5 seconds — editor should NOT appear for a .txt file
    const editorLoaded = page.locator(
      '[class*="editor"], [class*="canvas"], [class*="toolbar"]'
    ).first();

    const editorVisible = await editorLoaded.isVisible().catch(() => false);

    // Either the editor didn't load, OR an error message appeared — both are correct
    const errorMsg = page.getByText(/invalid|unsupported|only pdf|error/i).first();
    const errorVisible = await errorMsg.isVisible().catch(() => false);

    // At least ONE of these should be true: no editor loaded, OR error shown
    const correctBehaviour = !editorVisible || errorVisible;
    expect(correctBehaviour, 'Wrong file type: editor should not load or an error should appear').toBe(true);
  });

});