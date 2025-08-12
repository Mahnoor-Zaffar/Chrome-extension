import { extractArticle } from '../reader';

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'extract-article') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(msg.html, 'text/html');
    const result = extractArticle(doc);
    sendResponse(result);
  }
  return true;
});
