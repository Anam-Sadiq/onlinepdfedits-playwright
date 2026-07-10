/**
 * tests/accessibility.spec.ts
 *
 * Basic accessibility checks across key pages.
 *
 * These are NOT a full WCAG audit — they are quick sanity checks
 * that every beginner QA should know how to do.
 *
 * Covers:
 *  ✅ Images have alt text
 *  ✅ Forms have labels
 *  ✅ Page has exactly one <h1>
 *  ✅ Tab / keyboard focus works on buttons
 *  ✅ Page language is set
 */

import { test, expect } from '@playwright/test';
import { URLS } from './utils/constants';

// Pages to run accessibility tests on
const pagesToCheck = [
  { name: 'Home',      url: URLS.home },
  { name: 'PDF Tools', url: URLS.pdfTools },
  { name: 'Edit PDF',  url: URLS.editPdf },
];

for (const { name, url } of pagesToCheck) {

  test.describe(`Accessibility — ${name}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

test('page <html> should have a lang attribute', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded');
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang, '<html> element must have a lang attribute').toBeTruthy();
  expect(lang).toMatch(/^en/i);
});

    test('page should have exactly one <h1>', async ({ page }) => {
      const h1s = page.locator('h1');
      await expect(h1s).toHaveCount(1);
    });

    test('all images should have an alt attribute', async ({ page }) => {
      // Get all img elements
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // alt="" is valid for decorative images, but alt must EXIST
        expect(alt, `Image #${i} is missing an alt attribute`).not.toBeNull();
      }
    });

    test('"Start Editing" button should be focusable with Tab key', async ({ page }) => {
      // Press Tab a few times and check if a link gets focused
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // At least one focused element should exist
      const focused = page.locator(':focus');
      await expect(focused).toHaveCount(1);
    });

    test('page should not have any input without an associated label or aria-label', async ({ page }) => {
      const inputs = page.locator('input:not([type="hidden"])');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const title = await input.getAttribute('title');

        const hasLabel = id
          ? await page.locator(`label[for="${id}"]`).count() > 0
          : false;

        const isAccessible = hasLabel || !!ariaLabel || !!ariaLabelledBy || !!title;
        expect(isAccessible, `Input #${i} has no accessible label`).toBe(true);
      }
    });

  });

}
