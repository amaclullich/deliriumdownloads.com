"use client";

import { useEffect, useState } from "react";

const MEASUREMENT_ID = "G-5HYLTS8YFT";
const CONSENT_COOKIE = "dd_analytics_choice";
const CONSENT_MAX_AGE = 90 * 24 * 60 * 60;

type ConsentChoice = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function readChoice(): ConsentChoice {
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  const value = match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
  return value === "granted" || value === "denied" ? value : null;
}

function saveChoice(value: Exclude<ConsentChoice, null>) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
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
    // Google processes command tuples stored as Arguments objects.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
}

function loadAnalytics() {
  ensureGtag();
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!document.querySelector(`script[data-analytics-id="${MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.analyticsId = MEASUREMENT_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: CONSENT_MAX_AGE,
      page_location: window.location.origin + window.location.pathname,
    });
  }
}

export default function AnalyticsConsent() {
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    ensureGtag();

    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    window.gtag("set", "ads_data_redaction", true);

    const choice = readChoice();
    if (choice === "granted") {
      loadAnalytics();
    } else if (choice === "denied") {
      clearAnalyticsCookies();
    } else {
      const timer = window.setTimeout(() => setBannerOpen(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function accept() {
    saveChoice("granted");
    loadAnalytics();
    setBannerOpen(false);
  }

  function decline() {
    saveChoice("denied");
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    clearAnalyticsCookies();
    setBannerOpen(false);
  }

  return (
    <>
      <button className="analytics-settings" type="button" onClick={() => setBannerOpen(true)}>
        Analytics settings
      </button>
      {bannerOpen ? (
        <section className="analytics-consent" aria-label="Analytics choices">
          <p>
            <strong>May this site count your visit?</strong> Optional, privacy-limited Google Analytics helps show which resources are useful. Advertising features stay off.
          </p>
          <div>
            <button type="button" onClick={accept}>Allow analytics</button>
            <button type="button" onClick={decline}>No, thank you</button>
          </div>
        </section>
      ) : null}
    </>
  );
}
