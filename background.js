chrome.tabs.onCreated.addListener(newTab => {
    if (newTab.url) {
        defendTabDuplication(newTab.id, newTab.url, newTab.windowId);
    }
});

chrome.tabs.onUpdated.addListener((updatedTabId, updateInfo, updatedTab) => {
    if (updateInfo.url) {
        defendTabDuplication(updatedTabId, updateInfo.url, updatedTab.windowId);
    }
});

function defendTabDuplication(currentTabId, currentTabUrl, currentWindowId) {
    chrome.tabs.query({ windowId: currentWindowId }, tabs => {
        const duplicateTab = tabs.find(tab => tab.id !== currentTabId && tab.url === currentTabUrl);
        if (duplicateTab) {
            chrome.tabs.update(duplicateTab.id, { active: true });
            chrome.tabs.remove(currentTabId);
        }
    });
}

