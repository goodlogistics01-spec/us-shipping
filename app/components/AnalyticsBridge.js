"use client";

import { useEffect } from "react";

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

function pushAnonymousEvent(event, details = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    ...details
  });
}

function loadGtm(gtmId) {
  if (!GTM_ID_PATTERN.test(gtmId) || document.querySelector("script[data-gdlogi-gtm]")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.dataset.gdlogiGtm = "true";
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);
}

export default function AnalyticsBridge({ gtmId = "" }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    const consentKey = "gdlogi_analytics_consent";
    const readConsent = () => {
      try {
        return window.localStorage.getItem(consentKey);
      } catch {
        return null;
      }
    };
    const writeConsent = (value) => {
      try {
        window.localStorage.setItem(consentKey, value);
      } catch {
        // The event layer still works when storage is unavailable.
      }
    };

    if (readConsent() === "granted") loadGtm(gtmId);

    const handleConsent = (event) => {
      const status = event.detail?.status;
      if (status !== "granted" && status !== "denied") return;
      writeConsent(status);
      if (status === "granted") loadGtm(gtmId);
    };

    const handleContactClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link || link.matches("[data-contact-event], [data-track-contact], [data-analytics-owned]")) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("mailto:")) {
        pushAnonymousEvent("email_click", { link_location: "site" });
      } else if (href.includes("wa.me/") || href.includes("whatsapp.com/")) {
        pushAnonymousEvent("whatsapp_click", { link_location: "site" });
      }
    };

    window.addEventListener("gdlogi:analytics-consent", handleConsent);
    document.addEventListener("click", handleContactClick);
    return () => {
      window.removeEventListener("gdlogi:analytics-consent", handleConsent);
      document.removeEventListener("click", handleContactClick);
    };
  }, [gtmId]);

  return null;
}
