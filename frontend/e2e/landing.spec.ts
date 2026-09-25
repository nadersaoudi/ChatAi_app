import { expect, test } from "@playwright/test";

/**
 * Landing page — no Clerk keys needed (marketing group ships zero auth JS).
 */
test("hero renders with CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /AI assistant for/i })
  ).toBeVisible();
  const cta = page.getByRole("link", { name: /start chatting free/i }).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/dashboard");
});

test("theme toggle flips the dark class and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.getByTitle(/switch to light mode/i).click();
  await expect(html).not.toHaveClass(/dark/);
  await expect
    .poll(async () =>
      page.evaluate(() => localStorage.getItem("codenix-theme"))
    )
    .toBe("light");
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("FAQ accordion expands", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Is it free to use?").click();
  await expect(page.getByText(/sign in and start chatting/i)).toBeVisible();
});

test("features grid renders all six cards", async ({ page }) => {
  await page.goto("/");
  for (const title of [
    "Smart conversations",
    "Code assistant",
    "Chat with your PDFs",
    "Blazing fast",
    "History that sticks",
    "Private by design",
  ]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});
