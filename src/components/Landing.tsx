import { useState, useRef } from "react";
import CodeBlock from "./CodeBlock";
import { copyText } from "../clipboard";
import { navigate } from "../router";
import { useReveal } from "../useReveal";

const previewCode = `function debounce<T extends (...a: any[]) => void>(fn: T, ms = 200) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}`;

const features = [
  {
    glyph: "⌘",
    title: "Instant search",
    body: "Filter across titles, code, tags, and folders. Multi-word queries match as AND, all under 200ms.",
  },
  {
    glyph: "{}",
    title: "Syntax highlighting",
    body: "37 languages rendered with accurate coloring. Unknown languages fall back to clean plaintext.",
  },
  {
    glyph: "#",
    title: "Folders & tags",
    body: "Group snippets by project and topic. Combine folder and tag filters to narrow results fast.",
  },
  {
    glyph: "⛁",
    title: "100% local",
    body: "Saved in your browser with IndexedDB. No server, no login, and it works offline after first load.",
  },
];

const steps = [
  {
    title: "Create a snippet",
    body: "Paste code, pick a language, and give it a title. Auto-detection covers most file extensions.",
  },
  {
    title: "Organize it",
    body: "Drop it in a folder and add comma-separated tags. Mix folder and tag filters to slice your library.",
  },
  {
    title: "Find and copy",
    body: "Type in the search bar or hit Cmd/Ctrl+K. One click copies the original code to your clipboard.",
  },
];

const languages = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C", "C++",
  "C#", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "Bash", "YAML", "JSON",
  "HTML", "CSS", "Markdown", "Lua", "R", "Elixir", "Haskell", "Dockerfile",
  "TOML", "Shell", "Perl", "Scala", "PowerShell",
];

const privacyPoints = [
  "No account and no password to manage.",
  "Snippets are stored only in your browser via IndexedDB.",
  "Nothing is uploaded, so there is no server to leak from.",
  "Works offline after the first load, anywhere.",
];

const faqs = [
  {
    q: "Do I need to sign up?",
    a: "No. SnippetCode is fully client-side. Open it and start saving snippets immediately. There is no account, login, or backend.",
  },
  {
    q: "Where are my snippets stored?",
    a: "Directly in your browser's IndexedDB, bound to this site origin. They persist across reloads and survive until you delete them or clear site data.",
  },
  {
    q: "Will it work without internet?",
    a: "Yes. After the first load the app runs offline. Reach snippet data even on a plane or with the network off.",
  },
  {
    q: "Can I sync across devices?",
    a: "Not in the current version. Syncing would require a backend, which is outside the client-only model. Local export and import are planned for a later release.",
  },
  {
    q: "What happens if I clear my browser cache?",
    a: "IndexedDB lives in site storage, so clearing site data removes your snippets. A local export feature (JSON and Markdown) is planned so you can keep a backup.",
  },
];

