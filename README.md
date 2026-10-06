# Reflection: Review & Write

A minimalist, atmospheric web app for reflection and focused writing — now with multiple practices. Pick one from the landing page. No accounts, everything in `localStorage`.

Live: <https://reflection-phi.vercel.app>

Live pages:
- `index.html` — landing / chooser (Annual · Telos · Blank)
- `annual.html` — Annual Review, unified responsive (48 Q, progress, `reflection-annual-v1`, auto-migrates `reflection-mobile-responses`)
- `telos.html` — Telos Builder (Problems → Mission → Narratives → Goals → History → Challenges → Strategies → Logs → red-team prompt, exports `telos.md`)
- `blank.html` — Blank zen page (font cycle, word count, copy + download)
- `split-view.html` / `mobile.html` — redirect stubs → `annual.html` (kept for old bookmarks + file://, plus Vercel 308s)

## What shipped

**Oct 2026 — design pass (v2)**
- New scoped design layer in `shared.css` under `body.design-v2` (landing, annual, telos, 404). `blank.html` is untouched, so it keeps the v1 look exactly.
- Warm paper surface + single muted-bronze accent, soft radial background, ambient ASCII softened with a radial mask.
- Landing: serif wordmark masthead + wave glyph, flanked eyebrow rule, larger display title, unified card heights with line-art icons, accent reveal on hover.
- Forms: diamond-accented section headings, refined inputs with accent focus ring, pill progress/action bars, dashed template builder.

**Oct 2026 — deploy fix**
- Removed invalid top-level `excludeFiles` from `vercel.json`. Vercel's schema rejects unknown root keys, so production deploys had been failing since Oct 3; `temp/` is gitignored, so nothing needed excluding.
- `robots.txt` + `sitemap.xml` now use the real production domain `https://reflection-phi.vercel.app` and clean URLs.

**Oct 2026 — hub + hardening**
- Shared `assets/css/shared.css` + `assets/js/shared.js`: theme, clipboard fallback, sanitize, auto-resize, debounced storage, download, ASCII animator, modern bold/italic/H1/H2 (no `execCommand` for formatting).
- Early theme apply (no FOUC), button label = action (`Light` when dark). First visit honors OS color-scheme; `?theme=light|dark` overrides + persists (handy for screenshots).
- Fonts via `<link preconnect>` not `@import`; meta description + OG + twitter cards + OG image on every page.
- Relative `./` links (works under subpaths).
- ASCII pauses on `visibilitychange`, static when `prefers-reduced-motion`.
- Unified Annual (48 Q, progress bar, 2-col memories grid); legacy split/mobile fork collapsed to redirect stubs (meta + JS + Vercel 308s).
- `innerHTML` restore sanitized (strips scripts, `on*`, `javascript:`).
- Export **Copy** + **Download .md** everywhere; telos export matches `docs/telos-framework.md` schema.
- a11y: skip links, landmarks, labeled fields, live progress region, sticky bars capped, dark-mode contrast pass.
- PWA: PNG 192/512 + apple-touch 180px in `assets/icons/`, SVG light/dark favicons + `favicon.ico`, manifest `id` + `start_url: /` + `maskable`.
- `vercel.json`: `cleanUrls`, 308s for legacy URLs, long cache for `/assets/*`. `404.html`, `robots.txt`, `sitemap.xml`, MIT `LICENSE`, `.gitignore`.

## Telos format

Based on `docs/telos-framework.md` (NetworkChuck / Daniel Miessler, vendored from gitignored `temp/` scratch): Problems, Missions (`I think one of the biggest problems is [X], which is why I am focusing on [Y].`), Narratives (8/15/30-sec), Goals (SMART checkboxes), History, Challenges, Strategies, Logs (`YYYY-MM-DD`), plus red-team prompt:

> Review my stated missions and goals against my daily logs. Identify my top three blind spots, call out where I am confusing busywork with actual progress, and highlight where my execution contradicts my stated priorities.

## File Structure

```
reflection/
├── index.html          # Landing chooser
├── annual.html         # Annual review (unified, responsive)
├── telos.html          # Telos builder (responsive)
├── blank.html          # Blank writer (responsive)
├── mobile.html         # Redirect → annual.html (legacy bookmark)
├── split-view.html     # Redirect → annual.html (legacy bookmark)
├── assets/
│   ├── css/shared.css
│   ├── js/shared.js
│   ├── icons/*.png      # generated from the SVGs below (rsvg-convert)
│   └── *.svg            # vector sources (favicon, dark variant, icon art)
├── docs/
│   └── telos-framework.md  # Telos schema notes (vendored from gitignored temp/ scratch)
├── favicon.ico
├── 404.html · robots.txt · sitemap.xml
├── LICENSE (MIT)
├── site.webmanifest
└── vercel.json
```

Storage keys: `reflection-global-theme`, `reflection-annual-v1` (auto-migrates legacy `reflection-mobile-responses` once), `reflection-telos-v1`, `reflection-blank-v1` + `reflection-blank-font`.

## Getting Started

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

No build step. Force a theme with `?theme=light` or `?theme=dark`.

## Deployment

Production: <https://reflection-phi.vercel.app> — the repo is connected to Vercel, so every push to `master` deploys.

If the production domain ever changes, update `robots.txt` and `sitemap.xml` to match. Keep `vercel.json` schema-valid: Vercel rejects unknown top-level keys (a stray `excludeFiles` silently broke deploys once — see above).

`temp/` holds gitignored scratch (including the original telos notes); the committed copy lives at `docs/telos-framework.md`.

---
*Stay reflective. Write better.*
