# PRD — SnippetCode (Aplikasi Manajemen Snippet Code Pribadi)

> Dibuat dengan skill `prd` (awesome-copilot). Target: Web App, Personal/Solo, Client-only (IndexedDB), tanpa AI.

---

## 1. Executive Summary

- **Problem Statement**: Developer sering menyimpan potongan kode berguna (regex, konfigurasi, boilerplate) tersebar di file, chat, dan notes tanpa struktur — sulit ditemukan kembali saat dibutuhkan.
- **Proposed Solution**: Aplikasi web ringan, sepenuhnya di sisi klien, untuk menyimpan, mengorganisir (folder + tag), mencari, dan menyalin snippet dengan highlight sintaks — tanpa server, tanpa biaya hosting, tanpa login.
- **Success Criteria** (KPI terukur):
  1. Search mengembalikan hasil **< 200 ms** untuk dataset hingga **1.000 snippet** (P95, di device menengah).
  2. **100%** snippet dapat disalin dengan satu klik (Copy button), tanpa formatting rusak.
  3. Highlight sintaks mendukung **≥ 30 bahasa** umum (JS, TS, Python, Go, Rust, SQL, Bash, dll).
  4. Lighthouse Accessibility score **= 100**, dan aplikasi berfungsi **fully offline** (tanpa koneksi) setelah load pertama.
  5. Time-to-first-snippet (buka app → lihat daftar) **< 1 s** untuk 500 snippet.

---

## 2. User Experience & Functionality

### User Personas
- **Solo Developer (primary)**: Developer harian yang ingin kumpulan "kode siap pakai" pribadi, cepat dicari dan cepat disalin. Tidak butuh kolaborasi atau akun.

### User Stories & Acceptance Criteria

**Story 1 — Organisir & Tag**
> As a developer, I want to save a snippet with a language, a folder/category, and tags, so that I can group related code logically.

- AC:
  - Form "New Snippet" menerima: `title`, `language` (dropdown terdeteksi otomatis), `content` (code), `folder` (bebas/opsi), `tags` (multi).
  - Satu snippet bisa punya ≥ 0 folder dan ≥ 0 tag.
  - Edit & hapus snippet tersedia; hapus meminta konfirmasi.
  - Data persisten di IndexedDB setelah reload.

**Story 2 — Search Cepat**
> As a developer, I want to search across title, content, tags, and folder, so that I find the right snippet instantly.

