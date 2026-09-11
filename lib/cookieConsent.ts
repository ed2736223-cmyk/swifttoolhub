"use client";

export type ConsentStatus = "accepted" | "rejected" | null;

const STORAGE_KEY = "sth_cookie_consent";
export const CONSENT_EVENT = "sth-cookie-consent-changed";

export function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function setStoredConsent(status: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: status }));
}
