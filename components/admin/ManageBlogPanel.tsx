"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Trash2,
  Pencil,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import BlogBlockEditor from "@/components/admin/BlogBlockEditor";
import BlogSeoPanel from "@/components/admin/BlogSeoPanel";
import { parseBlocks, type ContentBlock } from "@/lib/blogBlocks";

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB

type DbPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  blocks: ContentBlock[];
  metaTitle: string;
  metaDescription: string;
  coverImage: string | null;
  coverImageAlt: string;
  published: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  blocks: [],
  metaTitle: "",
  metaDescription: "",
  coverImage: null,
  coverImageAlt: "",
  published: true,
};

function autoSlug(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function CoverImagePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That image is larger than 3MB — please choose a smaller one.");
      return;
    }
    onChange(await fileToDataUrl(file));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-heading/50">Cover image (optional)</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed border-heading/15 bg-heading/[0.02] px-3 py-5 text-center transition-colors hover:border-brand/40"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Cover preview" className="max-h-32 rounded-lg object-cover" />
        ) : (
          <>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-brand">
              <ImageIcon size={15} />
            </span>
            <p className="text-[12px] font-medium text-heading">Click or drop an image</p>
            <p className="text-[10px] text-heading/40">PNG, JPG, or WEBP — up to 3MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-1.5 text-[11px] font-medium text-heading/40 hover:text-red-500"
        >
          Remove image
        </button>
      )}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

export default function ManageBlogPanel({ initialPosts }: { initialPosts: DbPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
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

  const createPost = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setPosts((prev) => [data.post, ...prev]);
      setShowForm(false);
      resetForm();
    } finally {
      setCreating(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this blog post? It will disappear from the site immediately.")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={15} /> Add Blog Post
        </button>
      ) : (
        <div className="rounded-3xl border border-heading/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">New blog post</p>
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
              <label className="text-xs font-semibold text-heading/50">Title</label>
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : autoSlug(title) }));
                }}
                placeholder="e.g. 7 Habits Of Fast IT Teams"
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
                placeholder="7-habits-of-fast-it-teams"
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-heading/40">Lives at /blog/{form.slug || "your-slug"}</p>
            </div>
            <div className="sm:col-span-2">
              <CoverImagePicker
                value={form.coverImage}
                onChange={(v) => setForm((f) => ({ ...f, coverImage: v }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Excerpt</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One line shown on the blog listing page."
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3.5 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <BlogBlockEditor blocks={form.blocks} onChange={(blocks) => setForm((f) => ({ ...f, blocks }))} />
            </div>
            <div className="sm:col-span-2">
              <BlogSeoPanel
                metaTitle={form.metaTitle}
                metaDescription={form.metaDescription}
                coverImageAlt={form.coverImageAlt}
                excerpt={form.excerpt}
                slug={form.slug}
                blocks={form.blocks}
                onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                  form.published
                    ? "border-emerald-300/50 bg-emerald-50 text-emerald-700"
                    : "border-heading/10 text-heading/50"
                }`}
              >
                {form.published ? <Eye size={14} /> : <EyeOff size={14} />}
                {form.published ? "Published — visible on /blog" : "Draft — hidden from /blog"}
              </button>
            </div>
          </div>

          <button
            onClick={createPost}
            disabled={creating || !form.title || !form.slug || !form.excerpt || form.blocks.length === 0}
            className="btn-glow mt-5 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Publish post
          </button>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-heading/40">No admin-added blog posts yet.</p>
        ) : (
          posts.map((p) => (
            <PostRow
              key={p.id}
              post={p}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
              onDelete={() => deletePost(p.id)}
              onSaved={(updated) => setPosts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostRow({
  post,
  expanded,
  onToggle,
  onDelete,
  onSaved,
}: {
  post: DbPost;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSaved: (p: DbPost) => void;
}) {
  const [edit, setEdit] = useState<FormState>({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    blocks: parseBlocks(post.content),
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt || "",
    published: post.published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: edit.title,
          excerpt: edit.excerpt,
          blocks: edit.blocks,
          metaTitle: edit.metaTitle,
          metaDescription: edit.metaDescription,
          coverImage: edit.coverImage,
          coverImageAlt: edit.coverImageAlt,
          published: edit.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      onSaved(data.post);
      onToggle();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-heading/10 bg-white">
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-brand">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={16} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-heading">{post.title}</p>
            {!post.published && (
              <span className="rounded-full bg-heading/5 px-2 py-0.5 text-[10px] font-semibold text-heading/40">
                Draft
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-heading/50">
            {post.readTime} · /blog/{post.slug}
          </p>
        </div>
        <Link
          href={`/blog/${post.slug}`}
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
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Title</label>
              <input
                value={edit.title}
                onChange={(e) => setEdit((f) => ({ ...f, title: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <CoverImagePicker
                value={edit.coverImage}
                onChange={(v) => setEdit((f) => ({ ...f, coverImage: v }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-heading/50">Excerpt</label>
              <input
                value={edit.excerpt}
                onChange={(e) => setEdit((f) => ({ ...f, excerpt: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <BlogBlockEditor blocks={edit.blocks} onChange={(blocks) => setEdit((f) => ({ ...f, blocks }))} />
            </div>
            <div className="sm:col-span-2">
              <BlogSeoPanel
                metaTitle={edit.metaTitle}
                metaDescription={edit.metaDescription}
                coverImageAlt={edit.coverImageAlt}
                excerpt={edit.excerpt}
                slug={edit.slug}
                blocks={edit.blocks}
                onChange={(patch) => setEdit((f) => ({ ...f, ...patch }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setEdit((f) => ({ ...f, published: !f.published }))}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                  edit.published
                    ? "border-emerald-300/50 bg-emerald-50 text-emerald-700"
                    : "border-heading/10 text-heading/50"
                }`}
              >
                {edit.published ? <Eye size={14} /> : <EyeOff size={14} />}
                {edit.published ? "Published — visible on /blog" : "Draft — hidden from /blog"}
              </button>
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving || !edit.title || !edit.excerpt || edit.blocks.length === 0}
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
