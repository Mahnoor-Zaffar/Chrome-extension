import { db } from './db';

async function ensureOffscreen() {
  const has = await chrome.offscreen.hasDocument?.();
  if (has) return;
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('src/offscreen/offscreen.html'),
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: 'parse articles'
  });
}

async function saveCurrentArticle(tabId: number) {
  const response = await chrome.tabs.sendMessage(tabId, { type: 'get-page-content' });
  if (!response) return;
  await ensureOffscreen();
  const parsed = await chrome.runtime.sendMessage({ type: 'extract-article', html: response.html });
  if (!parsed) return;
  await db.articles.add({
    url: response.url,
    title: parsed.title,
    content: parsed.content,
    addedAt: Date.now(),
    read: false
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await saveCurrentArticle(tab.id);
  await chrome.sidePanel.open({ tabId: tab.id });
});
