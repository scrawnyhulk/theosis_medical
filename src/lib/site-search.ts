import { aboutParagraphs, nav, whyParagraphs } from "@/lib/content";
import { minutes, type MinuteSlug } from "@/lib/minutes";

export type SearchHit = {
  id: string;
  section: string;
  title: string;
  blurb: string;
} & (
  | { hrefKind: "hash"; hash: string }
  | { hrefKind: "minutes" }
  | { hrefKind: "minute"; slug: MinuteSlug }
);

type Indexed = SearchHit & { haystack: string };

function pack(title: string, ...parts: Array<string | undefined | readonly string[]>): string {
  return [title, ...parts.flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))]
    .join(" ")
    .toLowerCase();
}

const index: Indexed[] = [
  ...nav.map((item) => ({
    id: `page-${item.hash}`,
    section: "Page",
    title: item.label,
    blurb: item.hash === "about" ? aboutParagraphs[0] : item.hash === "why" ? whyParagraphs[0] : item.label,
    hrefKind: "hash" as const,
    hash: item.hash,
    haystack: pack(
      item.label,
      item.hash === "about" ? aboutParagraphs : item.hash === "why" ? whyParagraphs : item.label,
    ),
  })),
  {
    id: "minutes-hub",
    section: "Medical Minutes",
    title: "Medical Minutes",
    blurb: "The ER talk, written down.",
    hrefKind: "minutes",
    haystack: pack(
      "medical minutes",
      "ear fever cough cold uri bronchitis back sprain ct pneumonia sepsis antibiotic resistance amoxicillin leftover",
      "interactive physiology create a diabetic personal fat threshold",
    ),
  },
  ...minutes.map((m) => ({
    id: `minute-${m.slug}`,
    section: "Medical Minutes",
    title: m.title,
    blurb: m.lede,
    hrefKind: "minute" as const,
    slug: m.slug,
    haystack: pack(m.title, m.lede, m.paragraphs),
  })),
];

export function searchSite(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return index
    .map((item) => {
      let score = 0;
      const title = item.title.toLowerCase();
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (tokens.every((t) => item.haystack.includes(t))) score = item.haystack.includes(q) ? 45 : 30;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((row) => {
      const { haystack: _h, ...hit } = row.item;
      return hit;
    });
}
