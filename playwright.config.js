import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.js/,
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    channel: 'chrome',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
});
