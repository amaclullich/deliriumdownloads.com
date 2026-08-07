# Delirium Downloads editorial and release report

**Version:** 0.9 preview  
**Prepared:** 7 August 2026  
**Release status:** Not approved for patient care or search indexing

## Audience and product decision

DeliriumDownloads.com is a staff-first download library. Clinical practice,
manager, teaching and service-improvement resources appear before patient and
family handouts. Patient and family sheets are described as materials for staff
to select, explain and give; people seeking direct support are routed to
DeliriumSupport.com.

The launch set contains 25 one-page PDFs and 25 paired editable Word templates.
No video, audio, quiz video or video poster is included.

## Source and writing controls

- The AI Writing system validator passed before content production: 266
  registered resources, 265 of 265 locked resources verified, and all routing,
  report and quality tests passed.
- Book 4 supplied useful topic architecture but was not treated as publishable
  evidence because its claim registers were marked unverified and some chapters
  contained author, dose, legal or local-policy placeholders.
- Book 1 and Delirium Words drafts informed audience needs and topic selection;
  new public copy was checked against the official sources listed on each sheet.
- The main clinical source set is NICE CG103, SIGN 157/Right Decisions, NHS,
  NHS Inform, MHRA medicine-safety advice and the official 4AT site.
- No medicine dose, fixed investigation panel or claim of individual diagnosis
  is provided.

## Simulated multidisciplinary panel

A structured simulated review was carried out from the perspectives of an acute
physician, geriatrician, ward nurse, allied health professional, service manager
and medical student. This was an AI-assisted editorial stress test, not an
external human clinical review.

Changes made after that review included:

- staff-first ordering and clearer patient/family routing;
- a dedicated, supervised medical-student pathway with learning outcomes and a
  hypoactive-delirium case;
- five additional sheets covering multidomain treatment, hypoactive delirium,
  medicines, allied health/function/recovery, and community/care-home response;
- stronger wording on named action owners, review times, discharge follow-up,
  restrictive interventions, medicine review and current MHRA haloperidol
  cautions;
- explicit 4AT-development interest disclosure and correction route;
- paired Word local-adaptation templates with prominent approval fields;
- a visible preview banner, `noindex`, `nofollow`, `noarchive` and a site-wide
  `robots.txt` block pending named human approval.

## Visual-material decision

The Social Media Hub was audited for visuals. The PDFs use a restrained vector
line-icon system adapted from the project's original code-built graphics. The
source and rights decision is recorded in `content/visual-provenance.md`.
Screenshots, memes, untracked classical art, held video frames, Napkin outputs,
AI hospital scenes and unverified/cropped 4AT graphics were excluded.

## Technical and accessibility checks

- All 25 PDFs render to exactly one A4 page; every page was visually inspected
  at contact-sheet level, with detailed inspection of dense and public-facing
  examples.
- All 25 Word templates render to two pages; all 50 pages were visually
  inspected. The document accessibility audit reports zero high-, medium- or
  low-severity findings for every file.
- The static export contains all 25 PDF/Word pairs, the current stylesheet,
  search/filter script, custom-domain file and `.nojekyll` marker.
- Build, lint and automated catalogue/download tests pass.
- The GitHub Pages deployment passed on commit `4026f25`; the live preview,
  stylesheet and catalogue script return HTTP 200, and all 25 PDF plus all 25
  Word download routes were checked successfully.
- `www.deliriumdownloads.com` still resolves to Porkbun parking records. The
  working review address is therefore the GitHub Pages project URL until the
  registrar DNS is changed and the custom domain is added in GitHub Pages.
- The in-app browser could not provide a final screenshot because its
  admin-enforced security policy could not be verified. That control was not
  bypassed. Static HTTP responses and document assets were verified directly.

## Human publication gate

Before public clinical release, record:

- named clinical reviewer and role;
- scope of the review;
- approval date and next review date;
- any required local or jurisdiction-specific changes;
- confirmation that urgent-care, medicines, restrictive-intervention and
  discharge wording remains current;
- confirmation that the site, all PDFs and all Word templates carry the same
  approved version and date.

Only then should the preview banner and noindex controls be removed.
