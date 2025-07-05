chrome.downloads.onCreated.addListener((downloadItem) => {
  // Cancel the original download
  chrome.downloads.cancel(downloadItem.id);
  
  // Fetch the file and send to server
  fetch(downloadItem.url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.blob();
    })
    .then(blob => {
      const formData = new FormData();
      formData.append('file', blob, downloadItem.filename || 'download');
      
      // Get the server URL from storage (or use default)
      return chrome.storage.sync.get(['serverUrl'])
        .then(data => {
          const serverUrl = data.serverUrl || 'https://10e1-103-43-151-46.ngrok-free.app/api/upload/';
          return fetch(serverUrl, {
            method: 'POST',
            body: formData
          });
        });
    })
    .then(response => {
      if (!response.ok) throw new Error('Server upload failed');
      return response.json();
    })
    .then(data => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Download Complete',
        message: `File saved to remote server: ${downloadItem.filename}`
      });
      
      // Send message to update the popup UI
      chrome.runtime.sendMessage({
        type: 'downloadComplete',
        filename: downloadItem.filename,
        serverPath: data.path || 'unknown'
      });
    })
    .catch(error => {
      console.error('Error:', error);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Download Failed',
        message: `Failed to save ${downloadItem.filename} to server: ${error.message}`
      });
    });
});
