import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 📁 Where your test files live
  testDir: './tests',

  // ⏱️ Max time a single test can run before failing
  timeout: 30_000,

  // 🔁 Retry failed tests once (helpful for flaky network issues)
  retries: 1,

  // 🖥️ Run tests in parallel for speed
  fullyParallel: true,

  // 📊 Reporter: shows results in terminal + saves an HTML report
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // 🌐 Your base URL — all tests use this
    baseURL: 'https://onlinepdfedits.com',

    // 📸 Take a screenshot only when a test fails
    screenshot: 'only-on-failure',

    // 🎥 Record video only when a test fails
    video: 'retain-on-failure',

    // 🐢 Slow down actions slightly so you can follow along (remove in CI)
    // actionDelay: 500,

    // 🔍 Trace: records steps for debugging failures
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
