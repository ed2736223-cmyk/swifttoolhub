import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const pendingCount = await prisma.paymentRequest.count({ where: { status: "PENDING" } });

  return (
    <div className="min-h-screen bg-heading/[0.015]">
      <AdminSidebar pendingCount={pendingCount} />
      <div className="lg:pl-64">
        <AdminTopbar email={session.user.email || ""} pendingCount={pendingCount} />
        <main className="px-4 pb-16 pt-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
