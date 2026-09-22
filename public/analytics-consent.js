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
    if (open) {
      const isOff = readChoice() === "denied";
      const state = consentPanel.querySelector("strong");
      if (state) state.textContent = isOff ? "Analytics is off." : "Analytics is on.";
      allowButton.textContent = isOff ? "Turn analytics on" : "Keep analytics on";
      declineButton.textContent = isOff ? "Keep analytics off" : "Turn analytics off";
    }
    consentPanel.hidden = !open;
    settingsButton.setAttribute("aria-expanded", String(open));
    if (open && focusChoice) allowButton.focus();
  }

  // Keep campaign tags (utm_ parameters); drop every other query string.
  function pageLocation() {
    const kept = [];
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (/^utm_(?:source|medium|campaign|term|content|id)$/.test(key)) {
        kept.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    return window.location.origin + window.location.pathname + (kept.length ? `?${kept.join("&")}` : "");
  }

  function loadAnalytics() {
    window[`ga-disable-${measurementId}`] = false;
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
        page_location: pageLocation(),
      });
    }
  }

  const choice = readChoice();

  ensureGtag();
  window.gtag("consent", "default", {
    analytics_storage: choice === "denied" ? "denied" : "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("set", "ads_data_redaction", true);

  settingsButton.addEventListener("click", () => setPanelOpen(true, true));
  allowButton.addEventListener("click", () => {
    saveChoice("granted");
    loadAnalytics();
    setPanelOpen(false);
  });
  declineButton.addEventListener("click", () => {
    const wasLoaded = Boolean(document.querySelector(`script[data-analytics-id="${measurementId}"]`));
    window[`ga-disable-${measurementId}`] = true;
    saveChoice("denied");
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    clearAnalyticsCookies();
    setPanelOpen(false);
    if (wasLoaded) window.location.reload();
  });

  // Limited analytics is on by default under the UK statistical purposes
  // exception (PECR as amended by the Data (Use and Access) Act 2025).
  // A saved "denied" choice is honoured; a first visit shows the notice.
  if (choice === "denied") {
    window[`ga-disable-${measurementId}`] = true;
    clearAnalyticsCookies();
  } else {
    loadAnalytics();
    if (choice === null) setPanelOpen(true);
  }
})();
