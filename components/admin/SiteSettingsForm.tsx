"use client";

import { useState } from "react";
import { Loader2, Check, DollarSign, Megaphone, AlertCircle } from "lucide-react";

type FormState = {
  bundle10Price: number;
  bundle10Size: number;
  allAccessPrice: number;
  defaultFreeUseLimit: number;
  adsEnabled: boolean;
  adsterraBannerKey: string;
  adsterraBannerSrc: string;
  adsterraSitewideSrc: string;
};

export default function SiteSettingsForm({ initial }: { initial: FormState }) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Pricing */}
      <div className="rounded-3xl border border-heading/10 bg-white p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-heading">
          <DollarSign size={16} className="text-brand" /> Pricing &amp; Limits
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Bundle price (USD)">
            <input
              type="number"
              min={1}
              step="0.5"
              value={form.bundle10Price}
              onChange={(e) => set("bundle10Price", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Tools per bundle">
            <input
              type="number"
              min={1}
              value={form.bundle10Size}
              onChange={(e) => set("bundle10Size", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="All-Access price (USD)">
            <input
              type="number"
              min={1}
              step="0.5"
              value={form.allAccessPrice}
              onChange={(e) => set("allAccessPrice", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Default free-use limit" hint="-1 = unlimited">
            <input
              type="number"
              min={-1}
              value={form.defaultFreeUseLimit}
              onChange={(e) => set("defaultFreeUseLimit", Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>
        <p className="mt-3 text-[11.5px] text-heading/40">
          Individual tools can still override the price and use limit — see Tool Pricing &amp; Limits.
        </p>
      </div>

      {/* Ads */}
      <div className="rounded-3xl border border-heading/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-heading">
            <Megaphone size={16} className="text-brand" /> Adsterra Ads
          </p>
          <button
            type="button"
            onClick={() => set("adsEnabled", !form.adsEnabled)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              form.adsEnabled ? "bg-brand-gradient" : "bg-heading/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                form.adsEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <p className="mt-1 text-[12px] text-heading/50">
          Turn this off during an AdSense review — no ads render anywhere, even if keys are filled in
          below.
        </p>

        <div className="mt-4 space-y-3">
          <Field label="Banner zone key">
            <input
              value={form.adsterraBannerKey}
              onChange={(e) => set("adsterraBannerKey", e.target.value)}
              placeholder="from the Adsterra 'atOptions' snippet"
              className="input"
            />
          </Field>
          <Field label="Banner invoke script URL">
            <input
              value={form.adsterraBannerSrc}
              onChange={(e) => set("adsterraBannerSrc", e.target.value)}
              placeholder="//www.example.com/xxxxxxxx/invoke.js"
              className="input"
            />
          </Field>
          <Field label="Sitewide script URL (Social Bar / Popunder)" hint="optional">
            <input
              value={form.adsterraSitewideSrc}
              onChange={(e) => set("adsterraSitewideSrc", e.target.value)}
              placeholder="//www.example.com/xxxxxxxx/invoke.js"
              className="input"
            />
          </Field>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-[13px] text-red-600">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saved ? "Saved" : "Save Settings"}
      </button>

      <style jsx>{`
        :global(.input) {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(15, 15, 15, 0.1);
          padding: 0.625rem 0.875rem;
          font-size: 0.8125rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgba(124, 58, 237, 0.4);
        }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-heading/50">
      {label} {hint && <span className="font-normal text-heading/30">({hint})</span>}
      {children}
    </label>
  );
}
