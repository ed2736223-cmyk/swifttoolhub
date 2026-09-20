"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "SwiftToolHub visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@swifttoolhub.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-heading/10 bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-heading/50">Your Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Your Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-heading/10 bg-brand-softer px-4 py-2.5 text-sm outline-none focus:border-brand/50"
            placeholder="jane@example.com"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs font-semibold text-heading/50">Message</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="mt-1.5 w-full resize-y rounded-xl border border-heading/10 bg-brand-softer px-4 py-3 text-sm outline-none focus:border-brand/50"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        className="btn-glow mt-5 flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white"
      >
        <Send size={14} /> Send Message
      </button>
      <p className="mt-2 text-[11px] text-heading/40">
        This opens your email app with the message pre-filled to hello@swifttoolhub.com.
      </p>
    </form>
  );
}
