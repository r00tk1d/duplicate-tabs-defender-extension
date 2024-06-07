chrome.tabs.onCreated.addListener(newTab => {
    if (newTab.url) {
        defendTabDuplication(newTab, newTab.url, newTab.windowId);
    }
});

chrome.tabs.onUpdated.addListener((updatedTabId, updateInfo, updatedTab) => {
    if (updateInfo.url) {
        defendTabDuplication(updatedTab, updateInfo.url, updatedTab.windowId);
    }
});

function removeFragment(url) {
    const fragmentIndex = url.indexOf('#');
    if (fragmentIndex !== -1) {
        return url.slice(0, fragmentIndex);
    }
    return url;
}

function defendTabDuplication(currentTab, currentTabUrl, currentWindowId) {

    const currentTabUrlWithoutFragment = removeFragment(currentTabUrl);
    chrome.tabs.query({ windowId: currentWindowId }, tabs => {
        const duplicateTab = tabs.find(tab => tab.id !== currentTab.id && removeFragment(tab.url) === currentTabUrlWithoutFragment);
        if (duplicateTab) {
            // pinned tabs privilege
            if (currentTab.pinned) {
                chrome.tabs.update(currentTab.id, { active: true });
                chrome.tabs.remove(duplicateTab.id);
            } else {
                chrome.tabs.update(duplicateTab.id, { active: true });
                chrome.tabs.remove(currentTab.id);
            }
        }
    });
}