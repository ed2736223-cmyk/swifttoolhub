import type { Metadata } from "next";
import { listDbTools } from "@/lib/dynamicTools";
import { ICON_NAMES } from "@/lib/iconMap";
import ManageToolsPanel from "@/components/admin/ManageToolsPanel";

export const metadata: Metadata = {
  title: "Admin — Manage Tools",
  description: "Add new tools or edit existing tool content, no code deploy needed.",
};

export default async function ManageToolsPage() {
  const dbTools = await listDbTools();

  const serialized = dbTools.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Manage Tools</h1>
      <p className="mt-1 max-w-xl text-sm text-heading/50">
        Add a new tool here and it shows up instantly on the dashboard, the tools listing page and
        its own tool page — no deploy needed. Built-in tools (with real working widgets) aren&apos;t
        listed here; edit those in <code className="text-[12px]">lib/tools.ts</code>.
      </p>

      <div className="mt-6">
        <ManageToolsPanel initialTools={serialized} iconOptions={ICON_NAMES} />
      </div>
    </div>
  );
}
