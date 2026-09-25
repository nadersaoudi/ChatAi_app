import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://localhost:3009", trace: "on-first-retry" },
  webServer: {
    command: "npm run dev -- --port 3009",
    port: 3009,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
