import type { Snippet } from "../types";
import SnippetCard from "./SnippetCard";

interface Props {
  snippets: Snippet[];
  onEdit: (s: Snippet) => void;
  onDelete: (s: Snippet) => void;
  onNew: () => void;
}

export default function SnippetList({
  snippets,
  onEdit,
  onDelete,
  onNew,
}: Props) {
  if (snippets.length === 0) {
    return (
      <div className="empty">
        <h2 className="empty-title">No snippets match</h2>
        <p className="empty-text">
          Create a snippet or adjust your search and filters.
        </p>
        <button type="button" className="btn-primary" onClick={onNew}>
          New snippet
        </button>
      </div>
    );
  }

  return (
    <div className="snippet-list">
      {snippets.map((s) => (
        <SnippetCard
          key={s.id}
          snippet={s}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
