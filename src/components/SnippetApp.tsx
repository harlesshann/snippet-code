import { useMemo, useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, addSnippet, updateSnippet, deleteSnippet } from "../db";
import type { Snippet, SnippetDraft } from "../types";
import { filterSnippets, uniqueFolders, uniqueTags } from "../search";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SnippetList from "./SnippetList";
import SnippetEditor from "./SnippetEditor";
import ConfirmDialog from "./ConfirmDialog";
import { navigate } from "../router";

export default function SnippetApp() {
  const all = useLiveQuery(
    () => db.snippets.orderBy("updatedAt").reverse().toArray(),
    [],
    [] as Snippet[],
  );

  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Snippet | null>(null);

  // Seeding is a deliberate dev step for the PRD verification benchmark
  // (KPI #1, 1,000 dummy snippets). Not run automatically by the app.

  const folders = useMemo(() => uniqueFolders(all), [all]);
  const tagList = useMemo(() => uniqueTags(all), [all]);

  const results = useMemo(
    () => filterSnippets(all, { query, folder, tags }),
    [all, query, folder, tags],
  );

  // cmd/ctrl+K focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(s: Snippet) {
    setEditing(s);
    setEditorOpen(true);
  }
  function handleSave(draft: SnippetDraft) {
    if (editing && editing.id != null) {
      updateSnippet(editing.id, draft);
    } else {
      addSnippet(draft);
    }
    setEditorOpen(false);
    setEditing(null);
  }
  function confirmDelete() {
    if (pendingDelete?.id != null) deleteSnippet(pendingDelete.id);
    setPendingDelete(null);
  }
  function toggleTag(t: string) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }
  function clearFilters() {
    setFolder("");
    setTags([]);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <a
            className="brand"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            aria-label="Back to home"
          >
            <span className="brand-mark" aria-hidden="true">
              {"</>"}
            </span>
            <span className="brand-name">SnippetCode</span>
          </a>
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={results.length}
          />
          <button
            type="button"
            className="btn-primary topbar-new"
            onClick={openNew}
          >
            New snippet
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="layout-sidebar">
          <Sidebar
            folders={folders}
            tags={tagList}
            activeFolder={folder}
            activeTags={tags}
            onSelectFolder={setFolder}
            onToggleTag={toggleTag}
            onClear={clearFilters}
            totalCount={all.length}
          />
        </aside>

        <main className="layout-main" aria-label="Snippets">
          {all.length === 0 ? (
            <div className="empty">
              <h2 className="empty-title">No snippets yet</h2>
              <p className="empty-text">
                Save your first reusable code snippet. Everything stays local in
                your browser.
              </p>
              <button type="button" className="btn-primary" onClick={openNew}>
                New snippet
              </button>
            </div>
          ) : (
            <SnippetList
              snippets={results}
              onEdit={openEdit}
              onDelete={setPendingDelete}
              onNew={openNew}
            />
          )}
        </main>
      </div>

      {editorOpen && (
        <SnippetEditor
          editing={editing}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          snippet={pendingDelete}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
