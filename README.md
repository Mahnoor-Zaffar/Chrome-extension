# Chrome-extension


# 📚 QuickRead SidePanel — A Chrome Extension for Clean, Offline Article Saving

**QuickRead SidePanel** is a privacy-first, on-device “read-it-later” Chrome extension.  
It lives in the browser’s **side panel**, letting you **save distraction-free versions of news articles** you’re reading — instantly, without leaving the page.

Think **Pocket**, but:
- No accounts
- No cloud storage
- No tracking
- **Fully local and offline-ready**

---

## ✨ Features (MVP)

- 📌 **One-click save** from toolbar, context menu, or keyboard shortcut
- 📰 **Reader Mode**: clean typography, no ads, no clutter
- 📂 **Temporary Library**: search, tag, mark as read/unread
- ⏳ **Auto-expire** old items (30 / 60 / 90 days)
- 🖤 **Dark / Light mode** reading
- 🔒 **Privacy-first**: stores everything locally in your browser

---

## 🚀 Installation

> ⚠️ This project is in active development and not yet in the Chrome Web Store.

### Developer Install (Chrome)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/quickread-sidepanel.git
   cd quickread-sidepanel


2. Install dependencies:

      bash
      Copy
      Edit
      npm install


3. Build the extension:

      bash
      Copy
      Edit
      npm run build


Load in Chrome:
      Go to chrome://extensions/
      Enable Developer Mode
      Click Load Unpacked
      Select the /dist folder

Tech Stack
TypeScript — safer, cleaner code

React + Tailwind CSS — side panel UI

Dexie.js — IndexedDB wrapper for storing saved articles

Mozilla Readability — extracting clean article content

Vite + CRXJS/Plasmo — fast MV3 builds

Chrome SidePanel API — native side panel integration

DOMPurify — sanitizing extracted HTML

📸 Screenshots
(Coming soon)

⚖️ Compliance
This extension:

Does not bypass paywalls or subscriptions

Only saves content you can legally view

Complies with Chrome Web Store policies

📜 License
MIT License — see LICENSE

🤝 Contributing
We welcome contributions! See CONTRIBUTING.md.
