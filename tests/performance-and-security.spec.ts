/**
 * tests/performance-and-security.spec.ts
 *
 * Non-functional tests: performance baselines & security headers.
 *
 * Covers:
 *  ✅ Page loads within an acceptable time
 *  ✅ HTTPS is enforced
 *  ✅ Response has security headers
 *  ✅ No mixed content warnings
 */

import { test, expect } from '@playwright/test';
import { URLS } from './utils/constants';

// ─── 1. Performance ──────────────────────────────────────────────────────────
test.describe('Performance — page load time', () => {

  test('home page should load in under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(URLS.home, { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('/pdf-tools should load in under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(URLS.pdfTools, { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('/edit-pdf should load in under 6 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(URLS.editPdf, { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(6000);
  });

});

// ─── 2. HTTPS ────────────────────────────────────────────────────────────────
test.describe('Security — HTTPS enforcement', () => {

  test('home page URL should start with https', async ({ page }) => {
    await page.goto(URLS.home);
    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('/pdf-tools URL should be served over https', async ({ page }) => {
    await page.goto(URLS.pdfTools);
    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('http:// request should redirect to https://', async ({ page }) => {
    // Try the http version — it should redirect to https
    const httpUrl = URLS.home.replace('https://', 'http://');
    const response = await page.goto(httpUrl);
    // After redirect, the final URL should be https
    expect(page.url()).toMatch(/^https:\/\//);
  });

});

// ─── 3. Security headers ─────────────────────────────────────────────────────
test.describe('Security — HTTP response headers', () => {

  test('/pdf-tools response should include Content-Type header', async ({ page }) => {
    const response = await page.goto(URLS.pdfTools);
    const contentType = response?.headers()['content-type'];
    expect(contentType).toBeTruthy();
    expect(contentType).toContain('text/html');
  });

  test('response should not expose server version in headers', async ({ page }) => {
  const response = await page.goto(URLS.pdfTools);
  const serverHeader = response?.headers()['server'] ?? '';
  expect.soft(
    serverHeader,
    `Server header exposes version: "${serverHeader}"`
  ).not.toMatch(/\d+\.\d+\.\d+/);
});

});

// ─── 4. No mixed content ─────────────────────────────────────────────────────
test.describe('Security — mixed content', () => {

  test('/pdf-tools should not load any http:// resources', async ({ page }) => {
    const mixedContent: string[] = [];

    page.on('request', req => {
      if (req.url().startsWith('http://') && !req.url().startsWith('http://localhost')) {
        mixedContent.push(req.url());
      }
    });

    await page.goto(URLS.pdfTools);
    expect(mixedContent).toHaveLength(0);
  });

});
