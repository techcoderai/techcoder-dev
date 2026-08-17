import {
  Code2,
  Sparkles,
  Cpu,
  Star,
  Compass,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, type BlogCategory } from "@/lib/categories";

/**
 * Maps the string `icon` names stored in `lib/categories.ts` to their
 * lucide-react components. Kept in the UI layer so `lib/categories.ts` stays
 * framework-agnostic (importable by the Keystatic config and server code).
 */
const ICONS: Record<string, LucideIcon> = {
  Code2,
  Sparkles,
  Cpu,
  Star,
  Compass,
  Wrench,
};

/** Resolves the lucide icon component for a given category. */
export function categoryIcon(category: BlogCategory): LucideIcon {
  return ICONS[CATEGORIES[category].icon] ?? Sparkles;
}
