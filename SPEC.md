# Chrome Side Panel Read-It-Later Extension Specification

## Problem & Goals
- Provide a lightweight, privacy-first "read-it-later" tool embedded in Chrome's side panel.
- Differentiates from Pocket or Reading List by operating entirely on-device, avoiding account creation, and focusing on temporary, local library management.
- Primary target: Desktop Chrome; Chromium-based browsers such as Edge are a stretch goal.
- No server-side account or cloud storage for MVP.

## User Stories & Flows
### MVP
1. Click browser action or press shortcut to open side panel.
2. Capture current article, parse into distraction-free reader view, and save locally without opening new tabs.
3. Context menu item "Save to Later" on links and pages.
4. Add optional tags; search saved items; mark read/unread; delete entries.
5. Automatic expiration choices: 30, 60, or 90 days.

### v1.0 Enhancements
- Bulk import from open tabs.
- Per-site extraction rules.
- "Save All" on page.
- Export library to PDF, Markdown, or EPUB.
- Optional cross-device metadata sync.

## Chrome APIs
- `chrome.sidePanel` for side panel UI (Manifest V3 permission and open/close behavior)[1].
- MV3 service worker orchestrates background tasks and message passing among service worker, content scripts, and side panel[2][3].
- `chrome.offscreen` to handle DOM-dependent parsing tasks outside service worker[4].
- Storage options: `chrome.storage.local` and `chrome.storage.sync` with quota considerations[5]; IndexedDB via Dexie for primary library store with StorageManager for persistence[6][7].
- File System Access API for export/import workflows[8].
- DeclarativeNetRequest for optional reader-view privacy rules, acknowledging its inability to bypass network requests or paywalls[9].

## Article Extraction & Reader Mode
- Lawful extraction only; respects site Terms of Service and excludes paywall bypass.
- Parser options:
  - **Mozilla Readability** (JS) – robust, MPL-2.0 licensed[10].
  - **Postlight Parser** – alternative maintained project, Apache-2.0 licensed[11].
- Sanitization with DOMPurify to remove dangerous markup[12].
- Fallback heuristics for dynamic SPA sites when parsers fail.
- Reader UI: configurable typography, light/dark/system themes, image handling, estimated read time, link footnotes.

## Filtering Logic
- Rules-based filters: domain, section, keyword, minimum word count.
- Quick-save affordances: context menu, toolbar button, keyboard shortcut.
- Optional on-device ranking using TF-IDF or small embeddings, no network calls.

## Storage & Lifecycle
- Data model includes URL, canonical URL, title, site, publishDate, extracted HTML, clean text, lead image, tags, read/unread state, addedAt, lastOpened, wordCount.
- IndexedDB (Dexie) as primary store with quota awareness and eviction strategies.
- Optional sync of metadata via `chrome.storage.sync` (limited by quotas).
- Retention policy: items auto-purge after selected duration; manual purge available.
- Migration plan: versioned Dexie schema upgrades.

## Security, Privacy, Compliance
- Minimal permissions: `sidePanel`, `storage`, `offscreen`, `contextMenus`, `scripting` (for content scripts), optional `declarativeNetRequest`.
- Content sanitized via DOMPurify; strict Content Security Policy; no remote code execution.
- Accessibility: WCAG 2.2 AA compliance for side panel and reader view.
- **Compliance statement:** "This extension will not and must not bypass or remove paywalls, subscription requirements, login gates, or other access controls. It will only save content the user can legally access in their current session, and it will respect site terms and Chrome Web Store policies."

## Recommended Tech Stack
- Language: TypeScript.
- UI Framework: React or Svelte for side panel; Tailwind CSS for styling.
- Build: Vite with Plasmo or CRXJS for MV3 packaging.
- Data: IndexedDB managed by Dexie.
- Parsing: Mozilla Readability primary; Postlight Parser optional.
- State: Redux Toolkit/Zustand (React) or Svelte stores.
- Testing: Playwright for E2E; Vitest/Jest for unit tests; regression corpus for parsers.

## Architecture & Components
- **Service Worker:** lifecycle management, alarms for purge, routing of messages.
- **Content Script:** injects into pages to capture article metadata and user triggers.
- **Offscreen Document:** handles parsing when DOM access is required outside active tab.
- **Side Panel App:** library management and reader UI.
- Message passing via `chrome.runtime` messaging; robust error handling and background tasks.

