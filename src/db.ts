import Dexie, { type Table } from "dexie";
import type { Snippet, SnippetDraft } from "./types";

class SnippetDB extends Dexie {
  snippets!: Table<Snippet, number>;

  constructor() {
    super("snippetcode");
    this.version(1).stores({
      // Indexed fields per PRD architecture (search uses in-memory filter,
      // so no full-text index is required; indexes aid range/lookup ops).
      snippets: "++id, title, folder, language, updatedAt",
    });
  }
}

export const db = new SnippetDB();

export async function addSnippet(draft: SnippetDraft): Promise<number> {
  const now = Date.now();
  return db.snippets.add({ ...draft, createdAt: now, updatedAt: now });
}

export async function updateSnippet(
  id: number,
  draft: SnippetDraft,
): Promise<void> {
  await db.snippets.update(id, { ...draft, updatedAt: Date.now() });
}

export async function deleteSnippet(id: number): Promise<void> {
  await db.snippets.delete(id);
}

/** Seed N dummy snippets for the PRD verification benchmark (KPI #1). */
export async function seedSnippets(count: number): Promise<void> {
  if ((await db.snippets.count()) > 0) return;
  const langs = ["javascript", "python", "sql", "bash", "typescript", "go", "rust"];
  const folders = ["config", "util", "regex", "boilerplate", "scripts"];
  const tags = ["auth", "web", "cli", "db", "test", "perf"];
  const batch: Snippet[] = [];
  for (let i = 0; i < count; i++) {
    batch.push({
      title: `Seed snippet ${i + 1}`,
      language: langs[i % langs.length],
      content: `// generated snippet ${i + 1}\nfunction demo() {\n  return ${i} * 2;\n}\n`,
      folder: folders[i % folders.length],
      tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
      createdAt: Date.now() - i,
      updatedAt: Date.now() - i,
    });
  }
  await db.snippets.bulkAdd(batch);
}
