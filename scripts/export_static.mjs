#!/usr/bin/env node

import { cp, mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";


const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", "server", "index.js");
const outputDir = path.join(root, "docs");

if (path.basename(outputDir) !== "docs" || path.dirname(outputDir) !== root) {
  throw new Error(`Refusing to replace unexpected export path: ${outputDir}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });

const moduleUrl = pathToFileURL(serverEntry);
moduleUrl.searchParams.set("static-export", Date.now().toString());
const { default: worker } = await import(moduleUrl.href);
const response = await worker.fetch(
  new Request("https://www.deliriumdownloads.com/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`Static render failed with ${response.status}`);
}

const html = (await response.text()).replaceAll("/_next/", "./_next/");
if (!html.includes("Delirium resources,") || !html.includes("resource-card")) {
  throw new Error("Static render did not contain the expected resource catalogue");
}

if (/(?:href|src)="\/(?:_next|downloads|catalogue)/.test(html)) {
  throw new Error("Static export contains a root-relative asset or download path");
}

await writeFile(path.join(outputDir, "index.html"), html, "utf8");
await writeFile(path.join(outputDir, "404.html"), html, "utf8");
await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");
await writeFile(path.join(outputDir, "CNAME"), "www.deliriumdownloads.com\n", "utf8");

for (const disposable of [".assetsignore", "_headers", "vinext-client-entry-manifest.json"]) {
  await unlink(path.join(outputDir, disposable)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}

const robots = await readFile(path.join(outputDir, "robots.txt"), "utf8");
if (/Disallow:\s*\//.test(robots) || /noindex/i.test(html) || !robots.includes("Sitemap: https://www.deliriumdownloads.com/sitemap.xml")) {
  throw new Error("Public export must permit indexing and advertise the canonical sitemap");
}

console.log(`Static GitHub Pages export written to ${outputDir}`);
