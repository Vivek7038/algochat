// Listen for tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url?.includes('algochurn.com')) {
    // Send message to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'URL_CHANGED',
      url: changeInfo.url
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
}); 