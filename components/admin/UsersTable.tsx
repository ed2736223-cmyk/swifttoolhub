"use client";

import { useState } from "react";
import { Search, Crown, ShieldCheck, Loader2, Mail } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  plan: "FREE" | "PRO";
  role: "USER" | "ADMIN";
  createdAt: string;
  paymentRequestCount: number;
};

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source.slice(0, 2).toUpperCase();
}

export default function UsersTable({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = users.filter((u) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return u.email.toLowerCase().includes(q) || (u.name || "").toLowerCase().includes(q);
  });

  const update = async (id: string, body: { plan?: string; role?: string }) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="relative sm:max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-heading/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full rounded-full border border-heading/10 bg-white py-2.5 pl-9 pr-4 text-xs text-heading placeholder:text-heading/35 focus:border-brand/40 focus:outline-none"
        />
      </div>

      {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-3xl border border-heading/10 bg-white">
        <div className="hidden grid-cols-12 gap-2 border-b border-heading/10 bg-heading/[0.02] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-heading/40 sm:grid">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1 text-center">Requests</div>
          <div className="col-span-2 text-center">Plan</div>
          <div className="col-span-3 text-center">Role</div>
        </div>

        {visible.length === 0 ? (
          <div className="p-10 text-center text-sm text-heading/40">No matching users.</div>
        ) : (
          visible.map((u) => {
            const isSelf = u.id === currentUserId;
            const busy = busyId === u.id;
            return (
              <div
                key={u.id}
                className="grid grid-cols-2 items-center gap-3 border-b border-heading/5 px-5 py-3.5 last:border-0 sm:grid-cols-12"
              >
                <div className="col-span-2 flex items-center gap-2.5 sm:col-span-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                    {initials(u.name, u.email)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-heading">
                      {u.name || "Unnamed"} {isSelf && <span className="text-heading/30">(you)</span>}
                    </p>
                    <p className="flex items-center gap-1 truncate text-[11.5px] text-heading/50">
                      <Mail size={10} /> {u.email}
                    </p>
                  </div>
                </div>

                <div className="hidden text-[12px] text-heading/50 sm:col-span-2 sm:block">
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>

                <div className="hidden text-center text-[12px] text-heading/50 sm:col-span-1 sm:block">
                  {u.paymentRequestCount}
                </div>

                <div className="col-span-1 flex justify-center sm:col-span-2">
                  <button
                    onClick={() => update(u.id, { plan: u.plan === "PRO" ? "FREE" : "PRO" })}
                    disabled={busy}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                      u.plan === "PRO"
                        ? "bg-brand-gradient text-white"
                        : "bg-heading/5 text-heading/50 hover:bg-heading/10"
                    }`}
                  >
                    {busy ? <Loader2 size={11} className="animate-spin" /> : <Crown size={11} />}
                    {u.plan}
                  </button>
                </div>

                <div className="col-span-1 flex justify-center sm:col-span-3">
                  <button
                    onClick={() => update(u.id, { role: u.role === "ADMIN" ? "USER" : "ADMIN" })}
                    disabled={busy || isSelf}
                    title={isSelf ? "You can't change your own role" : undefined}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      u.role === "ADMIN"
                        ? "bg-heading text-white"
                        : "bg-heading/5 text-heading/50 hover:bg-heading/10"
                    }`}
                  >
                    {busy ? <Loader2 size={11} className="animate-spin" /> : <ShieldCheck size={11} />}
                    {u.role}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
