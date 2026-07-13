import hljs from "highlight.js/lib/common";
// Light theme tokens are applied globally. The dark-mode token palette lives
// in styles.css under `prefers-color-scheme: dark` so it only wins in dark,
// keeping the same base selectors (loading github-dark.css unconditionally
// would force dark tokens in light mode because both target `.hljs-*`).
import "highlight.js/styles/github.css";

/** highlight.js language ids bundled via /lib/common (≈37 languages). */
export const LANGUAGES: { id: string; label: string }[] = [
  { id: "plaintext", label: "Plain Text" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
  { id: "scala", label: "Scala" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "shell", label: "Shell" },
  { id: "powershell", label: "PowerShell" },
  { id: "yaml", label: "YAML" },
  { id: "json", label: "JSON" },
  { id: "xml", label: "XML" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "markdown", label: "Markdown" },
  { id: "ini", label: "INI" },
  { id: "toml", label: "TOML" },
  { id: "dockerfile", label: "Dockerfile" },
  { id: "makefile", label: "Makefile" },
  { id: "diff", label: "Diff" },
  { id: "lua", label: "Lua" },
  { id: "perl", label: "Perl" },
  { id: "r", label: "R" },
  { id: "dart", label: "Dart" },
  { id: "elixir", label: "Elixir" },
  { id: "erlang", label: "Erlang" },
  { id: "haskell", label: "Haskell" },
  { id: "clojure", label: "Clojure" },
  { id: "objectivec", label: "Objective-C" },
];

const LANG_IDS = new Set(LANGUAGES.map((l) => l.id));

/** Map common aliases to the highlight.js id used in the dropdown. */
export function normalizeLanguage(value: string): string {
  const v = value.trim().toLowerCase();
  if (!v || v === "text" || v === "txt" || v === "plain") return "plaintext";
  if (LANG_IDS.has(v)) return v;
  const alias: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    sh: "bash",
    zsh: "bash",
    yml: "yaml",
    md: "markdown",
    cpp: "cpp",
    "c++": "cpp",
    cs: "csharp",
    "c#": "csharp",
    golang: "go",
    rs: "rust",
    pl: "perl",
    ex: "elixir",
    erl: "erlang",
    hs: "haskell",
  };
  return alias[v] ?? "plaintext";
}

let warned = false;

/** Render code to highlighted HTML. Falls back to escaped plaintext. */
export function highlight(code: string, language: string): string {
  const lang = normalizeLanguage(language);
  if (lang === "plaintext") {
    return escapeHtml(code);
  }
  try {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    }
  } catch {
    /* fall through to plaintext */
  }
  if (!warned) {
    warned = true;
    console.warn(`[snippetcode] unrecognized language "${language}", using plaintext`);
  }
  return escapeHtml(code);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
