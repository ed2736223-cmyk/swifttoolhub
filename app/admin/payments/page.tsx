import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminPaymentRequests from "@/components/admin/AdminPaymentRequests";
import { Clock, CheckCircle2, XCircle, DollarSign, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Payment Requests",
  description: "Review and approve Pro payment screenshots.",
};

export default async function AdminPaymentsPage() {
  const [requests, totalUsers, proUsers] = await Promise.all([
    prisma.paymentRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, plan: true } },
        reviewedBy: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
  ]);

  const serialized = requests.map((r) => ({
    id: r.id,
    status: r.status as "PENDING" | "APPROVED" | "REJECTED",
    kind: r.kind as "PRO" | "BUNDLE10",
    toolSlugs: r.toolSlugs ? (JSON.parse(r.toolSlugs) as string[]) : [],
    amount: r.amount,
    screenshot: r.screenshot,
    note: r.note,
    createdAt: r.createdAt.toISOString(),
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
    user: r.user,
    reviewedBy: r.reviewedBy,
  }));

  const pendingCount = serialized.filter((r) => r.status === "PENDING").length;
  const approvedCount = serialized.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = serialized.filter((r) => r.status === "REJECTED").length;
  const totalRevenue = serialized
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + r.amount, 0);

  const stats = [
    {
      label: "Awaiting Review",
      value: pendingCount,
      icon: Clock,
      tone: "bg-amber-400/15 text-amber-600",
      hint: pendingCount > 0 ? "Needs your attention" : "All caught up",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      tone: "bg-emerald-400/15 text-emerald-600",
      hint: "Total approvals",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      tone: "bg-red-400/15 text-red-500",
      hint: "Not verified",
    },
    {
      label: "All-Access Users",
      value: proUsers,
      icon: Users,
      tone: "bg-brand-soft text-brand",
      hint: `of ${totalUsers} total users`,
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      tone: "bg-brand-gradient text-white",
      hint: `From ${approvedCount} approved request${approvedCount === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-heading">Payment Requests</h1>
      <p className="mt-1 text-sm text-heading/60">
        Review each screenshot, then approve or reject. Approving grants exactly what was paid for —
        the picked tools for a Bundle-10 request, or full All-Access for a Pro request.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-heading/10 bg-white p-4 shadow-sm">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.tone}`}>
              <s.icon size={16} />
            </span>
            <p className="mt-3 text-2xl font-bold text-heading">{s.value}</p>
            <p className="text-[11.5px] font-medium text-heading/50">{s.label}</p>
            <p className="mt-0.5 text-[10.5px] text-heading/35">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <AdminPaymentRequests initialRequests={serialized} />
      </div>
    </div>
  );
}
