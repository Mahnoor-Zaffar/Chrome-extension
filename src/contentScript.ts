chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'get-page-content') {
    sendResponse({ html: document.documentElement.outerHTML, url: location.href });
  }
});
