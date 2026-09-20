"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, CONSENT_EVENT } from "@/lib/cookieConsent";

/**
 * Loads the sitewide Adsterra script only after the visitor has accepted
 * the cookie consent banner. Renders nothing until then.
 */
export default function AdsGate({ src }: { src: string | null }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(getStoredConsent() === "accepted");
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAllowed(detail === "accepted");
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  if (!src || !allowed) return null;

  return <Script src={src.startsWith("//") ? src : `//${src}`} strategy="afterInteractive" />;
}
