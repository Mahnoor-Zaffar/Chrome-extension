import { simpleExtract } from './extract.js';

chrome.action.onClicked.addListener(async (tab) => {
  const [{ result: html }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.outerHTML,
  });

  const article = simpleExtract(html);
  article.url = tab.url;
  article.addedAt = Date.now();

  const { articles = [] } = await chrome.storage.local.get('articles');
  articles.unshift(article);
  await chrome.storage.local.set({ articles });

  await chrome.sidePanel.open({ tabId: tab.id });
});

