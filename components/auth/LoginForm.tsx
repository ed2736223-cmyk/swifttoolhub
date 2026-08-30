"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
          Welcome Back
        </span>
        <h1 className="mt-4 text-3xl font-bold">Log In</h1>
        <p className="mt-2 text-sm text-heading/60">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-brand">
            Create a free account
          </Link>
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-3xl border border-heading/10 bg-white p-6">
        <div>
          <label className="text-xs font-semibold text-heading/50">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="you@example.com"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-semibold text-heading/50">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-warn-soft px-3 py-2 text-xs font-medium text-warn">
            <AlertCircle size={13} /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-glow mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <LogIn size={15} /> {busy ? "Signing in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
