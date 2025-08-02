# dom-data-extractor

Chrome extension and automation tools for web scraping, DOM analysis, and interactive element detection. Includes XPath generation, node data extraction, and comprehensive debugging tools for web automation projects.

## Projects

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
- `TROUBLESHOOTING.md`: Comprehensive troubleshooting guide

## About

This repository serves as a lab for experimenting with AI and automation technologies, including:

- **Machine Learning**: TensorFlow implementations
- **Computer Vision**: OpenCV-based image processing
- **Web Automation**: Chrome extensions and DOM interaction
- **Real-world Applications**: Practical automation solutions

## Technologies Used

- Python
- Chrome Extensions (JavaScript)
- Web Technologies (HTML, CSS, JavaScript)

## Getting Started

Each project in this repository has its own setup instructions. See individual project folders for specific requirements and installation steps.
