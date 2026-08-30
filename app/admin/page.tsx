import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { tools } from "@/lib/tools";
import {
  Wrench,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  Receipt,
  ShieldCheck,
  ArrowUpRight,
  AlertTriangle,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Overview",
  description: "SwiftToolHub admin dashboard overview.",
};

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminOverviewPage() {
  const [totalUsers, proUsers, pendingCount, totalUsage, recentRequests, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.paymentRequest.count({ where: { status: "PENDING" } }),
      prisma.toolUsage.aggregate({ _sum: { count: true } }),
      prisma.paymentRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { name: true, email: true, plan: true, createdAt: true },
      }),
    ]);

  const stats = [
    { label: "Total Tools", value: tools.length, icon: Wrench, tone: "bg-brand-soft text-brand" },
    { label: "Total Users", value: totalUsers, icon: Users, tone: "bg-heading/5 text-heading/60" },
    {
      label: "Tool Runs",
      value: totalUsage._sum.count ?? 0,
      icon: Activity,
      tone: "bg-emerald-400/15 text-emerald-600",
    },
    { label: "Pro Users", value: proUsers, icon: ShieldCheck, tone: "bg-brand-gradient text-white" },
  ];

  // Merge the two most recent activity streams (payment requests + signups) into one feed.
  const activity = [
    ...recentRequests.map((r) => ({
      id: `req-${r.id}`,
      time: r.createdAt,
      user: r.user.name || r.user.email,
      action: "Submitted payment screenshot",
      status: r.status,
    })),
    ...recentUsers.map((u) => ({
      id: `user-${u.email}`,
      time: u.createdAt,
      user: u.name || u.email,
      action: "Created an account",
      status: u.plan === "PRO" ? "APPROVED" : "SIGNUP",
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 6);

  const statusBadge = (status: string) => {
    if (status === "PENDING")
      return "bg-amber-50 text-amber-600";
    if (status === "APPROVED")
      return "bg-emerald-50 text-emerald-600";
    if (status === "REJECTED")
      return "bg-red-50 text-red-500";
    return "bg-heading/5 text-heading/50";
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-heading">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-heading/50">SwiftToolHub — tools, users & payments at a glance</p>
        </div>
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 size={13} /> System Operational
        </span>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-heading/10 bg-white p-4 shadow-sm">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.tone}`}>
              <s.icon size={16} />
            </span>
            <p className="mt-3 text-2xl font-bold text-heading">{s.value}</p>
            <p className="text-[11.5px] font-medium text-heading/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="rounded-3xl border border-heading/10 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">Recent Activity</p>
            <Link href="/admin/payments" className="flex items-center gap-1 text-[12px] font-medium text-brand">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-heading/35">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Action</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {activity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-heading/40">
                      No activity yet.
                    </td>
                  </tr>
                ) : (
                  activity.map((a) => (
                    <tr key={a.id} className="border-t border-heading/5">
                      <td className="py-2.5 pr-2 font-medium text-heading">{a.user}</td>
                      <td className="py-2.5 pr-2 text-heading/60">{a.action}</td>
                      <td className="py-2.5 pr-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadge(a.status)}`}>
                          {a.status === "SIGNUP" ? "New" : a.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-heading/40">{timeAgo(a.time)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions + alerts */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-heading/10 bg-white p-5">
            <p className="text-sm font-semibold text-heading">Quick Actions</p>
            <div className="mt-3 space-y-2">
              <Link
                href="/admin/payments"
                className="flex items-center gap-2.5 rounded-xl bg-heading/[0.03] px-3 py-2.5 text-[13px] font-medium text-heading/70 transition-colors hover:bg-brand-soft hover:text-brand"
              >
                <Receipt size={15} /> Review Payment Requests
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-2.5 rounded-xl bg-heading/[0.03] px-3 py-2.5 text-[13px] font-medium text-heading/70 transition-colors hover:bg-brand-soft hover:text-brand"
              >
                <UserPlus size={15} /> Manage Users
              </Link>
              <Link
                href="/admin/tools"
                className="flex items-center gap-2.5 rounded-xl bg-heading/[0.03] px-3 py-2.5 text-[13px] font-medium text-heading/70 transition-colors hover:bg-brand-soft hover:text-brand"
              >
                <Wrench size={15} /> View Tool Usage
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-heading/10 bg-white p-5">
            <p className="text-sm font-semibold text-heading">System Alerts</p>
            <div className="mt-3 space-y-2">
              {pendingCount > 0 ? (
                <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 px-3 py-2.5 text-[12.5px] font-medium text-amber-700">
                  <Clock size={14} /> {pendingCount} payment{pendingCount > 1 ? "s" : ""} awaiting review
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-[12.5px] font-medium text-emerald-700">
                  <CheckCircle2 size={14} /> No pending reviews
                </div>
              )}
              {totalUsers === 0 && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 px-3 py-2.5 text-[12.5px] font-medium text-red-600">
                  <AlertTriangle size={14} /> No users yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
