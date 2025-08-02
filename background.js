// Background script for Node Data Printer extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Node Data Printer extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    console.log('Extension icon clicked on tab:', tab.id);
    
    try {
        // Inject the content script manually when icon is clicked
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
        console.log('Content script injected successfully');
    } catch (error) {
        console.error('Failed to inject content script:', error);
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received from content script:', message);
    sendResponse({ received: true });
}); 