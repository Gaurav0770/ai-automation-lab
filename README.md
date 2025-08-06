

### Chrome Extension - Node Data Printer

A minimal Chrome extension that prints node data for interactive elements, similar to the nanobrowser extension.

#### Features

- Prints node data for all interactive elements (`a`, `button`, `input`, `select`, `textarea`, `label`)
- Click tracking: Logs clicked elements and their detailed node data in real-time

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