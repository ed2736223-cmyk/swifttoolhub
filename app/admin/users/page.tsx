import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";
import { Users, Crown, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Users",
  description: "See and manage every SwiftToolHub user's plan and role.",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      createdAt: true,
      _count: { select: { paymentRequests: true } },
    },
  });

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    plan: u.plan as "FREE" | "PRO",
    role: u.role as "USER" | "ADMIN",
    createdAt: u.createdAt.toISOString(),
    paymentRequestCount: u._count.paymentRequests,
  }));

  const proCount = serialized.filter((u) => u.plan === "PRO").length;
  const adminCount = serialized.filter((u) => u.role === "ADMIN").length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-heading">Users</h1>
      <p className="mt-1 text-sm text-heading/60">
        Every account on SwiftToolHub — search, and adjust plan or role directly when needed.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-heading/5 text-heading/50">
            <Users size={14} />
          </span>
          <p className="mt-2 text-xl font-bold text-heading">{serialized.length}</p>
          <p className="text-[11px] text-heading/50">Total Users</p>
        </div>
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
            <Crown size={14} />
          </span>
          <p className="mt-2 text-xl font-bold text-heading">{proCount}</p>
          <p className="text-[11px] text-heading/50">Pro Users</p>
        </div>
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-heading/5 text-heading/50">
            <ShieldCheck size={14} />
          </span>
          <p className="mt-2 text-xl font-bold text-heading">{adminCount}</p>
          <p className="text-[11px] text-heading/50">Admins</p>
        </div>
      </div>

      <div className="mt-8">
        <UsersTable initialUsers={serialized} currentUserId={session?.user.id || ""} />
      </div>
    </div>
  );
}
