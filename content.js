// Interactive element types to track
const INTERACTIVE_ELEMENTS = ['a', 'button', 'input', 'select', 'textarea', 'label'];

// Global state tracking
let previousState = new Set();
let currentState = new Set();

// Track form interactions
let formInteractionHistory = [];

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

// Function to get current state of all elements
function getState() {
    const allElements = document.querySelectorAll('*');
    const state = new Set();
    
    allElements.forEach(element => {
        const xpath = getXPath(element);
        state.add(xpath);
    });
    
    return state;
}

// Function to find new elements by comparing states
function findNewElements() {
    const newElements = [];
    
    currentState.forEach(xpath => {
        if (!previousState.has(xpath)) {
            // Find the element by XPath
            const element = document.evaluate(
                xpath, 
                document, 
                null, 
                XPathResult.FIRST_ORDERED_NODE_TYPE, 
                null
            ).singleNodeValue;
            
            if (element) {
                const nodeData = buildNodeData(element);
                nodeData.isNew = true; // Mark as new
                newElements.push({
                    element: element,
                    nodeData: nodeData
                });
            }
        }
    });
    
    return newElements;
}

// Function to track form field interactions
function trackFormInteraction(event, interactionType) {
    const element = event.target;
    const timestamp = new Date().toISOString();
    
    const interaction = {
        timestamp: timestamp,
        type: interactionType,
        element: {
            tagName: element.tagName.toLowerCase(),
            type: element.type || 'unknown',
            id: element.id || 'no-id',
            name: element.name || 'no-name',
            placeholder: element.placeholder || 'no-placeholder',
            value: element.value || '',
            xpath: getXPath(element)
        },
        event: {
            type: event.type,
            coordinates: { x: event.clientX, y: event.clientY }
        }
    };
    
    formInteractionHistory.push(interaction);
    
    console.log(`=== FORM INTERACTION: ${interactionType.toUpperCase()} ===`);
    console.log('Element:', interaction.element);
    console.log('Event:', interaction.event);
    console.log('Current value:', element.value);
    console.log('=== END FORM INTERACTION ===');
}

// Function to handle input events (typing) - only track on blur/focus
let currentInputElement = null;
let currentInputValue = '';

function handleInput(event) {
    // Store the current input element and its value
    currentInputElement = event.target;
    currentInputValue = event.target.value;
    // Don't log immediately - wait for blur/focus
}

// Function to handle focus events (clicking into field)
function handleFocus(event) {
    // If we have accumulated input from a previous field, log it
    if (currentInputElement && currentInputElement !== event.target && currentInputValue) {
        const accumulatedEvent = {
            target: currentInputElement,
            type: 'input',
            clientX: 0,
            clientY: 0
        };
        trackFormInteraction(accumulatedEvent, 'input_complete');
    }
    
    // Reset for new field
    currentInputElement = event.target;
    currentInputValue = '';
    
    trackFormInteraction(event, 'focus');
}

// Function to handle blur events (leaving field)
function handleBlur(event) {
    // If we have accumulated input (including empty), log the complete input
    if (currentInputElement === event.target) {
        const accumulatedEvent = {
            target: event.target,
            type: 'input',
            clientX: 0,
            clientY: 0
        };
        trackFormInteraction(accumulatedEvent, 'input_complete');
    }
    
    // Reset
    currentInputElement = null;
    currentInputValue = '';
    
    trackFormInteraction(event, 'blur');
}

// Function to handle change events (value changed)
function handleChange(event) {
    trackFormInteraction(event, 'change');
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
        allNodeData.forEach((nodeData, index) => {
            console.log(`Node ${index}:`, nodeData);
        });
        console.log('=== END ALL NODEDATA ===');
    } catch (error) {
        console.error('Error printing all node data:', error);
    }
}

// Function to print form interaction history
function printFormInteractionHistory() {
    console.log('=== FORM INTERACTION HISTORY ===');
    console.log(`Total interactions: ${formInteractionHistory.length}`);
    formInteractionHistory.forEach((interaction, index) => {
        console.log(`Interaction ${index + 1}:`, interaction);
    });
    console.log('=== END FORM INTERACTION HISTORY ===');
}

// Function to handle mouse click and state tracking
function handleMouseClick(event) {
    try {
        console.log('=== MOUSE CLICK DETECTED ===');
        console.log('Clicked element:', event.target);
        console.log('Click coordinates:', { x: event.clientX, y: event.clientY });
        
        // Update states
        previousState = currentState;
        currentState = getState();
        
        // Find new elements
        const newElements = findNewElements();
        
        console.log('=== STATE COMPARISON ===');
        console.log(`Previous state elements: ${previousState.size}`);
        console.log(`Current state elements: ${currentState.size}`);
        console.log(`New elements found: ${newElements.length}`);
        
        if (newElements.length > 0) {
            console.log('=== NEW ELEMENTS DETECTED ===');
            newElements.forEach(({element, nodeData}) => {
                console.log(`NEW ELEMENT (${nodeData.tagName}):`, nodeData);
            });
            console.log('=== END NEW ELEMENTS ===');
        }
        
        console.log('=== END MOUSE CLICK ===');
    } catch (error) {
        console.error('Error handling mouse click:', error);
    }
}

// Main function to run when page loads
function main() {
    try {
        console.log('Node Data Printer: Script loaded successfully');
        console.log('Current URL:', window.location.href);
        console.log('Document ready state:', document.readyState);
        
        // Initialize state tracking
        currentState = getState();
        previousState = new Set();
        
        // Add mouse click event listener
        document.addEventListener('click', handleMouseClick, true);
        
        // Add form interaction event listeners
        document.addEventListener('input', handleInput, true);
        document.addEventListener('focus', handleFocus, true);
        document.addEventListener('blur', handleBlur, true);
        document.addEventListener('change', handleChange, true);
        
        // Add keyboard shortcut to show form history
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'H') {
                printFormInteractionHistory();
            }
        });
        
        console.log('=== FORM TRACKING ENABLED ===');
        console.log('Tracked events: input, focus, blur, change');
        console.log('Press Ctrl+Shift+H to view form interaction history');
        console.log('=== END FORM TRACKING ===');
        
        // Wait a bit for page to fully load
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
        setTimeout(main, 1000);
    }
}).observe(document, {subtree: true, childList: true});

// Log that script has been injected
console.log('Node Data Printer: Content script injected'); 