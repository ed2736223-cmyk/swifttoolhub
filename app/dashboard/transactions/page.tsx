import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAnyTool } from "@/lib/dynamicTools";
import { Clock, CheckCircle2, XCircle, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Transaction History",
  description: "Your past payment submissions — All-Access, or the Any-10 Tools bundle.",
};

const STATUS_STYLE: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  PENDING: { label: "Pending review", icon: Clock, className: "bg-amber-50 text-amber-700" },
  APPROVED: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-600" },
};

export default async function TransactionHistoryPage() {
  const session = await getServerSession(authOptions);

  const requests = session?.user?.id
    ? await prisma.paymentRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          note: true,
          createdAt: true,
          reviewedAt: true,
          kind: true,
          toolSlugs: true,
          amount: true,
        },
      })
    : [];

  const rows = await Promise.all(
    requests.map(async (r) => {
      let label = "All-Access (unlimited, ad-free)";
      if (r.kind === "BUNDLE10" && r.toolSlugs) {
        const slugs: string[] = JSON.parse(r.toolSlugs);
        const names = await Promise.all(
          slugs.map(async (slug) => {
            const tool = await getAnyTool(slug);
            return tool ? tool.name : slug;
          })
        );
        label = `Any-10 Bundle: ${names.join(", ")}`;
      } else if (r.kind === "TOOL" && r.toolSlugs) {
        const [slug] = JSON.parse(r.toolSlugs) as string[];
        const tool = slug ? await getAnyTool(slug) : null;
        label = `Single tool: ${tool ? tool.name : slug}`;
      }
      return { ...r, label };
    })
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-heading">Transaction History</h1>
      <p className="mt-1 text-sm text-heading/50">Every payment you&apos;ve submitted, for anything on SwiftToolHub.</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-heading/10 bg-white">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-14 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-heading/5 text-heading/30">
              <Receipt size={18} />
            </span>
            <p className="text-sm font-medium text-heading/50">No transactions yet.</p>
          </div>
        ) : (
          rows.map((r) => {
            const s = STATUS_STYLE[r.status] || STATUS_STYLE.PENDING;
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-heading/5 px-5 py-4 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {r.label} <span className="font-normal text-heading/40">· ${r.amount}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-heading/45">
                    Submitted {new Date(r.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {r.reviewedAt &&
                      ` · Reviewed ${new Date(r.reviewedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}`}
                  </p>
                  {r.note && <p className="mt-1 text-[12px] italic text-heading/40">&ldquo;{r.note}&rdquo;</p>}
                </div>
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${s.className}`}>
                  <s.icon size={12} /> {s.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
