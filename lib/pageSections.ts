// A small, fixed set of typed content blocks. Every CMS-managed page
// (About, Contact, Privacy Policy, Terms — see app/<slug>/page.tsx) is just
// an ordered list of these. Because each type has a defined shape, the admin
// editor can render a proper form for it (not a raw HTML box), and the
// public page can render it consistently — "type banao taake automatically
// update ho" from the brief this implements.

export type HeroSectionData = {
  badge?: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type RichTextSectionData = {
  heading?: string;
  // Paragraphs, one per line. Kept intentionally simple (no raw HTML) so
  // admins can't break layout or inject scripts through the editor.
  body: string;
};

export type FeatureItem = { title: string; desc: string };
export type FeaturesSectionData = {
  heading?: string;
  items: FeatureItem[];
};

export type FaqItem = { question: string; answer: string };
export type FaqSectionData = {
  heading?: string;
  items: FaqItem[];
};

export type CtaSectionData = {
  heading: string;
  subheading?: string;
  buttonLabel: string;
  buttonHref: string;
};

export type ContactInfoSectionData = {
  heading?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};

export type Section =
  | { id: string; type: "hero"; data: HeroSectionData }
  | { id: string; type: "richtext"; data: RichTextSectionData }
  | { id: string; type: "features"; data: FeaturesSectionData }
  | { id: string; type: "faq"; data: FaqSectionData }
  | { id: string; type: "cta"; data: CtaSectionData }
  | { id: string; type: "contactInfo"; data: ContactInfoSectionData };

export type SectionType = Section["type"];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero (title + intro)",
  richtext: "Text Block",
  features: "Feature Cards",
  faq: "FAQ List",
  cta: "Call To Action",
  contactInfo: "Contact Info",
};

export const SECTION_TYPES = Object.keys(SECTION_TYPE_LABELS) as SectionType[];

export function defaultSectionData(type: SectionType): Section["data"] {
  switch (type) {
    case "hero":
      return { badge: "", heading: "New Section Heading", subheading: "", ctaLabel: "", ctaHref: "" };
    case "richtext":
      return { heading: "", body: "Write this section's content here." };
    case "features":
      return { heading: "", items: [{ title: "Feature title", desc: "Feature description." }] };
    case "faq":
      return { heading: "", items: [{ question: "Question?", answer: "Answer." }] };
    case "cta":
      return { heading: "Ready to get started?", subheading: "", buttonLabel: "Get Started", buttonHref: "/" };
    case "contactInfo":
      return { heading: "", email: "", phone: "", address: "", note: "" };
  }
}

export function newSection(type: SectionType): Section {
  return { id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, type, data: defaultSectionData(type) } as Section;
}

export function parseSections(raw: string): Section[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeSections(sections: Section[]): string {
  return JSON.stringify(sections);
}
