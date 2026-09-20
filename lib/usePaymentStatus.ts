"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type PaymentKind = "PRO" | "BUNDLE10" | "TOOL";
export type PaymentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentRequestInfo = {
  id: string;
  status: PaymentRequestStatus;
  note: string | null;
  createdAt: string;
  reviewedAt: string | null;
  kind: PaymentKind;
  toolSlugs: string[];
  amount: number;
} | null;

/**
 * Tracks the signed-in user's access status (All-Access plan, individually
 * unlocked tools) plus — for the given `kind` — the latest payment request
 * of that kind, so a page can show "pending review" instead of the upload
 * form.
 */
export function usePaymentStatus(opts?: { kind?: PaymentKind; toolSlug?: string }) {
  const { status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<PaymentRequestInfo>(null);
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE");
  const [unlockedTools, setUnlockedTools] = useState<string[]>([]);

  const kind = opts?.kind ?? "PRO";
  const toolSlug = opts?.toolSlug;

  const refresh = useCallback(async () => {
    if (sessionStatus !== "authenticated") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ kind });
      if (toolSlug) params.set("toolSlug", toolSlug);
      const res = await fetch(`/api/payment-request?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequest(data.request ?? null);
        setPlan(data.plan ?? "FREE");
        setUnlockedTools(Array.isArray(data.unlockedTools) ? data.unlockedTools : []);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionStatus, kind, toolSlug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, request, refresh, plan, unlockedTools };
}
