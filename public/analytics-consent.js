(() => {
  "use strict";

  const measurementId = "G-5HYLTS8YFT";
  const consentCookie = "dd_analytics_choice";
  const consentMaxAge = 90 * 24 * 60 * 60;
  const settingsButton = document.querySelector("#analytics-settings");
  const consentPanel = document.querySelector("#analytics-consent");
  const allowButton = document.querySelector("#analytics-allow");
  const declineButton = document.querySelector("#analytics-decline");

  if (!settingsButton || !consentPanel || !allowButton || !declineButton) return;

  function readChoice() {
    const match = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${consentCookie}=`));
    const value = match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
    return value === "granted" || value === "denied" ? value : null;
  }

  function saveChoice(value) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${consentCookie}=${value}; Max-Age=${consentMaxAge}; Path=/; SameSite=Lax${secure}`;
  }

  function clearAnalyticsCookies() {
    document.cookie.split(";").forEach((part) => {
      const name = part.split("=")[0]?.trim();
      if (name === "_ga" || name?.startsWith("_ga_")) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.deliriumdownloads.com; SameSite=Lax; Secure`;
      }
    });
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  function setPanelOpen(open, focusChoice = false) {
    consentPanel.hidden = !open;
    settingsButton.setAttribute("aria-expanded", String(open));
    if (open && focusChoice) allowButton.focus();
  }

  function loadAnalytics() {
    ensureGtag();
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    if (!document.querySelector(`script[data-analytics-id="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.analyticsId = measurementId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: consentMaxAge,
        page_location: window.location.origin + window.location.pathname,
      });
    }
  }

  ensureGtag();
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
  window.gtag("set", "ads_data_redaction", true);

  settingsButton.addEventListener("click", () => setPanelOpen(true, true));
  allowButton.addEventListener("click", () => {
    saveChoice("granted");
    loadAnalytics();
    setPanelOpen(false);
  });
  declineButton.addEventListener("click", () => {
    saveChoice("denied");
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    clearAnalyticsCookies();
    setPanelOpen(false);
  });

  const choice = readChoice();
  if (choice === "granted") loadAnalytics();
  else if (choice === "denied") clearAnalyticsCookies();
  else setPanelOpen(true);
})();
