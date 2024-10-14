chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab): Promise<void> => {
  console.log('NotionRoll');
  if (tab.url && !tab.url.includes('chrome://')) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ['content.ts']
    });
  }
});
