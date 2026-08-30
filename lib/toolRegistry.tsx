import type { ComponentType } from "react";

/**
 * How admin-added tools get REAL functionality, safely.
 *
 * The admin panel (Admin → Manage Tools) lets anyone with admin access add a
 * tool's name, description, category, price and how-to steps — no code
 * involved, so it's safe for anyone to use. That alone only produces a
 * content page (see app/tools/[slug]/page.tsx), because letting the admin
 * panel itself execute arbitrary submitted code would mean a mistake (or a
 * compromised admin login) could run in every visitor's browser — a
 * site-wide security hole. That risk isn't worth it.
 *
 * Instead, a developer builds the actual interactive tool as a normal React
 * component (e.g. an image compressor, a calculator) and registers it here
 * by the same slug the admin used when creating the tool. Nothing here ever
 * comes from a database value — every entry is a real file, reviewed and
 * committed like any other code change.
 *
 * To wire up a new tool's real functionality:
 *   1. Build the component, e.g. components/tools/ImageCompressorTool.tsx
 *      ("use client" if it needs interactivity, which most do).
 *   2. Import it below and add it to TOOL_COMPONENTS, keyed by the exact
 *      slug used for that tool in the admin panel.
 *   3. That's it — app/tools/[slug]/page.tsx automatically renders it
 *      instead of the "coming soon" placeholder, and the page becomes
 *      indexable (see generateMetadata in that file).
 *
 * Example (once a real component exists):
 *   import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
 *   export const TOOL_COMPONENTS: Record<string, ComponentType> = {
 *     "image-compressor-v2": ImageCompressorTool,
 *   };
 */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  // Empty for now — add entries here as real tools are built.
};

export function getToolComponent(slug: string): ComponentType | null {
  return TOOL_COMPONENTS[slug] ?? null;
}
