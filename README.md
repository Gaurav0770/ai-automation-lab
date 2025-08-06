

### Chrome Extension - Node Data Printer

A minimal Chrome extension that prints node data for interactive elements, similar to the nanobrowser extension.

#### Features

- Prints node data for all interactive elements (`a`, `button`, `input`, `select`, `textarea`, `label`)
- Generates XPath for each element
- Checks element visibility
- Extracts attributes, values, and other relevant properties
- Works on all websites
- Automatically runs when page loads

#### Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `chrome-extension-node-data` folder
5. The extension will be installed and active

#### Usage

1. Navigate to any website
2. Open the browser's Developer Tools (F12 or right-click → Inspect)
3. Go to the Console tab
4. The extension will automatically print node data when the page loads

#### Output Format

The extension prints two types of data:

##### Interactive Node Data
```
=== INTERACTIVE NODEDATA ===
Interactive element (input): {tagName: 'input', attributes: {...}, xpath: '...', children: Array(0), isVisible: false}
=== END INTERACTIVE NODEDATA ===
```

##### All Node Data
```
=== ALL NODEDATA ===
Node 0: {tagName: 'div', attributes: {...}, xpath: '...', children: Array(0), isVisible: false}
Node 1: {tagName: 'div', attributes: {...}, xpath: '...', children: Array(0), isVisible: true, ...}
=== END ALL NODEDATA ===
```

#### Node Data Structure

Each node contains:
- `tagName`: The HTML tag name
- `attributes`: Object containing all element attributes
- `xpath`: XPath expression to locate the element
- `children`: Array of child elements (empty for this minimal version)
- `isVisible`: Boolean indicating if element is visible
- `textContent`: Text content if available
- `value`: Value for input elements
- `href`: Href for anchor elements
- `placeholder`: Placeholder text for input elements
- `type`: Input type for input elements

#### Files

- `manifest.json`: Extension configuration
- `content.js`: Main script that runs on web pages
- `background.js`: Background service worker
- `debug.js`: Debugging script for testing
- `test.html`: Test page with various interactive elements

## Current Technology Stack

- **JavaScript**: Chrome extension development
- **HTML/CSS**: Test pages and UI components
- **Chrome Extension APIs**: Manifest V3, content scripts, background workers
- **Web Technologies**: DOM manipulation, XPath generation

## Technologies Used

- Python
- Chrome Extensions (JavaScript)
- Web Technologies (HTML, CSS, JavaScript)

### Current Setup
The Chrome extension requires no additional dependencies - just load it into Chrome as described in the installation section above.
