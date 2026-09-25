import { expect, test } from "@playwright/test";

/**
 * Authenticated-area specs — skipped without Clerk keys (CI provides them
 * via secrets; locally they come from .env.local / shell env).
 */
const hasKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
test.skip(!hasKeys, "needs Clerk publishable key");

test("signed-out dashboard redirects to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/sign-in/);
});

test("sign-in page renders the Clerk card", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByText(/codenix/i).first()).toBeVisible();
});
