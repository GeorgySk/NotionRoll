chrome.action.onClicked.addListener(async (tab) => {
  console.log('NotionRoll');
  if (!tab.url.includes('chrome://')) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});