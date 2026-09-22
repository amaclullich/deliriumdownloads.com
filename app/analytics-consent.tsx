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
          <strong>Analytics is on.</strong> We use limited Google Analytics to see which resources are useful. It is not used for advertising or Google Signals. Google receives information such as pages viewed, approximate location, browser or device type and referring website. You can turn analytics off now or at any time.
        </p>
        <div>
          <button id="analytics-allow" type="button">Keep analytics on</button>
          <button id="analytics-decline" type="button">Turn analytics off</button>
        </div>
      </section>
      <script src="./analytics-consent.js" defer />
    </>
  );
}
