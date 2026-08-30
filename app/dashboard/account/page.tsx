import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountForm from "@/components/dashboard/AccountForm";
import { Mail, Crown, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your SwiftToolHub account details.",
};

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const isPro = session?.user.plan === "PRO";

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true, bio: true } })
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-heading">Account Settings</h1>
      <p className="mt-1 text-sm text-heading/50">Your account details and plan.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <Mail size={15} />
          </span>
          <p className="mt-2 truncate text-[13px] font-semibold text-heading">{session?.user.email}</p>
          <p className="text-[11px] text-heading/40">Email</p>
        </div>
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <Crown size={15} />
          </span>
          <p className="mt-2 text-[13px] font-semibold text-heading">{isPro ? "Pro" : "Free"}</p>
          <p className="text-[11px] text-heading/40">Plan</p>
        </div>
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
            <CalendarDays size={15} />
          </span>
          <p className="mt-2 text-[13px] font-semibold text-heading">
            {dbUser?.createdAt
              ? new Date(dbUser.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
              : "—"}
          </p>
          <p className="text-[11px] text-heading/40">Member since</p>
        </div>
      </div>

      <div className="mt-6">
        <AccountForm initialName={session?.user.name || ""} initialBio={dbUser?.bio || ""} />
      </div>
    </div>
  );
}
