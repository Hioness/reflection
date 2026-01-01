# Reflection: Review & Write

A minimalist, atmospheric web application for annual reflection and focused writing. It combines a structured review template with a "Zen" writing environment in a resizable split-view interface.

## Features

- **Resizable Split-View**: Adjust the balance between the reflection template and the writing pad.
- **Modern Wisdom Annual Review**: A curated list of deep reflection questions and memory prompts.
- **Zen Writer**: A clean, distraction-free markdown-style editor with:
  - Rich text formatting (Bold, Italic, Headers)
  - Font cycling (Mono, Serif, Sans)
  - One-click copy to clipboard
- **Independent ASCII Backgrounds**:
  - **Left (Template)**: Clean background for focus.
  - **Right (Writer)**: Subtle, centered, animated ASCII wave pattern for atmosphere.
- **Persistence**: Automatically saves your writing and preferences to your browser's `localStorage`. No accounts or server-side storage required.

## Live Interaction

- **Resizable Divider**: Drag the center bar to change the layout (40/60 split by default).
- **Auto-Save**: Content persists across page refreshes.
- **Copy**: Use the "Copy" button in the toolbar to quickly export your writing.

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript.
- **Fonts**: Google Fonts (Cormorant Garamond, Inter, JetBrains Mono).
- **Persistence**: Browser `localStorage` API.
- **Animations**: Mathematical ASCII art rendering via `requestAnimationFrame`.

## Getting Started

Simply open `split-view.html` in any modern web browser.

```bash
# Example for Linux
xdg-open split-view.html
```

---
*Stay reflective. Write better.*
