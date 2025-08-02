# Troubleshooting Guide for Node Data Printer Extension

## Common Issues and Solutions

### 1. Extension Not Loading
**Symptoms:** No console logs appear, extension doesn't work
**Solutions:**
- Reload the extension in Chrome Extensions page
- Check if extension is enabled
- Clear browser cache and reload page

### 2. Content Script Not Injecting
**Symptoms:** No "Node Data Printer: Content script injected" message in console
**Solutions:**
- Check manifest.json permissions
- Ensure host_permissions includes target URLs
- Try clicking the extension icon to manually inject

### 3. Console Errors
**Symptoms:** JavaScript errors in console
**Solutions:**
- Check browser console for specific error messages
- Ensure all files are properly loaded
- Verify manifest.json syntax

## Debugging Steps

### Step 1: Check Extension Installation
1. Go to `chrome://extensions/`
2. Find "Node Data Printer" extension
3. Ensure it's enabled (toggle should be blue)
4. Check for any error messages

### Step 2: Test on Local File
1. Open `test.html` in Chrome
2. Open Developer Tools (F12)
3. Check Console tab for extension messages
4. Look for "Node Data Printer: Content script injected"

### Step 3: Manual Injection Test
1. Open any webpage
2. Open Developer Tools Console
3. Click the extension icon
4. Check for "Content script injected successfully" message

### Step 4: Debug Script Test
1. In Developer Tools Console, paste the contents of `debug.js`
2. Press Enter to run it
3. Check output for debugging information

## Expected Console Output

When working correctly, you should see:
```
Node Data Printer: Content script injected
Node Data Printer: Script loaded successfully
Current URL: [page URL]
Document ready state: [state]
=== INTERACTIVE NODEDATA ===
Found X interactive elements
[element data...]
=== END INTERACTIVE NODEDATA ===
=== ALL NODEDATA ===
Found Y total elements
[node data...]
=== END ALL NODEDATA ===
```

## File Structure Check

Ensure these files exist and are in the correct location:
- `manifest.json` - Extension configuration
- `content.js` - Main content script
- `background.js` - Background service worker
- `test.html` - Test page

## Permissions Check

The extension requires these permissions:
- `activeTab` - Access to current tab
- `scripting` - Ability to inject scripts
- `host_permissions: ["<all_urls>"]` - Access to all websites

## Common Error Messages

- **"Cannot access a chrome:// URL"** - Extension can't run on Chrome internal pages
- **"Refused to load"** - Content Security Policy blocking script
- **"Manifest version 3"** - Ensure using Manifest V3 format
- **"Permission denied"** - Check manifest permissions

## Testing Checklist

- [ ] Extension loads without errors in chrome://extensions/
- [ ] Content script injects on test.html
- [ ] Console shows expected debug messages
- [ ] Interactive elements are detected
- [ ] Node data is printed to console
- [ ] Extension icon click works
- [ ] Works on different websites 