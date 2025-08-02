# Installation Guide

## Quick Setup

1. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Or navigate: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `chrome-extension-node-data` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Node Data Printer" in the extensions list
   - The extension icon should appear in your Chrome toolbar

## Testing the Extension

1. **Open the test page**
   - Open `test.html` in Chrome (File → Open File)
   - Or navigate to any website

2. **Open Developer Tools**
   - Press F12 or right-click → Inspect
   - Go to the "Console" tab

3. **Check Output**
   - You should see node data printed automatically
   - Look for "=== INTERACTIVE NODEDATA ===" sections
   - Look for "=== ALL NODEDATA ===" sections

## Expected Output

The extension will print data like this:

```
=== INTERACTIVE NODEDATA ===
Interactive element (input): {tagName: 'input', attributes: {...}, xpath: 'html/body/div[1]/div[3]/form/div[1]/div/input[1]', children: Array(0), isVisible: false}
Interactive element (button): {tagName: 'button', attributes: {...}, xpath: 'html/body/div[1]/div[4]/div/div[1]/span/button', children: Array(3), isVisible: true, ...}
=== END INTERACTIVE NODEDATA ===
```

## Troubleshooting

- **Extension not loading**: Make sure all files are in the correct folder
- **No output**: Check that the extension is enabled and the page is fully loaded
- **Console errors**: Check the Console tab in Developer Tools for any JavaScript errors 