export default function Landing() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (await copyText(previewCode)) setCopied(true);
  }

  function scrollTo(id: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
  }

  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="landing" ref={rootRef}>
      <header className="lnav">
        <div className="lnav-inner">
          <a
            className="brand"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <span className="brand-mark" aria-hidden="true">
              {"</>"}
            </span>
            <span className="brand-name">SnippetCode</span>
          </a>
          <nav className="lnav-links" aria-label="Sections">
            <a href="#features" onClick={scrollTo("features")}>
              Features
            </a>
            <a href="#languages" onClick={scrollTo("languages")}>
              Languages
            </a>
            <a href="#privacy" onClick={scrollTo("privacy")}>
              Privacy
            </a>
            <a href="#faq" onClick={scrollTo("faq")}>
              FAQ
            </a>
          </nav>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/app")}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section className="hero" data-reveal>
          <div className="hero-copy">
            <h1 className="hero-title">
              Your code snippets, organized and one copy away.
            </h1>
            <p className="hero-sub">
              A private, offline snippet manager. Search, tag, and copy code
              instantly, with no server and no login.
            </p>
            <div className="hero-cta">
              <button
                type="button"
                className="btn-primary btn-lg"
                onClick={() => navigate("/app")}
              >
                Get Started
              </button>
              <a className="hero-link" href="#features" onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                See how it works
              </a>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-card">
              <div className="preview-head">
                <span className="preview-title">debounce.ts</span>
                <span className="card-lang">typescript</span>
                <button
                  type="button"
                  className="btn-copy preview-copy"
                  onClick={handleCopy}
                  aria-label="Copy preview snippet"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <CodeBlock code={previewCode} language="typescript" />
              <div className="preview-tags">
                <span className="tag-chip tag-static">util</span>
                <span className="tag-chip tag-static">perf</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features" data-reveal>
          <h2 className="section-title">Built for daily reuse</h2>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                className="feature"
                key={f.title}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              >
                <span className="feature-glyph" aria-hidden="true">
                  {f.glyph}
                </span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="steps" id="how" data-reveal>
          <h2 className="section-title">Three steps to a tidy library</h2>
          <div className="step-grid">
            {steps.map((s, i) => (
              <div
                className="step"
                key={s.title}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              >
                <span className="step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="languages" id="languages" data-reveal>
          <h2 className="section-title">30+ languages, highlighted correctly</h2>
          <p className="section-sub">
            From the everyday to the niche, your code renders in its own colors.
          </p>
          <ul className="lang-cloud" aria-label="Supported languages">
            {languages.map((l) => (
              <li className="lang-pill" key={l}>
                {l}
              </li>
            ))}
          </ul>
        </section>

        <section className="privacy" id="privacy" data-reveal>
          <div className="privacy-inner">
            <div className="privacy-copy">
              <h2 className="section-title privacy-title">Private by architecture</h2>
              <p className="privacy-lead">
                There is no server in the loop, so there is nothing to send and
                nothing to expose. Your snippets stay on the device they were
                written on.
              </p>
            </div>
            <ul className="privacy-list">
              {privacyPoints.map((p) => (
                <li className="privacy-item" key={p}>
                  <span className="check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="faq" data-reveal>
          <h2 className="section-title">Questions, answered</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary className="faq-q">{item.q}</summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <h2 className="cta-title">Start your private snippet library</h2>
          <p className="cta-sub">
            Nothing to install and nothing to sign up for. Your first snippet
            takes about a minute.
          </p>
          <button
            type="button"
            className="btn-primary btn-lg"
            onClick={() => navigate("/app")}
          >
            Get Started
          </button>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-brand">
            <a
              className="brand"
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <span className="brand-mark" aria-hidden="true">
                {"</>"}
              </span>
              <span className="brand-name">SnippetCode</span>
            </a>
            <p className="foot-desc">
              A private, client-only snippet manager. Your code stays in your
              browser, nothing is uploaded.
            </p>
          </div>

          <div className="foot-col">
            <h4>Product</h4>
            <ul className="foot-links">
              <li>
                <a href="#features" onClick={scrollTo("features")}>
                  Features
                </a>
              </li>
              <li>
                <a href="#languages" onClick={scrollTo("languages")}>
                  Languages
                </a>
              </li>
              <li>
                <a href="#faq" onClick={scrollTo("faq")}>
                  FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="foot-cta"
                  onClick={() => navigate("/app")}
                >
                  Open app
                </button>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Learn</h4>
            <ul className="foot-links">
              <li>
                <a href="#how" onClick={scrollTo("how")}>
                  How it works
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={scrollTo("privacy")}>
                  Privacy
                </a>
              </li>
              <li>
                <a href="#faq" onClick={scrollTo("faq")}>
                  Getting started
                </a>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Storage</h4>
            <ul className="foot-links">
              <li>IndexedDB</li>
              <li>Offline ready</li>
              <li>No account</li>
            </ul>
          </div>
        </div>
        <p className="foot-bottom">
          SnippetCode runs entirely in your browser. Your snippets never leave
          this device.
        </p>
      </footer>
    </div>
  );
}