## Performance Targets & Local Telemetry
- Parsing typical article < 400 ms.
- Side panel open/render < 150 ms.
- Memory budget suitable for 2–3k stored items.
- Local-only analytics stored in IndexedDB; no external network calls.

## MVP Acceptance Criteria & Test Plan
- Capture, parse, render, search, tag, delete, and expire articles.
- Cross-site tests: static pages, soft paywalls, infinite scroll sites.
- Offline reading support.
- Dark mode switching.
- Keyboard shortcuts for open/save actions.
- Playwright E2E tests covering extension flows.
- Unit tests for parser outputs and sanitization logic.

## Delivery & Risks
- Milestones: Design → MVP Build → Parser Tuning → QA → Store Submission.
- Risks: varying site structures, parser accuracy, storage quotas, permissions review.
- Mitigations: fallback parsing heuristics, local quota checks, early Chrome Web Store review.

## Engineering Appendices
### manifest.json (MV3 skeleton)
```json
{
  "manifest_version": 3,
  "name": "Side Panel Reader",
  "version": "0.1.0",
  "permissions": ["storage", "sidePanel", "offscreen", "contextMenus", "scripting"],
  "action": { "default_title": "Save to Later" },
  "icons": { "48": "icons/icon48.png", "128": "icons/icon128.png" },
  "background": { "service_worker": "background.js" },
  "side_panel": { "default_path": "sidepanel.html" }
}
```

### Content Script Trigger
```js
// content-script.js
chrome.runtime.sendMessage({ type: 'CAPTURE_PAGE' });
```

### Message Passing
```js
// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CAPTURE_PAGE') {
    // handle capture
  }
});
```

### Dexie Schema
```ts
import Dexie, { Table } from 'dexie';

interface Article {
  url: string;
  canonicalUrl?: string;
  title: string;
  site: string;
  publishDate?: string;
  html: string;
  text: string;
  leadImage?: string;
  tags: string[];
  read: boolean;
  addedAt: number;
  lastOpened?: number;
  wordCount: number;
}

class ArticleDB extends Dexie {
  articles!: Table<Article, string>;
  constructor() {
    super('articles');
    this.version(1).stores({
      articles: '&url, title, site, tags, read, addedAt'
    });
  }
}
```

### Offscreen Document Creation
```js
await chrome.offscreen.createDocument({
  url: 'offscreen.html',
  reasons: ['DOM_PARSER'],
  justification: 'Parse article HTML when no tab is active'
});
```

### Readability Usage
```js
import { Readability } from '@mozilla/readability';
const doc = new DOMParser().parseFromString(html, 'text/html');
const article = new Readability(doc).parse();
```

### File Export (optional)
```js
const handle = await window.showSaveFilePicker({ types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }] });
const writable = await handle.createWritable();
await writable.write(content);
await writable.close();
```

## References
[1] Chrome Developers. "Side Panel API". https://developer.chrome.com/docs/extensions/reference/sidePanel
[2] Chrome Developers. "Service Workers Overview". https://developer.chrome.com/docs/extensions/service_workers
[3] Chrome Developers. "Message Passing". https://developer.chrome.com/docs/extensions/mv3/messaging
[4] Chrome Developers. "Offscreen Documents". https://developer.chrome.com/docs/extensions/reference/offscreen
[5] Chrome Developers. "Storage API". https://developer.chrome.com/docs/extensions/reference/storage
[6] Chrome Developers. "StorageManager". https://developer.mozilla.org/docs/Web/API/StorageManager/persist
[7] Dexie.js Docs. "StorageManager". https://dexie.org/docs/StorageManager
[8] Chrome Developers. "File System Access API". https://developer.chrome.com/docs/web-platform/file-system-access
[9] Chrome Developers. "DeclarativeNetRequest API". https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest
[10] Mozilla Readability (GitHub). https://github.com/mozilla/readability
[11] Postlight Parser (GitHub). https://github.com/postlight/parser
[12] DOMPurify (GitHub). https://github.com/cure53/DOMPurify
