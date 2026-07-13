import { useEffect, useState } from "react";
import type { Snippet } from "../types";
import { copyText } from "../clipboard";
import CodeBlock from "./CodeBlock";

interface Props {
  snippet: Snippet;
  onEdit: (s: Snippet) => void;
  onDelete: (s: Snippet) => void;
}

export default function SnippetCard({ snippet, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function handleCopy() {
    const ok = await copyText(snippet.content);
    if (ok) setCopied(true);
  }

  return (
    <article className="card">
      <header className="card-head">
        <div className="card-meta">
          <h3 className="card-title" title={snippet.title}>
            {snippet.title}
          </h3>
          <span className="card-lang">{snippet.language}</span>
        </div>
        <div className="card-actions">
          <button
            type="button"
            className="btn-copy"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : `Copy ${snippet.title}`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(snippet)}
            aria-label={`Edit ${snippet.title}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => onDelete(snippet)}
            aria-label={`Delete ${snippet.title}`}
          >
            Delete
          </button>
        </div>
      </header>

      {snippet.folder && (
        <div className="card-folder">{snippet.folder}</div>
      )}

      <CodeBlock code={snippet.content} language={snippet.language} />

      {snippet.tags.length > 0 && (
        <footer className="card-tags">
          {snippet.tags.map((t) => (
            <span key={t} className="tag-chip tag-static">
              {t}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
