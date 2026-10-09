// Render design/meet-our-ceo.html to PNG for each format.
// Usage: node scripts/render.mjs
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Playwright may be installed globally; resolve it through NODE_PATH as well as locally.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page_url = pathToFileURL(path.join(root, "design/meet-our-ceo.html")).href;
const outDir = path.join(root, "exports");
fs.mkdirSync(outDir, { recursive: true });

const formats = [
  { name: "story", width: 1080, height: 1920 },
  { name: "feed", width: 1080, height: 1350 },
];

const browser = await chromium.launch();
for (const f of formats) {
  const page = await browser.newPage({ viewport: { width: f.width, height: f.height } });
  await page.goto(`${page_url}?format=${f.name}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [document.fonts.check('900 100px Fraunces'), document.fonts.check('700 30px Inter')]);
  const out = path.join(outDir, `meet-our-ceo-${f.name}-${f.width}x${f.height}.png`);
  await page.locator(".post").screenshot({ path: out });
  console.log("rendered", out, "fonts", loaded);
  await page.close();
}
await browser.close();
