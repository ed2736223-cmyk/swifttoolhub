import { prisma } from "@/lib/prisma";
import { parseSections, serializeSections, type Section } from "@/lib/pageSections";

export type PageStatus = "DRAFT" | "READY";

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  status: PageStatus;
  sections: Section[];
  updatedAt: Date;
  createdAt: Date;
};

// Slugs the site actually renders as CMS pages (app/<slug>/page.tsx reads
// these). Anything else an admin creates in /admin/pages is still honored
// by robots()/sitemap() below for indexing control, even without a matching
// page component.
export const CMS_MANAGED_SLUGS = ["about", "contact", "privacy-policy", "terms-of-service"] as const;

export async function getPage(slug: string): Promise<PageRecord | null> {
  const row = await prisma.page.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaDescription: row.metaDescription,
    status: row.status === "READY" ? "READY" : "DRAFT",
    sections: parseSections(row.sections),
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  };
}

export async function listPages(): Promise<PageRecord[]> {
  const rows = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaDescription: row.metaDescription,
    status: row.status === "READY" ? "READY" : "DRAFT",
    sections: parseSections(row.sections),
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  }));
}

export async function upsertPage(input: {
  slug: string;
  title: string;
  metaDescription: string;
  status: PageStatus;
  sections: Section[];
}) {
  return prisma.page.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      title: input.title,
      metaDescription: input.metaDescription,
      status: input.status,
      sections: serializeSections(input.sections),
    },
    update: {
      title: input.title,
      metaDescription: input.metaDescription,
      status: input.status,
      sections: serializeSections(input.sections),
    },
  });
}

/**
 * Metadata `robots` value for a CMS-managed page — noindex whenever the
 * page is missing or still a Draft, so an unfinished page never risks an
 * AdSense (or plain SEO) review. Ready pages are fully indexable.
 */
export function robotsFor(page: PageRecord | null) {
  const indexable = page?.status === "READY";
  return { index: indexable, follow: indexable };
}
