// Debug script to test if the extension is working
console.log('=== DEBUG SCRIPT LOADED ===');
console.log('Current URL:', window.location.href);
console.log('Document ready state:', document.readyState);
console.log('Extension test: Node Data Printer should be working');

// Test if we can find interactive elements
const testElements = document.querySelectorAll('a, button, input, select, textarea, label');
console.log(`Found ${testElements.length} interactive elements for testing`);

// Test if we can access extension APIs
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('Chrome extension APIs are available');
    console.log('Extension ID:', chrome.runtime.id);
} else {
    console.log('Chrome extension APIs are NOT available');
}

console.log('=== END DEBUG SCRIPT ==='); 