// Render the Meet the Team story, the FAQ story set, highlight covers and the Pink October logo.
// Usage: NODE_PATH=$(npm root -g) node scripts/render-stories.mjs
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Playwright may be installed globally; resolve it through NODE_PATH as well as locally.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = (file, query) => pathToFileURL(path.join(root, "design", file)).href + query;

const stories = ["team", "faq-cover", "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "cover-team", "cover-faq"];
const outName = {
  "team": "stories/meet-the-team-1080x1920.png",
  "faq-cover": "stories/faq-00-cover-1080x1920.png",
  "faq-1": "stories/faq-01-websites-brand-kits-1080x1920.png",
  "faq-2": "stories/faq-02-bundles-getting-started-1080x1920.png",
  "faq-3": "stories/faq-03-learn-with-us-1080x1920.png",
  "faq-4": "stories/faq-04-mentorship-suppliers-1080x1920.png",
  "faq-5": "stories/faq-05-good-to-know-1080x1920.png",
  "cover-team": "highlight-covers/highlight-cover-team-1080x1920.png",
  "cover-faq": "highlight-covers/highlight-cover-faq-1080x1920.png",
};

const jobs = [
  ...stories.map((s) => ({ src: url("stories.html", `?slide=${s}`), out: outName[s], w: 1080, h: 1920, sel: ".post" })),
  { src: url("logo-pink-october.html", ""), out: "logo/ha-badge-pink-october-transparent-1080.png", w: 1080, h: 1080, sel: "#logo", transparent: true },
  { src: url("logo-pink-october.html", "?bg=profile"), out: "logo/ha-badge-pink-october-profile-1080.png", w: 1080, h: 1080, sel: "body" },
];

const problems = [];
const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h } });
  await page.goto(j.src, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (j.src.includes("stories.html")) await page.waitForSelector("body[data-ready]");
  // Fail loudly if FAQ threads run into the bottom button.
  const clash = await page.evaluate(() => {
    const t = document.querySelector(".threads:not(.cover-qs)"), b = document.querySelector(".button");
    return t && b ? Math.round(t.getBoundingClientRect().bottom - b.getBoundingClientRect().top) : null;
  });
  if (clash !== null && clash > -24) problems.push(`${j.out}: threads overlap the button by ${clash + 24}px`);
  const out = path.join(root, "exports", j.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.locator(j.sel).screenshot({ path: out, omitBackground: !!j.transparent });
  console.log("rendered", path.relative(root, out));
  await page.close();
}
await browser.close();
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
