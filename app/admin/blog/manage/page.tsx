import type { Metadata } from "next";
import { listDbPosts } from "@/lib/dynamicBlog";
import ManageBlogPanel from "@/components/admin/ManageBlogPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Manage Blog",
  description: "Add new blog posts or edit existing ones, no code deploy needed.",
};

export default async function ManageBlogPage() {
  const dbPosts = await listDbPosts();

  const serialized = dbPosts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Manage Blog</h1>
      <p className="mt-1 max-w-xl text-sm text-heading/50">
        Add a new blog post here and it shows up instantly on the blog listing and its own page — no
        deploy needed. The three original posts aren&apos;t listed here; edit those in{" "}
        <code className="text-[12px]">lib/blog.ts</code>.
      </p>

      <div className="mt-6">
        <ManageBlogPanel initialPosts={serialized} />
      </div>
    </div>
  );
}
