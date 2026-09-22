# Delirium Downloads

Static, staff-focused resource library for `deliriumdownloads.com`, prepared for
GitHub Pages.

Preview: <https://amaclullich.github.io/deliriumdownloads.com/>

The site provides 25 printable delirium clinical prompts, teaching resources,
service-improvement tools, and patient/family handouts for staff to use in
conversation. Every PDF has a paired editable Word template for reviewed local
adaptation. People seeking personal or family information are directed to
[Delirium Support](https://www.deliriumsupport.com/).

## Editorial status

Version 0.9 is a preview collection. Every clinical PDF is explicitly marked as
awaiting final named human clinical review before use in patient care.

The simulated item-by-item panel findings are recorded in
[`content/resource-review-matrix.md`](content/resource-review-matrix.md). The
patient/family PDFs use 12-point body text, and every paired Word alternative
uses semantic headings and passed the document accessibility audit. The PDFs
are not yet PDF/UA tagged; consider tagged PDFs or equivalent accessible HTML
before full public release.

## Local commands

```bash
npm install
npm run dev
npm run build
npm run build:static
npm test
```

Master copy is under `content/`; generation and visual-QA helpers are under
`scripts/`. PDFs and Word templates are mirrored to `public/downloads/`. The
complete GitHub Pages build is generated in `docs/`.

The live site is https://www.deliriumdownloads.com/ and is deployed through GitHub Pages from `docs/`.

## Public discovery status

On 5 September 2026 Professor Alasdair MacLullich instructed publication and inclusion in analytics, search platforms and Looker. The site now permits crawling and indexing and advertises its canonical sitemap.

This publication instruction does not itself document completion of the clinical review. Existing version 0.9 clinical-review notices and the PDF/Word resources are preserved without asserting a reviewer or approval date. Public search discovery and clinical approval are separate statuses.

Limited analytics is on by default under the existing measurement ID, relying on the UK statistical purposes exception (PECR as amended by the Data (Use and Access) Act 2025); a first-visit notice and the Analytics settings button let visitors turn it off, and a saved choice to turn it off is honoured. See the publication report for live verification and platform status.
