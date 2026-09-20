"use client";

import { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Heading,
  List,
  Quote,
  ImageIcon,
  HelpCircle,
} from "lucide-react";
import {
  BLOCK_TYPES,
  BLOCK_TYPE_LABELS,
  newBlock,
  type BlockType,
  type ContentBlock,
  type HeadingLevel,
} from "@/lib/blogBlocks";

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  paragraph: Type,
  heading: Heading,
  list: List,
  quote: Quote,
  image: ImageIcon,
  faq: HelpCircle,
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function inputCls() {
  return "mt-1.5 w-full rounded-xl border border-heading/10 px-3 py-2 text-sm focus:border-brand/40 focus:outline-none";
}

export default function BlogBlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const updateBlock = (id: string, data: Partial<ContentBlock["data"]>) => {
    onChange(blocks.map((b) => (b.id === id ? ({ ...b, data: { ...b.data, ...data } } as ContentBlock) : b)));
  };

  const removeBlock = (id: string) => onChange(blocks.filter((b) => b.id !== id));

  const moveBlock = (id: string, dir: -1 | 1) => {
    const i = blocks.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addBlock = (type: BlockType) => {
    onChange([...blocks, newBlock(type)]);
    setAddMenuOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-heading/50">
          Content — headings, paragraphs, lists, images, quotes, FAQ. No length limit.
        </label>
      </div>

      <div className="mt-2 space-y-3">
        {blocks.length === 0 && (
          <p className="rounded-xl border border-dashed border-heading/15 px-3 py-4 text-center text-[12px] text-heading/40">
            No blocks yet — add a heading or paragraph to get started.
          </p>
        )}

        {blocks.map((block, i) => {
          const Icon = BLOCK_ICONS[block.type];
          return (
            <div key={block.id} className="rounded-2xl border border-heading/10 bg-heading/[0.015] p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-heading/40">
                  <Icon size={12} /> {BLOCK_TYPE_LABELS[block.type]}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(block.id, -1)}
                    disabled={i === 0}
                    className="grid h-6 w-6 place-items-center rounded-full text-heading/40 hover:bg-heading/5 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(block.id, 1)}
                    disabled={i === blocks.length - 1}
                    className="grid h-6 w-6 place-items-center rounded-full text-heading/40 hover:bg-heading/5 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="grid h-6 w-6 place-items-center rounded-full text-red-500/70 hover:bg-red-50"
                    title="Delete block"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-2">
                {block.type === "paragraph" && (
                  <textarea
                    value={block.data.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    rows={4}
                    placeholder="Write a paragraph…"
                    className={inputCls() + " leading-relaxed"}
                  />
                )}

                {block.type === "heading" && (
                  <div>
                    <div className="flex items-start gap-2">
                      <select
                        value={block.data.level}
                        onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as HeadingLevel })}
                        className="mt-1.5 rounded-xl border border-heading/10 px-2 py-2 text-sm focus:border-brand/40 focus:outline-none"
                      >
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                        <option value={5}>H5</option>
                        <option value={6}>H6</option>
                      </select>
                      <input
                        value={block.data.text}
                        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                        placeholder="Heading text"
                        className={inputCls() + " flex-1"}
                      />
                    </div>
                    {block.data.level === 1 && (
                      <p className="mt-1 text-[11px] text-amber-600">
                        The post title already renders as H1 — using another H1 in content can hurt SEO. H2/H3 is usually the right choice.
                      </p>
                    )}
                  </div>
                )}

                {block.type === "list" && (
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[12px]">
                        <input
                          type="radio"
                          checked={block.data.style === "bullet"}
                          onChange={() => updateBlock(block.id, { style: "bullet" })}
                        />
                        Bullet
                      </label>
                      <label className="flex items-center gap-1.5 text-[12px]">
                        <input
                          type="radio"
                          checked={block.data.style === "number"}
                          onChange={() => updateBlock(block.id, { style: "number" })}
                        />
                        Numbered
                      </label>
                    </div>
                    <textarea
                      value={block.data.items.join("\n")}
                      onChange={(e) => updateBlock(block.id, { items: e.target.value.split("\n") })}
                      rows={5}
                      placeholder={"One item per line"}
                      className={inputCls() + " leading-relaxed"}
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <div className="space-y-2">
                    <textarea
                      value={block.data.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      rows={3}
                      placeholder="Quote text"
                      className={inputCls()}
                    />
                    <input
                      value={block.data.cite || ""}
                      onChange={(e) => updateBlock(block.id, { cite: e.target.value })}
                      placeholder="Attribution (optional)"
                      className={inputCls()}
                    />
                  </div>
                )}

                {block.type === "image" && <ImageBlockEditor block={block} updateBlock={updateBlock} />}

                {block.type === "faq" && <FaqBlockEditor block={block} updateBlock={updateBlock} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setAddMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-heading/10 px-4 py-2 text-[13px] font-semibold text-heading/70 hover:bg-heading/5"
        >
          <Plus size={14} /> Add block
        </button>
        {addMenuOpen && (
          <div className="absolute left-0 top-full z-10 mt-1.5 w-56 rounded-xl border border-heading/10 bg-white p-1.5 shadow-lg">
            {BLOCK_TYPES.map((type) => {
              const Icon = BLOCK_ICONS[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-heading/70 hover:bg-heading/5"
                >
                  <Icon size={14} className="text-brand" /> {BLOCK_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageBlockEditor({
  block,
  updateBlock,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
  updateBlock: (id: string, data: Partial<ContentBlock["data"]>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That image is larger than 3MB — please choose a smaller one.");
      return;
    }
    updateBlock(block.id, { src: await fileToDataUrl(file) });
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed border-heading/15 bg-white px-3 py-4 text-center hover:border-brand/40"
      >
        {block.data.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.data.src} alt="" className="max-h-28 rounded-lg object-cover" />
        ) : (
          <>
            <ImageIcon size={15} className="text-brand" />
            <p className="text-[12px] font-medium text-heading">Click or drop an image</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <input
        value={block.data.alt}
        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
        placeholder="Alt text (describe the image — helps SEO & accessibility)"
        className={inputCls()}
      />
      <input
        value={block.data.caption || ""}
        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
        placeholder="Caption (optional)"
        className={inputCls()}
      />
    </div>
  );
}

function FaqBlockEditor({
  block,
  updateBlock,
}: {
  block: Extract<ContentBlock, { type: "faq" }>;
  updateBlock: (id: string, data: Partial<ContentBlock["data"]>) => void;
}) {
  const items = block.data.items;

  const setItem = (i: number, patch: Partial<{ question: string; answer: string }>) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    updateBlock(block.id, { items: next });
  };

  const addItem = () => updateBlock(block.id, { items: [...items, { question: "", answer: "" }] });
  const removeItem = (i: number) => updateBlock(block.id, { items: items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-heading/10 bg-white p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-heading/40">Q{i + 1}</span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-[11px] font-medium text-heading/40 hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>
          <input
            value={item.question}
            onChange={(e) => setItem(i, { question: e.target.value })}
            placeholder="Question"
            className={inputCls()}
          />
          <textarea
            value={item.answer}
            onChange={(e) => setItem(i, { answer: e.target.value })}
            rows={2}
            placeholder="Answer"
            className={inputCls()}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-brand"
      >
        <Plus size={13} /> Add question
      </button>
    </div>
  );
}
