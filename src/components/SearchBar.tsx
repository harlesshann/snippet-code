interface Props {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}

export default function SearchBar({ value, onChange, resultCount }: Props) {
  return (
    <div className="searchbar">
      <label htmlFor="search" className="visually-hidden">
        Search snippets
      </label>
      <span className="searchbar-icon" aria-hidden="true">
        {"⌕"}
      </span>
      <input
        id="search"
        type="search"
        className="searchbar-input"
        placeholder="Search title, code, tag, folder…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className="searchbar-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          {"✕"}
        </button>
      )}
      <span className="searchbar-count" aria-live="polite">
        {resultCount}
      </span>
      <kbd className="searchbar-kbd" aria-hidden="true">
        ⌘K
      </kbd>
    </div>
  );
}
