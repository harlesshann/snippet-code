import type { Snippet } from "./types";

export interface FilterState {
  /** Free-text query. Case-insensitive; multiple words matched as AND. */
  query: string;
  /** Active folder filter ("" = all folders). */
  folder: string;
  /** Active tag filters (empty = no tag constraint). AND-combined. */
  tags: string[];
}

/**
 * Local full-text filter over already-loaded snippets.
 * ponytail: for >50k snippets or fuzzy ranking, swap for FlexSearch/Fuse;
 * for the PRD's 1,000-snippet KPI this runs in well under 200 ms in-memory.
 */
export function filterSnippets(
  snippets: Snippet[],
  { query, folder, tags }: FilterState,
): Snippet[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const wantTags = tags.length > 0;

  return snippets.filter((s) => {
    if (folder && s.folder !== folder) return false;
    if (wantTags && !tags.every((t) => s.tags.includes(t))) return false;
    if (words.length === 0) return true;

    const haystack = `${s.title}\n${s.content}\n${s.folder}\n${s.tags.join(
      " ",
    )}\n${s.language}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export function uniqueFolders(snippets: Snippet[]): string[] {
  const set = new Set<string>();
  for (const s of snippets) if (s.folder) set.add(s.folder);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function uniqueTags(snippets: Snippet[]): string[] {
  const set = new Set<string>();
  for (const s of snippets) for (const t of s.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}
