// A small, fixed set of typed content blocks for blog posts — same idea as
// lib/pageSections.ts, applied to /blog. Because each block has a defined
// shape, the admin editor renders a proper form per block (a real "Heading"
// field that becomes a real <h2>/<h3>, a real "FAQ" block that becomes a
// real accordion + FAQPage schema) instead of one big free-text box, and
// the public post page renders every block consistently and semantically —
// which is what actually helps SEO (real heading tags, not bold paragraphs).
//
// No block count or word count limit is enforced anywhere in this file —
// posts can be as long as the admin wants; see calcSeoScore() for the (non-
// blocking) length guidance shown in the editor instead.

export type ParagraphBlockData = { text: string };
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingBlockData = { level: HeadingLevel; text: string };
export type ListBlockData = { style: "bullet" | "number"; items: string[] };
export type QuoteBlockData = { text: string; cite?: string };
export type ImageBlockData = { src: string; alt: string; caption?: string };
export type FaqItem = { question: string; answer: string };
export type FaqBlockData = { items: FaqItem[] };

export type ContentBlock =
  | { id: string; type: "paragraph"; data: ParagraphBlockData }
  | { id: string; type: "heading"; data: HeadingBlockData }
  | { id: string; type: "list"; data: ListBlockData }
  | { id: string; type: "quote"; data: QuoteBlockData }
  | { id: string; type: "image"; data: ImageBlockData }
  | { id: string; type: "faq"; data: FaqBlockData };

export type BlockType = ContentBlock["type"];

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading (H2 / H3)",
  list: "List (bullet / numbered)",
  quote: "Quote",
  image: "Image",
  faq: "FAQ",
};

export const BLOCK_TYPES = Object.keys(BLOCK_TYPE_LABELS) as BlockType[];

function newId() {
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultBlockData(type: BlockType): ContentBlock["data"] {
  switch (type) {
    case "paragraph":
      return { text: "" };
    case "heading":
      return { level: 2, text: "" };
    case "list":
      return { style: "bullet", items: [""] };
    case "quote":
      return { text: "", cite: "" };
    case "image":
      return { src: "", alt: "", caption: "" };
    case "faq":
      return { items: [{ question: "", answer: "" }] };
  }
}

export function newBlock(type: BlockType): ContentBlock {
  return { id: newId(), type, data: defaultBlockData(type) } as ContentBlock;
}

/**
 * Parses stored `content` into blocks. Handles two shapes:
 *  - current: a JSON-encoded ContentBlock[]
 *  - legacy: plain text, paragraphs separated by a blank line (how posts
 *    were stored before this block editor existed) — auto-upgraded into
 *    paragraph blocks so old posts keep working with no migration step.
 */
export function parseBlocks(raw: string): ContentBlock[] {
  const trimmed = (raw || "").trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.every((b) => b && typeof b === "object" && "type" in b)) {
      return parsed as ContentBlock[];
    }
  } catch {
    // not JSON — fall through to legacy plain-text handling
  }
  return trimmed
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ id: newId(), type: "paragraph", data: { text } } as ContentBlock));
}

export function serializeBlocks(blocks: ContentBlock[]): string {
  return JSON.stringify(blocks);
}

/** Every block's text, flattened — used for word count, read time, and SEO checks. */
export function blocksToPlainText(blocks: ContentBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "paragraph") parts.push(b.data.text);
    else if (b.type === "heading") parts.push(b.data.text);
    else if (b.type === "list") parts.push(...b.data.items);
    else if (b.type === "quote") parts.push(b.data.text);
    else if (b.type === "image") parts.push(b.data.caption || "");
    else if (b.type === "faq") b.data.items.forEach((i) => parts.push(i.question, i.answer));
  }
  return parts.filter(Boolean).join(" ");
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(text: string): string {
  const minutes = Math.max(1, Math.round(wordCount(text) / 200));
  return `${minutes} min read`;
}

/** True if a block has no real content yet (used to skip empty blocks on save). */
export function isBlockEmpty(b: ContentBlock): boolean {
  switch (b.type) {
    case "paragraph":
      return !b.data.text.trim();
    case "heading":
      return !b.data.text.trim();
    case "list":
      return b.data.items.every((i) => !i.trim());
    case "quote":
      return !b.data.text.trim();
    case "image":
      return !b.data.src.trim();
    case "faq":
      return b.data.items.every((i) => !i.question.trim() && !i.answer.trim());
  }
}

// ---------------------------------------------------------------------------
// SEO score — an on-page, Yoast-style checklist. Purely advisory: nothing
// here blocks publishing, it just tells the admin what to improve.
// ---------------------------------------------------------------------------

export type SeoCheck = { id: string; label: string; pass: boolean; hint: string };
export type SeoScore = { score: number; grade: "Good" | "OK" | "Needs work"; checks: SeoCheck[] };

export function calcSeoScore(input: {
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  blocks: ContentBlock[];
}): SeoScore {
  const { metaTitle, metaDescription, excerpt, slug, blocks } = input;
  const plainText = blocksToPlainText(blocks);
  const words = wordCount(plainText);
  const hasH2 = blocks.some((b) => b.type === "heading" && b.data.level === 2 && b.data.text.trim());
  const hasImage = blocks.some((b) => b.type === "image" && b.data.src.trim());
  const imagesHaveAlt = blocks
    .filter((b) => b.type === "image" && b.data.src.trim())
    .every((b) => b.type === "image" && b.data.alt.trim());
  const hasFaq = blocks.some((b) => b.type === "faq" && b.data.items.some((i) => i.question.trim()));

  const checks: SeoCheck[] = [
    {
      id: "metaTitle",
      label: "SEO title is 30–60 characters",
      pass: metaTitle.trim().length >= 30 && metaTitle.trim().length <= 60,
      hint: "Google usually truncates titles past ~60 characters.",
    },
    {
      id: "metaDescription",
      label: "Meta description is 120–160 characters",
      pass: metaDescription.trim().length >= 120 && metaDescription.trim().length <= 160,
      hint: "Short descriptions waste space; long ones get cut off in search results.",
    },
    {
      id: "excerpt",
      label: "Excerpt is filled in",
      pass: excerpt.trim().length > 0,
      hint: "Shown on the blog listing page and used as a fallback description.",
    },
    {
      id: "slug",
      label: "Slug is short and readable",
      pass: slug.trim().length > 0 && slug.trim().length <= 75,
      hint: "Keep URLs short and use the target keyword, not filler words.",
    },
    {
      id: "h2",
      label: "Has at least one H2 heading",
      pass: hasH2,
      hint: "Headings break up the article and help both readers and search engines scan it.",
    },
    {
      id: "length",
      label: "Content is at least ~600 words",
      pass: words >= 600,
      hint: `Currently ${words} words. Longer, in-depth posts tend to rank better — no hard limit here.`,
    },
    {
      id: "image",
      label: "Has an image with alt text",
      pass: hasImage && imagesHaveAlt,
      hint: hasImage ? "Add alt text describing the image." : "A relevant image improves engagement and image search.",
    },
    {
      id: "faq",
      label: "Has an FAQ section (bonus)",
      pass: hasFaq,
      hint: "FAQ blocks can show up as rich results in Google search.",
    },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  const grade: SeoScore["grade"] = score >= 80 ? "Good" : score >= 50 ? "OK" : "Needs work";
  return { score, grade, checks };
}
