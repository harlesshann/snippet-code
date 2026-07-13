import { useEffect, useRef } from "react";
import type { Snippet } from "../types";

interface Props {
  snippet: Snippet;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ snippet, onConfirm, onCancel }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="modal modal-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <h2 id="confirm-title" className="modal-title">
          Delete snippet?
        </h2>
        <p id="confirm-desc" className="modal-desc">
          <strong>{snippet.title}</strong> will be permanently removed. This
          cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            ref={confirmRef}
            className="btn-danger-solid"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
