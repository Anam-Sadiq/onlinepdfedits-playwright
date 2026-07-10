/**
 * tests/home-page.spec.ts
 *
 * Tests for the homepage: https://onlinepdfedits.com
 *
 * Covers:
 *  ✅ Page loads & title is correct
 *  ✅ Hero section visible
 *  ✅ CTA buttons visible and work
 *  ✅ Features/benefits section visible
 */

import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { URLS } from './utils/constants';

test.beforeEach(async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
});

// ─── 1. Page Load ────────────────────────────────────────────────────────────
test.describe('Home page — page load', () => {

  test('should load home page at correct URL', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(URLS.home));
  });

  test('should have a page title containing "PDF"', async ({ page }) => {
    await expect(page).toHaveTitle(/pdf/i);
  });

  test('page should be fully loaded (readyState = complete)', async ({ page }) => {
    const state = await page.evaluate(() => document.readyState);
    expect(state).toBe('complete');
  });

});

// ─── 2. Hero / CTA ───────────────────────────────────────────────────────────
test.describe('Home page — hero section', () => {

  test('"Start Editing" CTA button should be visible', async ({ page }) => {
  const ctaLinks = page.getByRole('link', { name: /start editing/i });
  const count = await ctaLinks.count();
  let anyVisible = false;
  for (let i = 0; i < count; i++) {
    if (await ctaLinks.nth(i).isVisible()) { anyVisible = true; break; }
  }
  expect(anyVisible, '"Start Editing" link should be visible').toBe(true);
});

test('"Start Editing" button should navigate to /edit-pdf', async ({ page }) => {
  const ctaLinks = page.getByRole('link', { name: /start editing/i });
  const count = await ctaLinks.count();
  let clicked = false;
  for (let i = 0; i < count; i++) {
    const link = ctaLinks.nth(i);
    if (await link.isVisible()) {
      await Promise.all([
        page.waitForURL('**/edit-pdf', { timeout: 15_000 }),
        link.click(),
      ]);
      clicked = true;
      break;
    }
  }
  expect(clicked, 'No visible "Start Editing" link found').toBe(true);
  await expect(page).toHaveURL(URLS.editPdf);
});

  test('main H1 heading should be visible', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.heroHeading).toBeVisible();
  });

});

// ─── 3. Key selling points ───────────────────────────────────────────────────
test.describe('Home page — trust signals', () => {

  test('page should mention "free" somewhere', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toContain('free');
  });

  test('page should mention "no signup" or similar', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toMatch(/no sign.?up|signup/i);
  });

  test('page should mention "secure" or "security"', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toMatch(/secur/i);
  });

});

// ─── 4. Responsive ───────────────────────────────────────────────────────────
test.describe('Home page — responsive layout', () => {

  test('should display correctly at 375px (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(URLS.home);
    const home = new HomePage(page);
    await expect(home.heroHeading).toBeVisible();
  });

 test('should display correctly at 1440px (Desktop wide)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(URLS.home, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const home = new HomePage(page);
  await expect(home.heroHeading).toBeVisible();
});

});
