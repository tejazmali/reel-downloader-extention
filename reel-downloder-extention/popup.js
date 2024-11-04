document.getElementById('download-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const reelUrl = tab.url;

  if (reelUrl.includes("instagram.com/reel")) {
    document.getElementById('status').textContent = 'Downloading...';

    // Fetch video URL from the page
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const videoElement = document.querySelector('video');
          return videoElement ? videoElement.src : null;
        },
      },
      async (results) => {
        const videoUrl = results[0].result;

        if (videoUrl) {
          // Download the reel video
          chrome.downloads.download({ url: videoUrl, filename: 'Instagram_Reel.mp4' }, (downloadId) => {
            if (chrome.runtime.lastError) {
              document.getElementById('status').textContent = 'Download failed. Please try again.';
              console.error(chrome.runtime.lastError.message);
            } else {
              document.getElementById('status').textContent = 'Download complete!';
              document.getElementById('share-btn').disabled = false; // Enable the share button
            }
          });
        } else {
          document.getElementById('status').textContent = 'Failed to find video URL.';
        }
      }
    );
  } else {
    document.getElementById('status').textContent = 'Not an Instagram reel page.';
  }
});

// Add event listener for "Share to Snapchat" button
document.getElementById('share-btn').addEventListener('click', () => {
  // Open Snapchat Web in a new tab
  chrome.tabs.create({ url: "https://web.snapchat.com/" });

  // Optionally, display a message to guide the user
  document.getElementById('status').textContent = "Snapchat opened. Please upload the video manually.";
});
