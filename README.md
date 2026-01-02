# Reflection: Review & Write

A minimalist, atmospheric web application for annual reflection and focused writing. It combines a structured review template with a "Zen" writing environment, now with responsive mobile and desktop versions.

## Features

### 🖥️ **Desktop Version (split-view.html)**
- **Resizable Split-View**: Adjust the balance between the reflection template and the writing pad.
- **Modern Wisdom Annual Review**: A curated list of deep reflection questions and memory prompts.
- **Zen Writer**: A clean, distraction-free markdown-style editor with:
  - Rich text formatting (Bold, Italic, Headers)
  - Font cycling (Mono, Serif, Sans)
  - One-click copy to clipboard
- **Independent ASCII Backgrounds**:
  - **Left (Template)**: Clean background for focus.
  - **Right (Writer)**: Subtle, centered, animated ASCII wave pattern for atmosphere.

### 📱 **Mobile Version (mobile.html)**
- **Touch-Optimized Interface**: Single-column layout designed for mobile devices.
- **Auto-Resizing Inputs**: Textarea fields that expand as you type.
- **Simplified Background**: Centered ASCII wave pattern for better mobile performance.
- **Bold Question Formatting**: Enhanced readability on mobile screens.
- **Responsive Typography**: Scales appropriately for different screen sizes.

### 🔄 **Smart Detection & Routing**
- **Automatic Device Detection**: Width-based detection (768px breakpoint) redirects to appropriate version.
- **Manual Override**: Version switch buttons allow users to choose mobile/desktop regardless of device.
- **Seamless Experience**: Maintains separate localStorage for each version.

### 💾 **Persistence & Features**
- **Auto-Save**: Content persists across page refreshes in both versions.
- **Dark Mode**: Toggle between light and dark themes with persistent preference.
- **No Accounts Required**: Everything saved locally to your browser's `localStorage`.

## Live Interaction

### Desktop
- **Resizable Divider**: Drag the center bar to change the layout (40/60 split by default).
- **Copy**: Use the "Copy" button in the toolbar to quickly export your writing.
- **Version Switch**: Click "MOBILE" to switch to mobile version.

### Mobile
- **Auto-Resizing Fields**: Textareas expand as you type for comfortable input.
- **Touch-Friendly**: Optimized spacing and button sizes for mobile interaction.
- **Version Switch**: Click "DESKTOP" to switch to desktop version.

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript.
- **Fonts**: Google Fonts (Cormorant Garamond, Inter, JetBrains Mono).
- **Persistence**: Browser `localStorage` API.
- **Animations**: Mathematical ASCII art rendering via `requestAnimationFrame`.
- **Responsive Design**: CSS Grid, Flexbox, and Mobile-First approach.

## File Structure

```
reflection/
├── index.html          # Entry point with mobile detection
├── mobile.html         # Mobile-optimized version
├── split-view.html     # Desktop split-view version
├── archive/            # Archived old versions
│   ├── app.html
│   └── notebook.html
├── README.md
└── vercel.json         # Deployment configuration
```

## Getting Started

### Local Development
Open any of the main files directly in your browser:

```bash
# Auto-detecting entry point
xdg-open index.html

# Or open specific versions
xdg-open split-view.html  # Desktop
xdg-open mobile.html      # Mobile
```

### Deployment
The application is configured for Vercel deployment with automatic routing:
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy - Vercel will handle routing automatically

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Android Chrome
- **Features Used**: ES6+, CSS Grid, Flexbox, localStorage, requestAnimationFrame

---
*Stay reflective. Write better.*
