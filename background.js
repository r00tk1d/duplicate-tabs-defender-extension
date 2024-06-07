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

function removeFragment(url) {
    const fragmentIndex = url.indexOf('#');
    if (fragmentIndex !== -1) {
        return url.slice(0, fragmentIndex);
    }
    return url;
}

function defendTabDuplication(currentTabId, currentTabUrl, currentWindowId) {
    const currentTabUrlWithoutFragment = removeFragment(currentTabUrl);
    chrome.tabs.query({ windowId: currentWindowId }, tabs => {
        const duplicateTab = tabs.find(tab => tab.id !== currentTabId && removeFragment(tab.url) === currentTabUrlWithoutFragment);
        if (duplicateTab) {
            chrome.tabs.update(duplicateTab.id, { active: true });
            chrome.tabs.remove(currentTabId);
        }
    });
}

