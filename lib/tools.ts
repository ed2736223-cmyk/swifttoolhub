import {
  FileJson,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Type,
  Ruler,
  Palette,
  AlignLeft,
  Image as ImageIcon,
  Link2,
  FileCode,
  FileSpreadsheet,
  GitCompare,
  Hash as HashIcon,
  Clock,
  Dices,
  Tags,
  Percent,
  HeartPulse,
  Cake,
  ListOrdered,
  FileImage,
  AppWindow,
  type LucideIcon,
} from "lucide-react";

export type Tier = "free" | "pro";

export type Tool = {
  slug: string;
  name: string;
  shortDesc: string;
  category: "Convert" | "Generate" | "Check" | "Develop";
  icon: LucideIcon;
  tier: Tier;
  // One-time unlock price in USD. Only meaningful for tier "pro" — every
  // Pro tool has its own price instead of one flat plan.
  price?: number;
  // Present only on tools added from the admin panel (see lib/dynamicTools.ts).
  // Built-in tools below never set this.
  dynamic?: boolean;
};

export const tools: Tool[] = [
  // --- original 10 ---
  {
    slug: "image-to-pdf",
    name: "Image to PDF Converter",
    shortDesc: "Convert JPG or PNG images into a single PDF file quickly and easily.",
    category: "Convert",
    icon: ImageIcon,
    tier: "pro",
    price: 5,
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    shortDesc: "Track word, character, sentence, and reading-time counts instantly as you type or paste your text.",
    category: "Check",
    icon: AlignLeft,
    tier: "free",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortDesc: "Create a downloadable QR code from any link or text quickly and easily.",
    category: "Generate",
    icon: QrCode,
    tier: "pro",
    price: 5,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDesc: "Create strong, random passwords with customizable length, characters, numbers, and symbols.",
    category: "Generate",
    icon: KeyRound,
    tier: "free",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDesc: "Format, validate, and minify JSON instantly to make your data easier to read, check, and use.",
    category: "Develop",
    icon: FileJson,
    tier: "free",
  },
  {
    slug: "base64-converter",
    name: "Base64 Encoder / Decoder",
    shortDesc: "Encode text into Base64 or decode Base64 strings back into readable text quickly and easily.",
    category: "Develop",
    icon: Braces,
    tier: "free",
  },
  {
    slug: "case-converter",
    name: "Text Case Converter",
    shortDesc: "Convert your text between UPPERCASE, lowercase, Title Case, and Sentence case in seconds",
    category: "Convert",
    icon: Type,
    tier: "free",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    shortDesc: "Convert length, weight, and temperature between common units quickly and accurately.",
    category: "Convert",
    icon: Ruler,
    tier: "pro",
    price: 5,
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    shortDesc: "Convert colors between HEX, RGB, and HSL formats with a live preview for quick and accurate color selection.",
    category: "Develop",
    icon: Palette,
    tier: "free",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    shortDesc: "Generate customizable placeholder paragraphs, sentences, or words for designs, websites, and content layouts.",
    category: "Generate",
    icon: FileText,
    tier: "free",
  },
  // --- 15 new tools ---
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    shortDesc: "Encode or decode URLs and query strings instantly for cleaner and properly formatted web addresses.",
    category: "Develop",
    icon: Link2,
    tier: "free",
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    shortDesc: "Write Markdown and see your formatted content rendered live as you type, making it easy to preview your final output.",
    category: "Develop",
    icon: FileCode,
    tier: "free",
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    shortDesc: "Turn any title or phrase into a clean, SEO-friendly, URL-safe slug in seconds.",
    category: "Convert",
    icon: Tags,
    tier: "free",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    shortDesc: "Convert Unix timestamps into readable dates and convert dates back into Unix timestamps quickly and accurately.",
    category: "Convert",
    icon: Clock,
    tier: "free",
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    shortDesc: "Generate random numbers within a custom range quickly and easily.",
    category: "Generate",
    icon: Dices,
    tier: "free",
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    shortDesc: "Create SEO titles, descriptions, and meta tags to help optimize your web pages for search engines.",
    category: "Generate",
    icon: Tags,
    tier: "pro",
    price: 5,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortDesc: "Calculate percentages, percentage increases, and percentage decreases quickly and accurately.",
    category: "Check",
    icon: Percent,
    tier: "free",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortDesc: "Calculate your Body Mass Index (BMI) using your height and weight to get a quick estimate of your BMI category.",
    category: "Check",
    icon: HeartPulse,
    tier: "free",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    shortDesc: "Calculate your exact age in years, months, and days using your date of birth.",
    category: "Check",
    icon: Cake,
    tier: "free",
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON Converter",
    shortDesc: "Convert CSV data into clean, structured JSON quickly and easily.",
    category: "Convert",
    icon: FileSpreadsheet,
    tier: "pro",
    price: 5,
  },
  {
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    shortDesc: "Compare two blocks of text and quickly identify differences, additions, and changes between them.",
    category: "Check",
    icon: GitCompare,
    tier: "pro",
    price: 5,
  },
  {
    slug: "sha256-hash-generator",
    name: "SHA-256 Hash Generator",
    shortDesc: "Generate a SHA-256 hash from any text quickly and easily for data verification and security-related tasks.",
    category: "Develop",
    icon: HashIcon,
    tier: "pro",
    price: 5,
  },
  {
    slug: "word-frequency-counter",
    name: "Word Frequency Counter",
    shortDesc: "See which words appear most often in your text and quickly understand word usage and repetition.",
    category: "Check",
    icon: ListOrdered,
    tier: "pro",
    price: 5,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDesc: "Reduce JPG, PNG, and other supported image file sizes while maintaining good visual quality.",
    category: "Convert",
    icon: FileImage,
    tier: "pro",
    price: 5,
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    shortDesc: "Turn any image into ready-to-use favicon sizes for websites and web applications.",
    category: "Generate",
    icon: AppWindow,
    tier: "pro",
    price: 5,
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

/** Every Pro tool has its own price; free tools have none. */
export function getToolPrice(tool: Pick<Tool, "tier" | "price">): number {
  if (tool.tier !== "pro") return 0;
  return typeof tool.price === "number" ? tool.price : 5; // 5 = PAID_TOOL_PRICE fallback, kept local to avoid a circular import
}
