"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Check, UserCog } from "lucide-react";

export default function AccountForm({
  initialName,
  initialBio = "",
}: {
  initialName: string;
  initialBio?: string;
}) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = name !== initialName || bio !== initialBio;

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      await update({ name: data.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-heading/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
          <UserCog size={16} />
        </span>
        <p className="text-sm font-semibold text-heading">Profile</p>
      </div>

      {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-heading/50">Display name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="mt-1.5 w-full rounded-xl border border-heading/10 px-4 py-2.5 text-sm focus:border-brand/40 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-heading/50">Bio (optional)</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="A short line about you — shown nowhere publicly yet, just saved to your account."
            className="mt-1.5 w-full resize-none rounded-xl border border-heading/10 px-4 py-2.5 text-sm placeholder:text-heading/30 focus:border-brand/40 focus:outline-none"
          />
          <span className="mt-1 block text-right text-[10.5px] text-heading/30">{bio.length}/200</span>
        </label>

        <button
          onClick={save}
          disabled={saving || !name.trim() || !dirty}
          className="btn-glow flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
