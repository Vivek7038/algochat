if (process.env.NODE_ENV === 'development') {
  let lastReload = Date.now();

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'RELOAD_EXTENSION' && Date.now() - lastReload > 1000) {
      lastReload = Date.now();
      chrome.runtime.reload();
      sendResponse({ reloaded: true });
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
}); 