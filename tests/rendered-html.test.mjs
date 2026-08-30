import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("https://www.deliriumdownloads.com/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete staff-focused resource desk", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /Delirium Downloads \| Practical resources for health and care staff/);
  assert.match(html, /For health, care and teaching staff/);
  assert.match(html, /This library is designed for staff/);
  assert.match(html, /Medical students · start here/);
  assert.match(html, /Hypoactive delirium: the quiet change/);
  assert.match(html, /editable Word alternatives/i);
  assert.match(html, /https:\/\/www\.deliriumsupport\.com\//);
  assert.match(html, /HUMAN CLINICAL REVIEW PENDING|human clinical release review is required/i);
  assert.match(html, /New, sudden confusion needs urgent assessment/i);
  assert.match(html, /call 999 or go to A&amp;E for new sudden confusion/i);
  assert.match(html, /MedicalWebPage/);
  assert.match(html, /https:\/\/orcid\.org\/0000-0003-3159-9370/);
  assert.match(html, /edwebprofiles\.ed\.ac\.uk\/profile\/alasdair-maclullich/);
  assert.match(html, /Who, how and why/);
  assert.match(html, /AI assistance/i);
  assert.match(html, /noindex/i);
  assert.equal((html.match(/class="resource-card/g) ?? []).length, 25);
  assert.ok(
    html.indexOf("Recognising delirium at the bedside") < html.indexOf("What is delirium?"),
    "staff resources should appear before patient and family handouts",
  );
  assert.doesNotMatch(html, /video modules|<video|\.mp4/i);
  assert.doesNotMatch(html, /react-loading-skeleton|codex-preview|Your site is taking shape/);
});

test("ships every listed PDF, paired Word template and the public metadata files", async () => {
  const downloads = new URL("../public/downloads/", import.meta.url);
  const pdfs = (await readdir(downloads)).filter((name) => name.endsWith(".pdf"));
  const docs = (await readdir(downloads)).filter((name) => name.endsWith(".docx"));
  assert.equal(pdfs.length, 25);
  assert.equal(docs.length, 25);
  for (const name of pdfs) {
    const bytes = await readFile(new URL(name, downloads));
    assert.ok(bytes.length > 10_000, `${name} should be a substantive PDF`);
    assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
  }
  for (const name of docs) {
    const bytes = await readFile(new URL(name, downloads));
    assert.ok(bytes.length > 15_000, `${name} should be a substantive Word template`);
    assert.equal(bytes.subarray(0, 2).toString(), "PK");
    assert.ok(pdfs.includes(name.replace(/\.docx$/, ".pdf")), `${name} should have a matching PDF`);
  }
  await Promise.all([
    access(new URL("../public/robots.txt", import.meta.url)),
    access(new URL("../public/sitemap.xml", import.meta.url)),
    access(new URL("../public/og-delirium-downloads.png", import.meta.url)),
    access(new URL("../public/catalogue.js", import.meta.url)),
    access(new URL("../public/analytics-consent.js", import.meta.url)),
    access(new URL("../public/google741ed80861af856e.html", import.meta.url)),
  ]);

  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const catalogue = await readFile(new URL("../app/catalogue.ts", import.meta.url), "utf8");
  const catalogueScript = await readFile(new URL("../public/catalogue.js", import.meta.url), "utf8");
  const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const pdf of pdfs) {
    const slug = pdf.replace(/\.pdf$/, "");
    assert.match(`${page}\n${catalogue}`, new RegExp(slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const familySources = await readFile(new URL("../content/family-sheets.md", import.meta.url), "utf8");
  assert.match(robots, /Disallow:\s*\//);
  assert.doesNotMatch(familySources, /www\.sign\.ac\.uk\/assets\/sign157\.pdf/);
  assert.match(familySources, /rightdecisions\.scot\.nhs\.uk\/media\/1728\/sign-guidelines-delirium\.pdf/);
  assert.match(catalogue, /slug: "after-delirium"[\s\S]*?audience: "families"/);
  assert.match(catalogueScript, /card\.dataset\.search.*card\.dataset\.audience/);
  assert.match(catalogueScript, /search\.value = "";\s*button\.click\(\)/);
  assert.doesNotMatch(globalCss, /site-header nav a:nth-child/);
});

test("does not retain disposable starter UI", async () => {
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("keeps Analytics consent-gated and uses the Downloads measurement ID", async () => {
  const component = await readFile(new URL("../app/analytics-consent.tsx", import.meta.url), "utf8");
  const source = await readFile(new URL("../public/analytics-consent.js", import.meta.url), "utf8");
  const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
  assert.match(source, /G-5HYLTS8YFT/);
  assert.match(source, /analytics_storage:\s*"denied"/);
  assert.match(source, /ad_storage:\s*"denied"/);
  assert.match(source, /allow_google_signals:\s*false/);
  assert.match(source, /document\.createElement\("script"\)/);
  assert.match(source, /dataLayer\.push\(arguments\)/);
  assert.doesNotMatch(source, /dataLayer\.push\(args\)/);
  assert.match(component, /id="analytics-consent"/);
  assert.match(component, /<script src="\.\/analytics-consent\.js" defer/);
  assert.match(html, /<section[^>]+class="analytics-consent"[^>]+hidden/);
  assert.match(html, /<section[^>]+id="analytics-consent"/);
  assert.match(html, /<script src="\.\/analytics-consent\.js" defer/);
  assert.doesNotMatch(html, /<script[^>]+googletagmanager\.com/i);
});

test("exports a complete noindex GitHub Pages build", async () => {
  const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
  assert.equal((html.match(/class="resource-card/g) ?? []).length, 25);
  assert.match(html, /meta name="robots" content="noindex, nofollow, noarchive"/);
  assert.doesNotMatch(html, /<video|\.mp4/i);
  assert.doesNotMatch(html, /(?:href|src)="\/(?:_next|downloads|catalogue)/);
  assert.doesNotMatch(html, /\\"href\\":\\"\/downloads\//);
  assert.equal(
    (await readFile(new URL("../docs/CNAME", import.meta.url), "utf8")).trim(),
    "www.deliriumdownloads.com",
  );
  await Promise.all([
    access(new URL("../docs/.nojekyll", import.meta.url)),
    access(new URL("../docs/downloads/medicines-and-delirium.pdf", import.meta.url)),
    access(new URL("../docs/downloads/medicines-and-delirium.docx", import.meta.url)),
    access(new URL("../docs/google741ed80861af856e.html", import.meta.url)),
  ]);
});
