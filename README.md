# Reflection: Review & Write

A minimalist, atmospheric web app for reflection and focused writing — now with multiple practices. Pick one from the landing page. No accounts, everything in `localStorage`.

Live pages:
- `index.html` — landing / chooser (Annual · Telos · Blank)
- `split-view.html` / `mobile.html` — Annual Review (desktop split writer / mobile inputs)
- `telos.html` — Telos Builder (Problems → Mission → Narratives → Goals → History → Challenges → Strategies → Logs → red-team prompt, exports `telos.md`)
- `blank.html` — Blank zen page (font cycle, word count, copy + download)

## Fixes shipped (Oct 2026 pass)

- Shared `assets/css/shared.css` + `assets/js/shared.js`: theme, clipboard fallback, sanitize, auto-resize, debounced storage, download, ASCII animator, modern bold/italic/H1/H2 (no `execCommand` for formatting).
- Early theme apply (no FOUC), button label = action (`Light` when dark).
- Fonts via `<link preconnect>` not `@import`; meta description + OG.
- Relative `./` links (works under subpaths), annual card auto-picks mobile/desktop by width.
- ASCII pauses on `visibilitychange`, static when `prefers-reduced-motion`.
- Toolbar visible on `pointer:coarse` + `:focus-within`; split-view stacks under 760px.
- `innerHTML` restore sanitized (strips scripts, `on*`, `javascript:`).
- Export **Copy** + **Download .md** everywhere; telos export matches `temp/telos-info.md` schema.
- PWA: PNG 192/512 + apple-touch 180px in `assets/icons/`, manifest uses relative paths + `maskable`.
- `vercel.json`: `cleanUrls`, long cache for `/assets/*`, excludes `archive/**`, `temp/**`. Added `.gitignore`.

## Telos format

Based on `temp/telos-info.md` (NetworkChuck / Daniel Miessler): Problems, Missions (`I think one of the biggest problems is [X], which is why I am focusing on [Y].`), Narratives (8/15/30-sec), Goals (SMART checkboxes), History, Challenges, Strategies, Logs (`YYYY-MM-DD`), plus red-team prompt:

> Review my stated missions and goals against my daily logs. Identify my top three blind spots, call out where I am confusing busywork with actual progress, and highlight where my execution contradicts my stated priorities.

## File Structure

```
reflection/
├── index.html          # Landing chooser
├── telos.html          # Telos builder (responsive)
├── blank.html          # Blank writer (responsive)
├── mobile.html         # Annual — mobile inputs (legacy, patched)
├── split-view.html     # Annual — desktop split (legacy, patched)
├── assets/
│   ├── css/shared.css
│   ├── js/shared.js
│   ├── icons/*.png
│   └── *.svg
├── archive/            # Old versions (excluded from deploy)
├── site.webmanifest
└── vercel.json
```

Storage keys: `reflection-global-theme`, `reflection-telos-v1`, `reflection-blank-v1`, `reflection-mobile-responses` (legacy), `zenwriter-content` + `zenwriter-font` (legacy).

## Getting Started

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

No build step.

---
*Stay reflective. Write better.*
