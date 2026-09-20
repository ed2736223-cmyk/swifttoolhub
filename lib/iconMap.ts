import {
  Wrench,
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
  Search,
  PenTool,
  Feather,
  BarChart3,
  BarChart2,
  Layers,
  ImagePlus,
  Wand2,
  Users,
  TrendingUp,
  Calculator,
  Calendar,
  Camera,
  Code2,
  Database,
  Download,
  Mail,
  Mic,
  Music,
  Settings,
  Shield,
  Star,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Every icon an admin is allowed to attach to a new tool. Keep this in sync
// with the imports above — the select in the admin form is generated from
// these keys, so a name here always resolves to a real icon.
export const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  FileJson,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Type,
  Ruler,
  Palette,
  AlignLeft,
  Image: ImageIcon,
  Link2,
  FileCode,
  FileSpreadsheet,
  GitCompare,
  Hash: HashIcon,
  Clock,
  Dices,
  Tags,
  Percent,
  HeartPulse,
  Cake,
  ListOrdered,
  FileImage,
  AppWindow,
  Search,
  PenTool,
  Feather,
  BarChart3,
  BarChart2,
  Layers,
  ImagePlus,
  Wand2,
  Users,
  TrendingUp,
  Calculator,
  Calendar,
  Camera,
  Code2,
  Database,
  Download,
  Mail,
  Mic,
  Music,
  Settings,
  Shield,
  Star,
  Video,
  Zap,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) || Wrench;
}

// Icon *components* (functions) can't cross the server → client boundary as
// props — React Server Components can only pass serializable data. Anywhere
// we need to hand a tool's icon to a "use client" component, resolve it to
// this string name on the server first, then resolveIcon() it back on the
// client.
export function nameForIcon(icon: LucideIcon): string {
  const entry = Object.entries(ICON_MAP).find(([, component]) => component === icon);
  return entry ? entry[0] : "Wrench";
}
