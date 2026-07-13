interface Props {
  folders: string[];
  tags: string[];
  activeFolder: string;
  activeTags: string[];
  onSelectFolder: (folder: string) => void;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
  totalCount: number;
}

export default function Sidebar({
  folders,
  tags,
  activeFolder,
  activeTags,
  onSelectFolder,
  onToggleTag,
  onClear,
  totalCount,
}: Props) {
  const hasFilter = activeFolder !== "" || activeTags.length > 0;

  return (
    <nav className="sidebar" aria-label="Filter by folder and tag">
      <div className="sidebar-section">
        <div className="sidebar-head">
          <h2 className="sidebar-title">Folders</h2>
          {hasFilter && (
            <button type="button" className="sidebar-clear" onClick={onClear}>
              Clear
            </button>
          )}
        </div>
        <ul className="sidebar-list">
          <li>
            <button
              type="button"
              className={`sidebar-item ${activeFolder === "" ? "is-active" : ""}`}
              onClick={() => onSelectFolder("")}
              aria-pressed={activeFolder === ""}
            >
              <span>All snippets</span>
              <span className="sidebar-badge">{totalCount}</span>
            </button>
          </li>
          {folders.map((f) => (
            <li key={f}>
              <button
                type="button"
                className={`sidebar-item ${activeFolder === f ? "is-active" : ""}`}
                onClick={() => onSelectFolder(f)}
                aria-pressed={activeFolder === f}
              >
                <span>{f}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {tags.length > 0 && (
        <div className="sidebar-section">
          <h2 className="sidebar-title">Tags</h2>
          <div className="sidebar-tags">
            {tags.map((t) => {
              const on = activeTags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  className={`tag-chip ${on ? "is-active" : ""}`}
                  onClick={() => onToggleTag(t)}
                  aria-pressed={on}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
