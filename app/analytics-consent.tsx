export default function AnalyticsConsent() {
  return (
    <>
      <button
        aria-controls="analytics-consent"
        aria-expanded="false"
        className="analytics-settings"
        id="analytics-settings"
        type="button"
      >
        Analytics settings
      </button>
      <section
        aria-label="Analytics choices"
        className="analytics-consent"
        hidden
        id="analytics-consent"
      >
        <p>
          <strong>May this site count your visit?</strong> Optional, privacy-limited Google Analytics helps show which resources are useful. Advertising features stay off.
        </p>
        <div>
          <button id="analytics-allow" type="button">Allow analytics</button>
          <button id="analytics-decline" type="button">No, thank you</button>
        </div>
      </section>
      <script src="./analytics-consent.js" defer />
    </>
  );
}
