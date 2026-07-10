/**
 * utils/helpers.ts
 *
 * Reusable helper functions shared across test files.
 * Put anything you find yourself repeating in more than one test here.
 */

import { Page, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Wait for the page to be fully loaded (network idle).
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Check that the given URL is exactly what we expect.
 * Example: assertUrl(page, 'https://onlinepdfedits.com/pdf-tools')
 */
export async function assertUrl(page: Page, expectedUrl: string) {
  await expect(page).toHaveURL(expectedUrl);
}

/**
 * Check that the page title contains a given string (case-insensitive).
 */
export async function assertTitleContains(page: Page, text: string) {
  await expect(page).toHaveTitle(new RegExp(text, 'i'));
}

/**
 * Take a screenshot and save it to /screenshots folder.
 * Useful for visual debugging.
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join('screenshots', `${name}-${Date.now()}.png`),
    fullPage: true,
  });
}

/**
 * Return the path to a sample PDF fixture for upload tests.
 */
export function getSamplePdfPath(): string {
  return path.join(__dirname, '..', '..', 'test-data', 'sample.pdf');
}
