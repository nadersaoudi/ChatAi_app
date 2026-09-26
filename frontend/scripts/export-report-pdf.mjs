/**
 * Export docs/rapport-codenix.html (mermaid rendered) to docs/Rapport-Codenix.pdf.
 * Run: npm run report:pdf   (needs playwright chromium: npx playwright install chromium)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const html = path.join(root, "docs", "rapport-codenix.html");
const out = path.join(root, "docs", "Rapport-Codenix.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("file:///" + html.replace(/\\/g, "/"));
await page.waitForFunction(
  () => document.querySelectorAll('.mermaid[data-processed="true"]').length >= 10,
  null,
  { timeout: 90000 }
);
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "16mm", left: "13mm", right: "13mm" },
});
await browser.close();
console.log("PDF exported to", out);
