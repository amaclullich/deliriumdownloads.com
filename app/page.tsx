import { resources } from "./catalogue";

const filters = [
  ["all", "All staff resources"],
  ["families", "Patient & family handouts"],
  ["clinical", "Clinical practice"],
  ["students", "Medical students"],
  ["managers", "Managers & leaders"],
] as const;

export default function Home() {
  const audienceOrder = { clinical: 0, managers: 1, families: 2, patients: 2 } as const;
  const displayResources = [...resources].sort(
    (a, b) => audienceOrder[a.audience] - audienceOrder[b.audience],
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.deliriumdownloads.com/#author",
        name: "Professor Alasdair MacLullich",
        honorificPrefix: "Professor",
        jobTitle: "Professor of Geriatric Medicine",
        url: "https://www.alasdairmaclullich.com/",
        affiliation: {
          "@type": "Organization",
          name: "The University of Edinburgh",
          url: "https://www.ed.ac.uk/",
        },
        sameAs: [
          "https://www.research.ed.ac.uk/en/persons/alasdair-maclullich/",
          "https://edwebprofiles.ed.ac.uk/profile/alasdair-maclullich",
          "https://orcid.org/0000-0003-3159-9370",
          "https://www.alasdairmaclullich.com/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.deliriumdownloads.com/#website",
        name: "Delirium Downloads",
        url: "https://www.deliriumdownloads.com/",
        description:
          "Free, printable delirium resources for health and care staff, including clinical prompts and patient/family handouts.",
        inLanguage: "en-GB",
        publisher: { "@id": "https://www.deliriumdownloads.com/#author" },
      },
      {
        "@type": "MedicalWebPage",
        "@id": "https://www.deliriumdownloads.com/#resource-library",
        url: "https://www.deliriumdownloads.com/",
        name: "Delirium Downloads resource library",
        headline: "Delirium resources, ready for the next conversation",
        description:
          "A clinical-preview library of delirium prompts, teaching resources and patient/family handouts for staff.",
        inLanguage: "en-GB",
        isAccessibleForFree: true,
        dateCreated: "2026-08-07",
        dateModified: "2026-08-08",
        lastReviewed: "2026-08-08",
        author: { "@id": "https://www.deliriumdownloads.com/#author" },
        publisher: { "@id": "https://www.deliriumdownloads.com/#author" },
        audience: {
          "@type": "MedicalAudience",
          audienceType: "Health and care staff",
        },
        about: {
          "@type": "MedicalCondition",
          name: "Delirium",
        },
        isBasedOn: [
          "https://www.nice.org.uk/guidance/cg103/chapter/Recommendations",
          "https://rightdecisions.scot.nhs.uk/risk-reduction-and-management-of-delirium-sign/",
          "https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/delirium",
          "https://www.the4at.com/",
        ],
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#downloads">
        Skip to downloads
      </a>
      <div className="public-route-bar" role="note" aria-label="Information for patients and families">
        <div className="shell public-route-inner">
          <span className="route-badge" aria-hidden="true">i</span>
          <p>
            <strong>Looking for help for yourself or someone close to you?</strong>
            This library is designed for staff.
          </p>
          <a href="https://www.deliriumsupport.com/">Visit Delirium Support <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="preview-bar" role="status">
        <div className="shell">
          <strong>Clinical preview · not released for patient care</strong>
          <span>Version 0.9 is awaiting final named human clinical review.</span>
        </div>
      </div>

      <header className="site-header shell">
        <a className="wordmark" href="#top" aria-label="Delirium Downloads home">
          <span>delirium</span>
          <strong>downloads</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#downloads">Downloads</a>
          <a href="#medical-students">Medical students</a>
          <a href="#how-to-use">How to use</a>
          <a href="#standards">About &amp; standards</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">For health, care and teaching staff</p>
            <h1 id="hero-title">
              Delirium resources,
              <span> ready for the next conversation.</span>
            </h1>
            <p className="hero-intro">
              A practical library of one-page downloads for clinical care,
              teaching and service improvement, with editable Word alternatives.
              Patient and family handouts are for staff to select, talk through and
              give to the people they support.
            </p>
            <form className="search-box" id="resource-search-form" role="search">
              <label htmlFor="resource-search">Find a download</label>
              <div className="search-control">
                <span aria-hidden="true">⌕</span>
                <input
                  id="resource-search"
                  type="search"
                  placeholder="Try ‘student’, ‘prevention’ or ‘discharge’"
                  autoComplete="off"
                />
                <kbd>{resources.length} PDFs</kbd>
              </div>
            </form>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="paper paper-one">
              <span>WHAT TO DO</span>
              <strong>Sudden change?</strong>
              <i />
              <i />
              <i />
            </div>
            <div className="paper paper-two">
              <span>CLINICAL</span>
              <strong>Find causes</strong>
              <b>01</b>
              <b>02</b>
              <b>03</b>
            </div>
            <div className="sticker">PRINT<br />ME</div>
          </div>
        </section>

        <section className="student-section" id="medical-students" aria-labelledby="students-title">
          <div className="shell student-grid">
            <div className="student-intro">
              <p className="eyebrow">Medical students · start here</p>
              <h2 id="students-title">From noticing change to making a plan</h2>
              <p>
                A supervised learning path for placements, bedside teaching and revision.
                Use the sheets with a real or simulated case; they are not a substitute for
                local teaching, clinical supervision or patient-specific assessment.
              </p>
              <h3>By the end, you should be able to</h3>
              <ul className="student-outcomes">
                <li>recognise acute change, fluctuation, inattention and altered arousal, including hypoactive delirium;</li>
                <li>explain what a 4AT result can and cannot establish;</li>
                <li>build a cause-directed, multidomain assessment and care plan.</li>
              </ul>
              <a className="student-filter-link" href="#downloads" data-set-filter="students">
                Show the student set <span aria-hidden="true">↓</span>
              </a>
              <p className="student-official-link">
                Use the <a href="https://www.the4at.com/">official current 4AT and user guide</a>.
              </p>
            </div>
            <div>
              <ol className="student-path">
                <li>
                  <span>01</span>
                  <div><strong>Recognise the pattern</strong><p>Baseline, acute change, fluctuation, attention and arousal.</p></div>
                  <a href="./downloads/recognising-delirium-at-the-bedside.pdf" download aria-label="Download Recognising delirium at the bedside">PDF ↓</a>
                </li>
                <li>
                  <span>02</span>
                  <div><strong>Use the 4AT properly</strong><p>Screening supports assessment; it does not replace diagnosis.</p></div>
                  <a href="./downloads/positive-4at-next-steps.pdf" download aria-label="Download A positive 4AT: what happens next">PDF ↓</a>
                </li>
                <li>
                  <span>03</span>
                  <div><strong>Search for causes</strong><p>Look for urgent threats and interacting contributors.</p></div>
                  <a href="./downloads/structured-cause-sweep.pdf" download aria-label="Download structured cause sweep">PDF ↓</a>
                </li>
                <li>
                  <span>04</span>
                  <div><strong>Build the treatment plan</strong><p>Treat causes while supporting physiology, function and distress.</p></div>
                  <a href="./downloads/multidomain-treatment.pdf" download aria-label="Download multidomain treatment of delirium">PDF ↓</a>
                </li>
              </ol>
              <details className="student-case">
                <summary>Try a short case</summary>
                <p>
                  An 82-year-old admitted with pneumonia is newly sleepy, eats little and gives slow answers.
                  A relative says this is very different from yesterday. What should you notice, assess and communicate?
                </p>
                <p>
                  <strong>Discussion:</strong> Treat the collateral history as evidence of acute change; recognise a possible
                  hypoactive presentation; check urgency and physiology; use the appropriate detection tool; arrange clinical
                  assessment for multiple causes; and start cause-directed and supportive care. One quiet encounter cannot
                  establish either recovery or a diagnosis by itself.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="catalogue" id="downloads" aria-labelledby="downloads-title">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">The download desk</p>
                <h2 id="downloads-title">Pick the guide that fits</h2>
              </div>
              <p id="results-count" className="result-count" aria-live="polite">
                Showing all {resources.length} downloads
              </p>
            </div>

            <div className="filter-row" role="group" aria-label="Filter downloads">
              {filters.map(([value, label], index) => (
                <button
                  key={value}
                  type="button"
                  className={index === 0 ? "filter-button is-active" : "filter-button"}
                  data-filter={value}
                  aria-pressed={index === 0}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="resource-grid" id="resource-grid">
              {displayResources.map((resource, resourceIndex) => (
                <article
                  className={`resource-card tone-${resource.tone}${resource.featured ? " featured" : ""}`}
                  data-audience={`${resource.audience}${resource.studentRecommended ? " students" : ""}`}
                  data-search={`${resource.title} ${resource.description} ${resource.audienceLabel} ${resource.keywords ?? ""}`.toLowerCase()}
                  key={resource.slug}
                >
                  <div className="card-topline">
                    <span className="resource-number">{String(resourceIndex + 1).padStart(2, "0")}</span>
                    <span className="page-count">{resource.pages} {resource.pages === 1 ? "page" : "pages"}</span>
                  </div>
                  <div className="file-glyph" aria-hidden="true"><span>PDF</span></div>
                  <p className="audience-label">{resource.audienceLabel}</p>
                  <h3>{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  <div className="resource-actions">
                    <a href={`./downloads/${resource.slug}.pdf`} target="_blank" rel="noreferrer" aria-label={`View ${resource.title} as PDF in a new tab`}>
                      View PDF <span aria-hidden="true">↗</span>
                    </a>
                    <a href={`./downloads/${resource.slug}.pdf`} download aria-label={`Download ${resource.title} as PDF`}>
                      PDF <span aria-hidden="true">↓</span>
                    </a>
                    <a href={`./downloads/${resource.slug}.docx`} download aria-label={`Download editable ${resource.title} Word template`}>
                      Word <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="empty-state" id="empty-state" hidden>
              <strong>No exact match.</strong>
              <p>Try a shorter search, or choose another audience.</p>
              <button type="button" id="reset-search">Show all downloads</button>
            </div>
          </div>
        </section>

        <section className="use-section shell" id="how-to-use" aria-labelledby="use-title">
          <div className="use-intro">
            <p className="eyebrow">Use it well</p>
            <h2 id="use-title">A useful sheet starts a conversation</h2>
            <p>
              Choose the guide for the job, print at 100%, and add local contact
              details where needed. The Word alternatives are local-adaptation templates,
              not approved local policy. Talk patient and family handouts through rather
              than leaving them without context. These resources do not replace assessment or local policy.
            </p>
          </div>
          <ol className="steps-list">
            <li><span>1</span><div><strong>Choose the use</strong><p>Clinical prompt, teaching aid, service tool or handout.</p></div></li>
            <li><span>2</span><div><strong>Print, share or adapt</strong><p>Use the A4 PDF unchanged, or adapt the Word template only after named local clinical review.</p></div></li>
            <li><span>3</span><div><strong>Talk it through</strong><p>Circle actions and note who owns them and when they will be reviewed.</p></div></li>
          </ol>
        </section>

        <aside className="medical-safety shell" aria-labelledby="medical-safety-title">
          <div>
            <p className="eyebrow">Medical safety</p>
            <h2 id="medical-safety-title">New, sudden confusion needs urgent assessment</h2>
          </div>
          <p>
            These downloads are educational resources, not an emergency service or individual
            medical advice. In the UK, call 999 or go to A&amp;E for new sudden confusion; do not
            drive yourself. If the person is already receiving care, alert the responsible staff
            immediately. Outside the UK, use the local emergency number or emergency service.
          </p>
        </aside>

        <section className="trust-section" id="standards" aria-labelledby="standards-title">
          <div className="shell trust-grid">
            <div className="author-panel">
              <div className="author-mark" aria-hidden="true">AM</div>
              <div>
                <p className="eyebrow">Lead author and clinical editor</p>
                <h2 id="standards-title">Professor Alasdair MacLullich</h2>
                <p>
                  Professor of Geriatric Medicine, University of Edinburgh;
                  clinically active in acute geriatric medicine and acute orthogeriatrics,
                  with a specialist focus on delirium detection, prevention and care.
                </p>
                <p className="author-status"><strong>Publication status:</strong> clinical preview awaiting final named human review.</p>
                <div className="profile-links">
                  <a href="https://www.alasdairmaclullich.com/">Personal website ↗</a>
                  <a href="https://edwebprofiles.ed.ac.uk/profile/alasdair-maclullich">University staff profile ↗</a>
                  <a href="https://www.research.ed.ac.uk/en/persons/alasdair-maclullich/">Research and publications ↗</a>
                  <a href="https://orcid.org/0000-0003-3159-9370">ORCID ↗</a>
                </div>
              </div>
            </div>

            <div className="standards-panel">
              <p className="eyebrow">Clinical publishing standard</p>
              <ul className="standards-list">
                <li><strong>Current sources</strong><span>NICE, SIGN, NHS, NHS Inform, MHRA and the official 4AT.</span></li>
                <li><strong>Clear scope</strong><span>Designed for staff; UK-focused education, not individual medical advice or a substitute for local guidance.</span></li>
                <li><strong>Transparent production</strong><span>Drafted from Professor MacLullich&apos;s source collection with AI assistance; human clinical release review is required.</span></li>
                <li><strong>Version control</strong><span>Every download carries its version, status and source list; material changes trigger fresh review.</span></li>
                <li><strong>Interests</strong><span>Professor MacLullich led development of the 4AT and reports no financial interest in its uptake.</span></li>
                <li><strong>Independent</strong><span>No advertising, sponsorship or paywall; optional analytics only with consent.</span></li>
              </ul>
              <details id="editorial-policy">
                <summary>Editorial, review and corrections policy</summary>
                <p>
                  Version 0.9 resources and this website were last reviewed and updated
                  8 August 2026. This preview collection is
                  awaiting final named human clinical review before use in patient
                  care. Sources appear inside every PDF. Corrections can be sent via
                  <a href="https://www.alasdairmaclullich.com/"> AlasdairMacLullich.com</a>. The site is independently
                  maintained and is not an official University of Edinburgh or NHS website.
                  Word templates may be adapted for non-commercial clinical education after
                  named local review; retain the source list, attribution, version and a clear
                  record of local changes. Adaptation does not imply University or NHS endorsement.
                </p>
              </details>
              <details>
                <summary>Who, how and why</summary>
                <p>
                  <strong>Who:</strong> the collection is authored and clinically edited by
                  Professor Alasdair MacLullich. <strong>How:</strong> source material was drafted
                  into concise staff resources with AI assistance, checked against the official
                  sources listed in each download, and subjected to structured safety and
                  accessibility review; final named human release review remains outstanding.
                  <strong>Why:</strong> the resources are provided free of charge to support safer,
                  clearer delirium conversations, teaching and service improvement.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="sources-strip" aria-label="Core clinical sources">
          <div className="shell sources-inner">
            <p><strong>Core sources:</strong> links open the current official guidance.</p>
            <div>
              <a href="https://www.nice.org.uk/guidance/cg103/chapter/Recommendations">NICE CG103</a>
              <a href="https://rightdecisions.scot.nhs.uk/risk-reduction-and-management-of-delirium-sign/">SIGN 157</a>
              <a href="https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/delirium">NHS Inform</a>
              <a href="https://www.the4at.com/">4AT</a>
            </div>
          </div>
        </section>
      </main>

      <aside className="newsletter-invitation shell" aria-labelledby="newsletter-title">
        <h2 id="newsletter-title">More from Alasdair MacLullich</h2>
        <p>Free articles on delirium, dementia and better care, for patients, families and healthcare professionals. Usually one email a week, with occasional book and resource news.</p>
        <a href="https://alasdairmaclullich.substack.com/subscribe">Subscribe free on Substack</a>
      </aside>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <a className="wordmark footer-wordmark" href="#top"><span>delirium</span><strong>downloads</strong></a>
            <p>Free printable delirium information. Version 0.9 · site updated 8 August 2026.</p>
          </div>
          <div>
            <p><strong>Staff education only.</strong> Not individual diagnosis or treatment.</p>
            <p>Patient or family visitor? <a href="https://www.deliriumsupport.com/">Go to Delirium Support.</a></p>
          </div>
          <nav className="footer-links" aria-label="Author and site information">
            <a href="https://www.alasdairmaclullich.com/">AlasdairMacLullich.com</a>
            <a href="https://orcid.org/0000-0003-3159-9370">ORCID</a>
            <a href="https://edwebprofiles.ed.ac.uk/profile/alasdair-maclullich">University profile</a>
            <a href="#editorial-policy">Editorial and corrections policy</a>
          </nav>
          <p className="copyright">© 2026 Alasdair MacLullich. Independently maintained; not an official University of Edinburgh or NHS website. Free to download and print; Word templates may be adapted locally under the review terms above.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script src="./catalogue.js" defer />
    </>
  );
}
