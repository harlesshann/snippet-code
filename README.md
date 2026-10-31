<div align="center">

# </> SnippetCode

**Your code snippets, organized and one copy away.**

A private, offline-first snippet manager that runs entirely in your browser —
no server, no login, no tracking. Search, tag, and copy code instantly.

[![Deploy to GitHub Pages](https://github.com/harlesshann/snippet-code/actions/workflows/deploy.yml/badge.svg)](https://github.com/harlesshann/snippet-code/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[**🚀 Live Demo**](https://harlesshann.github.io/snippet-code/) · [Open the App](https://harlesshann.github.io/snippet-code/#/app) · [Report an Issue](https://github.com/harlesshann/snippet-code/issues)

</div>

---

## ✨ Features

- **⚡ Instant search** — Filter across titles, code, tags, folders, and language. Multi-word queries are matched as AND, and results stay fast (under 200 ms) even with 1,000+ snippets. Press `Cmd/Ctrl + K` to jump straight to search.
- **🎨 Syntax highlighting** — 37 languages rendered with accurate coloring via highlight.js. Unknown languages fall back gracefully to clean plaintext.
- **🗂️ Folders & tags** — Group snippets by project and topic, then combine folder and tag filters to narrow results fast.
- **📋 One-click copy** — Copy the original code to your clipboard from any card, with a legacy fallback for non-secure contexts.
- **🔒 100% local** — Snippets are stored only in your browser's IndexedDB. Nothing is uploaded, so there is no server to leak from.
- **📴 Fully offline** — Works without a connection after the first load.
- **🌗 Light & dark** — Follows your system preference automatically via `prefers-color-scheme`.

## 🎬 Preview

```ts
function debounce<T extends (...a: any[]) => void>(fn: T, ms = 200) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
```

> This is the kind of reusable utility SnippetCode is built to keep one copy away.
> Try it live in the [**Live Demo**](https://harlesshann.github.io/snippet-code/).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **20 or later**
- npm (included with Node.js)

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/harlesshann/snippet-code.git
cd snippet-code

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Available scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR       |
| `npm run build`     | Build the production bundle into `dist/` |
| `npm run preview`   | Preview the production build locally     |
| `npm run typecheck` | Run the TypeScript compiler check        |

## 🛠️ Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Framework   | React 19                                     |
| Language    | TypeScript 5                                 |
| Build tool  | Vite 6                                       |
| Storage     | IndexedDB via Dexie 4 (`dexie-react-hooks`)  |
| Highlighting| highlight.js 11                              |
| Styling     | Native CSS (light & dark via media query)    |
| Routing     | Minimal hash router (no router dependency)   |
| Deployment  | GitHub Pages via GitHub Actions              |

## 🏗️ How It Works

SnippetCode is **client-only by design** — there is no backend to deploy, secure, or pay for:

- **Storage** — All snippets live in a local IndexedDB database (`snippetcode`) managed with Dexie. Data persists across reloads and stays bound to the site origin.
- **Search** — Snippets are filtered in memory. For a personal library this is simpler and faster than a full-text index, and it keeps the bundle small.
- **Routing** — A tiny hash router (`#/`, `#/app`) keeps deep links working on static hosts like GitHub Pages without any server rewrite rules.
- **Privacy** — Because no server is in the loop, snippets never leave the device they were created on.

## 📁 Project Structure

```
snippet-code/
├── .github/workflows/   # GitHub Pages deployment (Actions)
├── src/
│   ├── components/      # Landing, SnippetApp, Editor, Card, Sidebar, …
│   ├── App.tsx          # Root component (landing ↔ app routing)
│   ├── db.ts            # Dexie / IndexedDB data layer
│   ├── search.ts        # In-memory filter, folders & tags helpers
│   ├── highlight.ts     # highlight.js language registry & aliases
│   ├── clipboard.ts     # Copy-to-clipboard with legacy fallback
│   ├── router.ts        # Minimal hash router
│   ├── types.ts         # Snippet types
│   └── styles.css       # Design system (light & dark)
├── index.html
├── package.json
└── vite.config.ts
```

## 🗺️ Roadmap

- [ ] Export & import snippets (JSON and Markdown) for backup and portability
- [ ] Optional local backup reminders

Cross-device sync is intentionally **not** planned: it would require a backend, which is outside the client-only model.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-change`
3. Commit your changes: `git commit -m "feat: describe the change"`
4. Push to the branch: `git push origin feat/my-change`
5. Open a Pull Request

Please run `npm run typecheck` and `npm run build` before submitting.

## 📄 License

Distributed under the [MIT License](./LICENSE).

## 👤 Author

**Handy Setiawan**

- GitHub: [@harlesshann](https://github.com/harlesshann)

---

<div align="center">
<sub>Built with React, TypeScript, and Vite — and a dislike for digging through old projects to find that one function again.</sub>
</div>
