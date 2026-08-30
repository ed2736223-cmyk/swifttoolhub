"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Trash2,
  Pencil,
  Crown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from "lucide-react";
import { resolveIcon } from "@/lib/iconMap";

const CATEGORIES = ["Convert", "Generate", "Check", "Develop"] as const;

type DbTool = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  content: string;
  howTo: string | null;
  category: string;
  tier: string;
  price: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  slug: string;
  shortDesc: string;
  content: string;
  howTo: string;
  category: string;
  tier: "free" | "pro";
  price: string;
  icon: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  shortDesc: "",
  content: "",
  howTo: "",
  category: "Convert",
  tier: "free",
  price: "",
  icon: "Wrench",
};

function autoSlug(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ManageToolsPanel({
  initialTools,
  iconOptions,
}: {
  initialTools: DbTool[];
  iconOptions: string[];
}) {
  const [tools, setTools] = useState(initialTools);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setSlugTouched(false);
    setError(null);
  };

  const createTool = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: form.tier === "pro" ? Number(form.price) : 0 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setTools((prev) => [data.tool, ...prev]);
      setShowForm(false);
      resetForm();
    } finally {
      setCreating(false);
    }
  };

  const deleteTool = async (id: string) => {
    if (!confirm("Delete this tool? It will disappear from the site immediately.")) return;
    const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTools((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={15} /> Add Tool
        </button>
      ) : (
        <div className="rounded-3xl border border-heading/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">New tool</p>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="grid h-7 w-7 place-items-center rounded-full bg-heading/5 text-heading/50"
            >
              <X size={13} />
            </button>
          </div>

          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-heading/50">Tool name</label>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : autoSlug(name) }));
                }}
                placeholder="e.g. PDF Merger"
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-heading/50">Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: autoSlug(e.target.value) }));
                }}
                placeholder="pdf-merger"
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-heading/40">
                Lives at /tools/{form.slug || "your-slug"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-heading/50">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-heading/50">Tier</label>
              <div className="mt-1.5 flex gap-2">
                {(["free", "pro"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, tier: t }))}
                    className={`flex-1 rounded-xl border px-3.5 py-2.5 text-sm font-medium capitalize transition-colors ${
                      form.tier === t
                        ? "border-brand/40 bg-brand-soft text-brand"
                        : "border-heading/10 text-heading/50"
                    }`}
                  >
                    {t === "pro" && <Crown size={12} className="mr-1 inline" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {form.tier === "pro" && (
              <div>
                <label className="text-xs font-semibold text-heading/50">Price (USD, one-time)</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 4"
                  className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-heading/40">
                  This tool gets its own pricing page and Pay Now button at this price.
                </p>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none sm:max-w-xs"
              >
                {iconOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Short description</label>
              <input
                value={form.shortDesc}
                onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
                placeholder="One line shown in tool cards and listings."
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Content (shown on the tool page)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={5}
                placeholder="Describe what the tool does, in as much detail as you want."
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">
                How to use (optional — one step per line)
              </label>
              <textarea
                value={form.howTo}
                onChange={(e) => setForm((f) => ({ ...f, howTo: e.target.value }))}
                rows={3}
                placeholder={"Paste your input.\nClick Generate.\nCopy the result."}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={createTool}
            disabled={
              creating ||
              !form.name ||
              !form.slug ||
              !form.shortDesc ||
              !form.content ||
              (form.tier === "pro" && !(Number(form.price) > 0))
            }
            className="btn-glow mt-5 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Create tool
          </button>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {tools.length === 0 ? (
          <p className="text-sm text-heading/40">No admin-added tools yet.</p>
        ) : (
          tools.map((t) => (
            <ToolRow
              key={t.id}
              tool={t}
              expanded={expandedId === t.id}
              onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
              onDelete={() => deleteTool(t.id)}
              onSaved={(updated) =>
                setTools((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
              }
              iconOptions={iconOptions}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ToolRow({
  tool,
  expanded,
  onToggle,
  onDelete,
  onSaved,
  iconOptions,
}: {
  tool: DbTool;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSaved: (t: DbTool) => void;
  iconOptions: string[];
}) {
  const Icon = resolveIcon(tool.icon);
  const [edit, setEdit] = useState<FormState>({
    name: tool.name,
    slug: tool.slug,
    shortDesc: tool.shortDesc,
    content: tool.content,
    howTo: tool.howTo || "",
    category: tool.category,
    tier: tool.tier === "pro" ? "pro" : "free",
    price: tool.price ? String(tool.price) : "",
    icon: tool.icon,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tools/${tool.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: edit.name,
          shortDesc: edit.shortDesc,
          content: edit.content,
          howTo: edit.howTo,
          category: edit.category,
          tier: edit.tier,
          price: edit.tier === "pro" ? Number(edit.price) : 0,
          icon: edit.icon,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      onSaved(data.tool);
      onToggle();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-heading/10 bg-white">
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-heading">{tool.name}</p>
            {tool.tier === "pro" && (
              <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                <Crown size={9} /> Pro · ${tool.price}
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-heading/50">
            {tool.category} · /tools/{tool.slug}
          </p>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          target="_blank"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-heading/40 hover:bg-heading/5"
          title="View live"
        >
          <ExternalLink size={14} />
        </Link>
        <button
          onClick={onToggle}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-heading/40 hover:bg-heading/5"
          title="Edit"
        >
          {expanded ? <ChevronUp size={15} /> : <Pencil size={13} />}
        </button>
        <button
          onClick={onDelete}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-red-500/70 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-heading/10 bg-heading/[0.015] p-4">
          {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-heading/50">Name</label>
              <input
                value={edit.name}
                onChange={(e) => setEdit((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-heading/50">Category</label>
              <select
                value={edit.category}
                onChange={(e) => setEdit((f) => ({ ...f, category: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-heading/50">Tier</label>
              <div className="mt-1.5 flex gap-2">
                {(["free", "pro"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEdit((f) => ({ ...f, tier: t }))}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      edit.tier === t
                        ? "border-brand/40 bg-brand-soft text-brand"
                        : "border-heading/10 text-heading/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {edit.tier === "pro" && (
              <div>
                <label className="text-xs font-semibold text-heading/50">Price (USD, one-time)</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={edit.price}
                  onChange={(e) => setEdit((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-heading/50">Icon</label>
              <select
                value={edit.icon}
                onChange={(e) => setEdit((f) => ({ ...f, icon: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              >
                {iconOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Short description</label>
              <input
                value={edit.shortDesc}
                onChange={(e) => setEdit((f) => ({ ...f, shortDesc: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Content</label>
              <textarea
                value={edit.content}
                onChange={(e) => setEdit((f) => ({ ...f, content: e.target.value }))}
                rows={5}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">How to use (one step per line)</label>
              <textarea
                value={edit.howTo}
                onChange={(e) => setEdit((f) => ({ ...f, howTo: e.target.value }))}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving || (edit.tier === "pro" && !(Number(edit.price) > 0))}
            className="btn-glow mt-4 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}
