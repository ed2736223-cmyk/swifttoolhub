"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { calcSeoScore, type ContentBlock } from "@/lib/blogBlocks";

function CounterHint({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.trim().length;
  const onTarget = len >= min && len <= max;
  return (
    <p className={`mt-1 text-[11px] ${onTarget ? "text-emerald-600" : "text-heading/40"}`}>
      {len} characters {onTarget ? "— good length" : `— aim for ${min}–${max}`}
    </p>
  );
}

export default function BlogSeoPanel({
  metaTitle,
  metaDescription,
  coverImageAlt,
  excerpt,
  slug,
  blocks,
  onChange,
}: {
  metaTitle: string;
  metaDescription: string;
  coverImageAlt: string;
  excerpt: string;
  slug: string;
  blocks: ContentBlock[];
  onChange: (patch: { metaTitle?: string; metaDescription?: string; coverImageAlt?: string }) => void;
}) {
  const seo = calcSeoScore({ metaTitle, metaDescription, excerpt, slug, blocks });
  const gradeColor =
    seo.grade === "Good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-300/50"
      : seo.grade === "OK"
      ? "bg-amber-50 text-amber-700 border-amber-300/50"
      : "bg-red-50 text-red-700 border-red-300/50";

  return (
    <div className="rounded-2xl border border-heading/10 bg-heading/[0.015] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-heading/50">SEO</p>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${gradeColor}`}>
          {seo.grade} · {seo.score}/100
        </span>
      </div>

      <div className="mt-3 grid gap-3">
        <div>
          <label className="text-xs font-semibold text-heading/50">SEO title</label>
          <input
            value={metaTitle}
            onChange={(e) => onChange({ metaTitle: e.target.value })}
            placeholder="Falls back to the post title if left blank"
            className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
          />
          <CounterHint value={metaTitle} min={30} max={60} />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Meta description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => onChange({ metaDescription: e.target.value })}
            rows={2}
            placeholder="Falls back to the excerpt if left blank"
            className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm leading-relaxed focus:border-brand/40 focus:outline-none"
          />
          <CounterHint value={metaDescription} min={120} max={160} />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Cover image alt text</label>
          <input
            value={coverImageAlt}
            onChange={(e) => onChange({ coverImageAlt: e.target.value })}
            placeholder="Describe the cover image"
            className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {seo.checks.map((c) => (
          <div key={c.id} className="flex items-start gap-2 text-[12px]">
            {c.pass ? (
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <XCircle size={14} className="mt-0.5 shrink-0 text-heading/25" />
            )}
            <div>
              <span className={c.pass ? "text-heading/70" : "text-heading/50"}>{c.label}</span>
              {!c.pass && <p className="text-[11px] text-heading/35">{c.hint}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
