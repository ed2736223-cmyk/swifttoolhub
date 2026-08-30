"use client";

import { useEffect, useRef } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

/**
 * Adsterra banner ad unit — fully managed from the admin panel
 * (/admin/settings), not env vars. An admin pastes the Adsterra zone 'key'
 * and invoke-script 'src' there, and flips "Ads enabled" on; every <AdSlot />
 * on the site then shows that ad zone immediately, no redeploy needed.
 * Until it's configured (or while ads are turned off for AdSense review),
 * this renders a labeled placeholder box so layout/spacing stay correct.
 */
export default function AdSlot({
  width = 300,
  height = 250,
  className = "",
  label = "Advertisement",
}: {
  width?: number;
  height?: number;
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, loading } = useSiteSettings();
  const active = settings.adsEnabled && settings.adsterraBannerKey && settings.adsterraBannerSrc;

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    // Adsterra's snippet is two plain <script> tags — React can't render
    // these directly (it won't execute injected script text), so they're
    // built and appended manually here instead.
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `atOptions = { 'key' : '${settings.adsterraBannerKey}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    const src = settings.adsterraBannerSrc as string;
    invokeScript.src = src.startsWith("//") ? src : `//${src}`;
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);
  }, [active, settings.adsterraBannerKey, settings.adsterraBannerSrc, width, height]);

  if (loading) {
    return <div className={`min-h-[100px] w-full ${className}`} />;
  }

  if (!active) {
    return (
      <div
        className={`flex min-h-[100px] w-full items-center justify-center rounded-2xl border border-dashed border-brand/30 bg-brand-softer text-xs uppercase tracking-wide text-heading/40 ${className}`}
      >
        {label} slot — configure in Admin → Settings
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, maxWidth: "100%", margin: "0 auto" }}
    />
  );
}
