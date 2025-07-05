document.addEventListener('DOMContentLoaded', function() {
  const serverUrlInput = document.getElementById('serverUrl');
  const saveButton = document.getElementById('saveSettings');
  const lastDownloadSpan = document.getElementById('lastDownload');
  
  // Load saved settings
  chrome.storage.sync.get(['serverUrl', 'lastDownload'], function(data) {
    if (data.serverUrl) {
      serverUrlInput.value = data.serverUrl;
    }
    if (data.lastDownload) {
      lastDownloadSpan.textContent = data.lastDownload;
    }
  });
  
  // Save settings
  saveButton.addEventListener('click', function() {
    chrome.storage.sync.set({
      serverUrl: serverUrlInput.value
    }, function() {
      alert('Settings saved!');
    });
  });
  
  // Listen for download updates
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'downloadComplete') {
      lastDownloadSpan.textContent = request.filename;
      chrome.storage.sync.set({lastDownload: request.filename});
    }
  });
});