// Add context menu for downloading links
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadFile") {
    chrome.runtime.sendMessage({
      type: "startDownload",
      url: request.url
    });
  }
});

// Add right-click menu option
document.addEventListener('contextmenu', (event) => {
  const target = event.target;
  if (target.tagName === 'A' && target.href) {
    chrome.runtime.sendMessage({
      action: "createContextMenu",
      url: target.href
    });
  }
});