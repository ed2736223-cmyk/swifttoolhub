"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle, Check } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setBusy(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
          Get Started
        </span>
        <h1 className="mt-4 text-3xl font-bold">Create Your Free Account</h1>
        <p className="mt-2 text-sm text-heading/60">
          Already have one?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-heading/50">
        {["No usage limits", "Unlock every free tool", "Upgrade to Pro anytime"].map((f) => (
          <span key={f} className="flex items-center gap-1">
            <Check size={12} className="text-brand" /> {f}
          </span>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 rounded-3xl border border-heading/10 bg-white p-6">
        <div>
          <label className="text-xs font-semibold text-heading/50">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="Jane Doe"
          />
        </div>
        <div className="mt-4">
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="At least 8 characters"
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
          <UserPlus size={15} /> {busy ? "Creating account…" : "Create Free Account"}
        </button>
        <p className="mt-3 text-center text-[11px] text-heading/40">
          By signing up you agree to our{" "}
          <Link href="/terms-of-service" className="underline">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
