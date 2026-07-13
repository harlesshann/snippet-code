export interface Snippet {
  id?: number;
  title: string;
  /** highlight.js language id (e.g. "javascript"); "plaintext" for unknown. */
  language: string;
  content: string;
  /** Free-form folder/category. Empty string means uncategorized. */
  folder: string;
  /** Multi-value tags. */
  tags: string[];
  /** ISO timestamp. */
  createdAt: number;
  updatedAt: number;
}

export type SnippetDraft = Omit<Snippet, "id" | "createdAt" | "updatedAt">;

export const isSnippet = (v: unknown): v is Snippet =>
  typeof v === "object" && v !== null && "content" in v;
