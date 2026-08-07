# Delirium Downloads

Static, staff-focused resource library for `deliriumdownloads.com`, prepared for
GitHub Pages.

The site provides 25 printable delirium clinical prompts, teaching resources,
service-improvement tools, and patient/family handouts for staff to use in
conversation. Every PDF has a paired editable Word template for reviewed local
adaptation. People seeking personal or family information are directed to
[Delirium Support](https://www.deliriumsupport.com/).

## Editorial status

Version 0.9 is a preview collection. Every clinical PDF is explicitly marked as
awaiting final named human clinical review before use in patient care.

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

## Publication gate

The preview remains `noindex` and `robots.txt` disallows crawling. Do not remove
that gate until a named appropriately qualified clinician has reviewed the
whole collection and the reviewer, approval date and next review date have been
recorded. After approval, update the version/date consistently in the site,
PDFs and Word templates before enabling indexing.
