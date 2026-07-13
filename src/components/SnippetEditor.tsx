import { useEffect, useRef, useState } from "react";
import type { Snippet, SnippetDraft } from "../types";
import { LANGUAGES, normalizeLanguage } from "../highlight";

interface Props {
  /** Existing snippet to edit, or null for a new snippet. */
  editing: Snippet | null;
  onSave: (draft: SnippetDraft) => void;
  onClose: () => void;
}

export default function SnippetEditor({ editing, onSave, onClose }: Props) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [language, setLanguage] = useState(editing?.language ?? "");
  const [folder, setFolder] = useState(editing?.folder ?? "");
  const [tagsInput, setTagsInput] = useState((editing?.tags ?? []).join(", "));
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      titleRef.current?.focus();
      return;
    }
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({
      title: title.trim(),
      language: normalizeLanguage(language || "plaintext"),
      content,
      folder: folder.trim(),
      tags,
    });
  }

  const isEdit = editing !== null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        <h2 id="editor-title" className="modal-title">
          {isEdit ? "Edit snippet" : "New snippet"}
        </h2>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="field">
            <label htmlFor="f-title" className="field-label">
              Title
            </label>
            <input
              id="f-title"
              ref={titleRef}
              className="field-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="Give your snippet a name"
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="f-lang" className="field-label">
                Language
              </label>
              <select
                id="f-lang"
                className="field-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-folder" className="field-label">
                Folder
              </label>
              <input
                id="f-folder"
                className="field-input"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g. config, util (optional)"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-tags" className="field-label">
              Tags
            </label>
            <input
              id="f-tags"
              className="field-input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma,separated,tags"
            />
          </div>

          <div className="field">
            <label htmlFor="f-content" className="field-label">
              Code
            </label>
            <textarea
              id="f-content"
              className="field-input field-code"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              required
              rows={10}
            />
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Save changes" : "Create snippet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
