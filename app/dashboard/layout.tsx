import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import SidebarBundlePromo from "@/components/dashboard/SidebarBundlePromo";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/dashboard");

  const name = session.user.name || session.user.email?.split("@")[0] || "there";
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-heading/[0.015]">
      <DashboardSidebar isAdmin={isAdmin} />
      <SidebarBundlePromo />
      <div className="lg:pl-64">
        <DashboardTopbar name={name} isAdmin={isAdmin} />
        <main className="px-4 pb-16 pt-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
