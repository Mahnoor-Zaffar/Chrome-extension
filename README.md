# Side Panel Read-It-Later Extension

This is a minimal Chrome extension that saves the current page and shows saved articles in the Chrome side panel.

## Load the extension
1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Try it
1. Open `demo.html` in Chrome.
2. Click the extension icon labelled *Save to Read Later*.
3. The side panel opens with the page listed. Click the title to read the text.

Saved pages are stored locally using `chrome.storage.local` and cleared only when you remove them manually or uninstall the extension.

