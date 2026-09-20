import type { ContentBlock } from "@/lib/blogBlocks";

/**
 * Renders a post's content blocks with real semantic tags — <h2>/<h3> for
 * headings, <ul>/<ol> for lists, <blockquote> for quotes, an <img> with alt
 * text, and an FAQ list. This (not a wall of <p> tags) is what actually
 * helps SEO: search engines read heading levels and FAQ structure directly.
 */
export default function BlogBlocksRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-heading/70">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return block.data.text ? <p key={block.id}>{block.data.text}</p> : null;

          case "heading": {
            const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            const sizeByLevel: Record<number, string> = {
              1: "!mt-10 text-3xl font-bold text-heading",
              2: "!mt-10 text-2xl font-bold text-heading",
              3: "!mt-8 text-xl font-bold text-heading",
              4: "!mt-6 text-lg font-bold text-heading",
              5: "!mt-6 text-base font-bold text-heading",
              6: "!mt-5 text-sm font-bold uppercase tracking-wide text-heading",
            };
            return (
              <Tag key={block.id} className={sizeByLevel[block.data.level]}>
                {block.data.text}
              </Tag>
            );
          }

          case "list": {
            const items = block.data.items.filter(Boolean);
            if (items.length === 0) return null;
            const ListTag = block.data.style === "number" ? "ol" : "ul";
            return (
              <ListTag
                key={block.id}
                className={`ml-5 space-y-1.5 ${block.data.style === "number" ? "list-decimal" : "list-disc"}`}
              >
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }

          case "quote":
            return block.data.text ? (
              <blockquote
                key={block.id}
                className="border-l-4 border-brand/40 pl-4 italic text-heading/60"
              >
                {block.data.text}
                {block.data.cite && (
                  <footer className="mt-1 text-xs not-italic text-heading/40">— {block.data.cite}</footer>
                )}
              </blockquote>
            ) : null;

          case "image":
            return block.data.src ? (
              <figure key={block.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.data.src}
                  alt={block.data.alt}
                  className="w-full rounded-2xl object-cover"
                  loading="lazy"
                />
                {block.data.caption && (
                  <figcaption className="mt-2 text-center text-xs text-heading/40">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            ) : null;

          case "faq": {
            const items = block.data.items.filter((i) => i.question.trim());
            if (items.length === 0) return null;
            return (
              <div key={block.id} className="!mt-10 space-y-4">
                <h2 className="text-2xl font-bold text-heading">Frequently Asked Questions</h2>
                <div className="divide-y divide-heading/10 rounded-2xl border border-heading/10">
                  {items.map((item, i) => (
                    <details key={i} className="group p-4 open:bg-heading/[0.015]">
                      <summary className="cursor-pointer list-none font-semibold text-heading">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-[14px] text-heading/60">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

/** Builds an FAQPage JSON-LD payload from any FAQ blocks in the post — or null if there are none. */
export function buildFaqJsonLd(blocks: ContentBlock[]) {
  const items = blocks
    .filter((b): b is Extract<ContentBlock, { type: "faq" }> => b.type === "faq")
    .flatMap((b) => b.data.items)
    .filter((i) => i.question.trim() && i.answer.trim());

  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}
