"use client";

import { useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Search,
  Maximize2,
  Sparkles,
} from "lucide-react";

type Status = "PENDING" | "APPROVED" | "REJECTED";

type PaymentRequestItem = {
  id: string;
  status: Status;
  kind: "PRO" | "BUNDLE10" | "TOOL";
  toolSlugs: string[];
  amount: number;
  screenshot: string;
  note: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user: { id: string; name: string | null; email: string; plan: string };
  reviewedBy?: { id: string; name: string | null; email: string } | null;
};

function kindLabel(r: Pick<PaymentRequestItem, "kind" | "toolSlugs">) {
  if (r.kind === "BUNDLE10") {
    return r.toolSlugs.length > 0 ? `Bundle-10: ${r.toolSlugs.join(", ")}` : "Bundle-10";
  }
  if (r.kind === "TOOL") {
    return r.toolSlugs.length > 0 ? `Single tool: ${r.toolSlugs[0]}` : "Single tool";
  }
  return "All-Access (unlimited)";
}

const TABS: { key: Status; label: string; icon: typeof Clock }[] = [
  { key: "PENDING", label: "Pending", icon: Clock },
  { key: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { key: "REJECTED", label: "Rejected", icon: XCircle },
];

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source.slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminPaymentRequests({
  initialRequests,
}: {
  initialRequests: PaymentRequestItem[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [tab, setTab] = useState<Status>("PENDING");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      PENDING: requests.filter((r) => r.status === "PENDING").length,
      APPROVED: requests.filter((r) => r.status === "APPROVED").length,
      REJECTED: requests.filter((r) => r.status === "REJECTED").length,
    }),
    [requests]
  );

  const visible = requests.filter((r) => {
    if (r.status !== tab) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return r.user.email.toLowerCase().includes(q) || (r.user.name || "").toLowerCase().includes(q);
  });

  const review = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/payment-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: data.request.status, reviewedAt: data.request.reviewedAt, reviewedBy: data.request.reviewedBy }
              : r
          )
        );
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 rounded-full bg-heading/5 p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:flex-none ${
                tab === t.key ? "bg-white text-heading shadow-sm" : "text-heading/50 hover:text-heading"
              }`}
            >
              <t.icon size={13} />
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab === t.key ? "bg-heading/10" : "bg-heading/10"
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-heading/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-full border border-heading/10 bg-white py-2.5 pl-9 pr-4 text-xs text-heading placeholder:text-heading/35 focus:border-brand/40 focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-heading/15 p-14 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-heading/5 text-heading/30">
            <Sparkles size={18} />
          </span>
          <p className="text-sm font-medium text-heading/50">
            {query ? "No matching requests." : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((r) => (
            <div
              key={r.id}
              className="overflow-hidden rounded-3xl border border-heading/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setLightbox(r.screenshot)}
                className="group relative block h-44 w-full overflow-hidden bg-heading/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.screenshot}
                  alt="Payment screenshot"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-heading/0 opacity-0 transition-all group-hover:bg-heading/40 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-heading">
                    <Maximize2 size={12} /> View full screenshot
                  </span>
                </span>
              </button>

              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                    {initials(r.user.name, r.user.email)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">
                      {r.user.name || "Unnamed user"}
                    </p>
                    <p className="flex items-center gap-1 truncate text-[11.5px] text-heading/50">
                      <Mail size={10} /> {r.user.email}
                    </p>
                  </div>
                </div>

                {r.note && (
                  <p className="mt-3 rounded-lg bg-heading/[0.03] p-2 text-[12px] italic text-heading/60">
                    &ldquo;{r.note}&rdquo;
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                    {kindLabel(r)}
                  </span>
                  <span className="shrink-0 text-[12px] font-semibold text-heading">${r.amount}</span>
                </div>
                <p className="mt-2 text-[11px] text-heading/40">Submitted {timeAgo(r.createdAt)}</p>

                {r.status === "PENDING" ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => review(r.id, "approve")}
                      disabled={busyId === r.id}
                      className="btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {busyId === r.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Approve
                    </button>
                    <button
                      onClick={() => review(r.id, "reject")}
                      disabled={busyId === r.id}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-heading/5 px-4 py-2 text-xs font-semibold text-heading transition-colors hover:bg-heading/10 disabled:opacity-50"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-1.5">
                    <p
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                        r.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {r.status === "APPROVED" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {r.status === "APPROVED" ? "Approved — access granted" : "Rejected"}
                    </p>
                    {r.reviewedBy && (
                      <p className="pl-1 text-[11px] text-heading/40">
                        by {r.reviewedBy.name || r.reviewedBy.email}
                        {r.reviewedAt ? ` · ${timeAgo(r.reviewedAt)}` : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-heading/80 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Payment screenshot full size"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
