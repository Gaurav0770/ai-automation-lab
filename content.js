// Interactive element types to track
const INTERACTIVE_ELEMENTS = ['a', 'button', 'input', 'select', 'textarea', 'label'];

// Function to get XPath of an element
function getXPath(element) {
    if (element.id !== '') {
        return `//*[@id="${element.id}"]`;
    }
    if (element === document.body) {
        return '/html/body';
    }
    if (element === document.documentElement) {
        return '/html';
    }
    
    let ix = 0;
    let siblings = element.parentNode.childNodes;
    
    for (let sibling of siblings) {
        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// Function to check if element is visible
function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           parseFloat(style.opacity) > 0 &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
}

// Function to extract attributes
function getAttributes(element) {
    const attributes = {};
    for (let attr of element.attributes) {
        attributes[attr.name] = attr.value;
    }
    return attributes;
}

// Function to build node data
function buildNodeData(element, nodeIndex = 0) {
    const xpath = getXPath(element);
    const isVisible = isElementVisible(element);
    
    const nodeData = {
        tagName: element.tagName.toLowerCase(),
        attributes: getAttributes(element),
        xpath: xpath,
        children: [],
        isVisible: isVisible
    };
    
    // Add text content if available
    if (element.textContent && element.textContent.trim()) {
        nodeData.textContent = element.textContent.trim();
    }
    
    // Add value for input elements
    if (element.value !== undefined) {
        nodeData.value = element.value;
    }
    
    // Add href for anchor elements
    if (element.href) {
        nodeData.href = element.href;
    }
    
    // Add placeholder for input elements
    if (element.placeholder) {
        nodeData.placeholder = element.placeholder;
    }
    
    // Add type for input elements
    if (element.type) {
        nodeData.type = element.type;
    }
    
    return nodeData;
}

// Function to find all interactive elements
function findInteractiveElements() {
    const interactiveElements = [];
    
    INTERACTIVE_ELEMENTS.forEach(tagName => {
        const elements = document.querySelectorAll(tagName);
        elements.forEach(element => {
            const nodeData = buildNodeData(element);
            interactiveElements.push({
                element: element,
                nodeData: nodeData
            });
        });
    });
    
    return interactiveElements;
}

// Function to print interactive node data
function printInteractiveNodeData() {
    try {
        const interactiveElements = findInteractiveElements();
        
        console.log('=== INTERACTIVE NODEDATA ===');
        console.log(`Found ${interactiveElements.length} interactive elements`);
        interactiveElements.forEach(({element, nodeData}) => {
            console.log(`Interactive element (${nodeData.tagName}):`, nodeData);
        });
        console.log('=== END INTERACTIVE NODEDATA ===');
    } catch (error) {
        console.error('Error printing interactive node data:', error);
    }
}

// Function to print all node data (similar to nanobrowser)
function printAllNodeData() {
    try {
        const allElements = document.querySelectorAll('*');
        const allNodeData = [];
        
        allElements.forEach((element, index) => {
            const nodeData = buildNodeData(element, index);
            allNodeData.push(nodeData);
        });
        
        console.log('=== ALL NODEDATA ===');
        console.log(`Found ${allNodeData.length} total elements`);
        // Uncomment if Node data is required
        {/*
            allNodeData.forEach((nodeData, index) => {
            console.log(`Node ${index}:`, nodeData);
        });
        */}
        console.log('=== END ALL NODEDATA ===');
    } catch (error) {
        console.error('Error printing all node data:', error);
    }
}

// Function to setup click event listener
function setupClickEventListener() {
    window.addEventListener('click', function (event) {
        console.log('Clicked element:', event.target);
        
        // Also log the node data for the clicked element
        try {
            const clickedNodeData = buildNodeData(event.target);
        } catch (error) {
            console.error('Error building node data for clicked element:', error);
        }
    });
    
    console.log('Node Data Printer: Click event listener attached to window');
}

// Main function to run when page loads
function main() {
    try {
        console.log('Node Data Printer: Script loaded successfully');
        console.log('Current URL:', window.location.href);
        console.log('Document ready state:', document.readyState);
        
        // Setup click event listener immediately
        setupClickEventListener();
        
        // Wait a bit for page to fully load, then print initial data
        setTimeout(() => {
            printInteractiveNodeData();
            printAllNodeData();
        }, 1000);
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

// Also run when page changes (for SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => {
            // Re-setup click listener for new page content
            setupClickEventListener();
            printInteractiveNodeData();
            printAllNodeData();
        }, 1000);
    }
}).observe(document, {subtree: true, childList: true});

// Log that script has been injected
console.log('Node Data Printer: Content script injected');