- AC:
  - Kotak search tunggal (cmd/ctrl+K) mencari teks bebas.
  - Pencarian case-insensitive, mendukung substring & multi-kata (AND).
  - Hasil difilter juga lewat sidebar folder/tag (filter kombinasi).
  - Waktu respons < 200 ms untuk 1.000 snippet (lihat KPI #1).

**Story 3 — Syntax Highlight + Copy**
> As a developer, I want each snippet rendered with correct syntax coloring and a one-click copy button, so that I can paste it elsewhere without reformatting.

- AC:
  - Code dirender dengan highlight sesuai `language` (≥ 30 bahasa, KPI #3).
  - Tombol "Copy" menyalin `content` asli (bukan teks ber-warna) ke clipboard.
  - Indikator "Copied!" muncul < 100 ms dan otomatis hilang dalam 1.5 s.
  - Fallback: jika bahasa tidak dikenali, tampilkan sebagai plaintext tanpa error.

### Non-Goals (apa yang TIDAK dibangun)
- Tidak ada multi-user, sharing, atau kolaborasi real-time.
- Tidak ada auth / login / akun.
- Tidak ada sinkronisasi cloud / cross-device.
- Tidak ada fitur AI (generate/refactor/smart-search).
- Tidak ada server backend atau API eksternal.
- Tidak ada komentar/rating/versioning snippet di MVP.

---

## 3. AI System Requirements

**Tidak Berlaku.** Aplikasi ini murni manajemen snippet (CRUD + search lokal) tanpa komponen berbasis LLM atau model AI, sesuai keputusan produk. Bagian ini disiapkan kosong agar PRD konsisten dengan skema, dan dapat diisi jika fitur AI ditambahkan di masa depan (v2.0).

---

## 4. Technical Specifications

### Architecture Overview
- **Tipe**: Single Page Application (SPA), 100% client-side, tanpa server.
- **Data Flow**:
  ```
  UI (React) ──> Dexie/IndexedDB (store: snippets)
       │
       ├─ Search: query ─> index lokal (FlexSearch/Fuse) ─> hasil filter
       └─ Render: snippet.content + language ─> lib highlight ─> <pre><code>
  ```
- Komponen utama: `SnippetList`, `SnippetEditor`, `SearchBar` (cmd+K), `Sidebar` (folder/tag), `CodeBlock` (highlight + copy).

### Tech Stack (rekomendasi, `TBD` boleh diganti saat implementasi)
- **Framework**: React + TypeScript (Vite sebagai bundler).
- **Storage**: IndexedDB via **Dexie.js** (schema: `snippets` dengan index pada `title`, `folder`, `tags`, `language`).
- **Search**: **FlexSearch** (full-text) atau **Fuse.js** (fuzzy) — diuji mana yang memenuhi KPI < 200 ms.
- **Syntax Highlight**: **Shiki** (akurasi tinggi, TextMate) atau **highlight.js** (ringan). Shiki direkomendasikan untuk ≤ latency render.
- **Styling**: CSS native / design system netral (tanpa UI kit berat) — target Lighthouse 100.
- **State**: React hooks + Dexie live queries (`dexie-react-hooks`), tanpa Redux.
- **Build/Host**: Static build → deploy ke GitHub Pages / Netlify / Cloudflare Pages (gratis, tanpa server).

### Integration Points
- **Clipboard API**: `navigator.clipboard.writeText()` untuk Copy (dengan fallback legacy).
- **IndexedDB**: satu-satunya penyimpanan; tidak ada jaringan/DB eksternal.
- **PWA (opsional v1.1)**: Service Worker untuk offline-cache asset → memenuhi KPI #4 (fully offline).

### Security & Privacy
- Seluruh data tersimpan **lokal di browser pengguna** (IndexedDB origin-bound) — tidak ada transmisi ke server.
- Tidak ada pengumpulan telemetry default.
- Clipboard hanya ditulis saat user menekan Copy (izin browser standar).
- Risiko rendah: kehilangan data jika user menghapus cache browser → mitigasi via fitur Export (lihat Roadmap v1.1).

---

## 5. Risks & Roadmap

### Phased Rollout
- **MVP (v1.0)**: CRUD snippet, folder + tag, search lokal < 200 ms, syntax highlight ≥ 30 bahasa, copy one-click. (Cakupan dari keputusan fitur inti.)
- **v1.1**: Export/Import (JSON + Markdown) untuk backup lokal; PWA offline; keyboard shortcut tambahan.
- **v2.0 (future, TBD)**: Sinkronisasi lintas-device (perlu backend — keluar dari model client-only); fitur AI (generate/refactor/smart-search) bila diinginkan.

### Technical Risks
| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| IndexedDB quota/eviction browser | Kehilangan snippet | Fitur Export (v1.1); dokumentasi batas penyimpanan |
| Latency highlight pada snippet besar | UI lag | Virtualisasi list; lazy-highlight; batas ukuran snippet (mis. 50 KB) |
| Search lambat saat dataset tumbuh | Gagal KPI #1 | Benchmark FlexSearch vs Fuse; index terbatas pada field relevan |
| Shiki bundle besar | Waktu load lambat | Lazy-load bahasa on-demand; pre-built bundle bahasa umum |

---

## Verification (cara uji end-to-end)
1. **Functional**: Buat 3 snippet ber-bahasa beda (JS/Python/SQL) + folder + tag → reload page → data tetap ada (IndexedDB persist).
2. **Search**: Isi 1.000 dummy snippet (seed script) → ketik query → ukur P95 < 200 ms (KPI #1) via `performance.now()` log.
3. **Copy**: Klik Copy → tempel di editor → teks persis sama dengan `content` asli, tanpa escape HTML rusak.
4. **Highlight**: Cek 30 bahasa ter-render warna benar; bahasa tak dikenal → plaintext tanpa crash.
5. **Offline**: Build static → serve → buka, lalu matikan network → app & data tetap jalan (v1.1 PWA) atau minimal data tetap load (MVP).
6. **A11y**: Jalankan Lighthouse → Accessibility = 100 (KPI #4).
7. **Non-goal check**: Pastikan tidak ada panggilan jaringan ke server mana pun (Network tab kosong saat operasi CRUD/search).
