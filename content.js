// Interactive element types to track
const INTERACTIVE_ELEMENTS = ['a', 'button', 'input', 'select', 'textarea', 'label'];

// Global state tracking
let previousState = new Set();
let currentState = new Set();

// Track form interactions
let formInteractionHistory = [];

// Logging configuration
const LogConfig = {
    level: 'info', // 'debug', 'info', 'warn', 'error', 'none'
    groups: {
        click: true,
        form: true,
        state: true,
        element: false
    },
    
    log: function(level, group, message, data) {
        if (this.level === 'none') return;
        if (group && !this.groups[group]) return;
        
        const timestamp = new Date().toISOString().substring(11, 19);
        const styles = {
            debug: 'color: #9E9E9E',
            info: 'color: #4CAF50',
            warn: 'color: #FF9800',
            error: 'color: #F44336'
        };
        
        const style = styles[level] || '';
        const prefix = `%c[${timestamp}] ${level.toUpperCase()}:`;
        
        if (data) {
            console.groupCollapsed(prefix, style, message);
            console.log(data);
            console.groupEnd();
        } else {
            console.log(prefix, style, message);
        }
    }
};

class ClickableElementProcessor {
    constructor() {
        this._cachedStateClickableElementsHashes = { hashes: new Set() };
    }

    // Hash DOM element
    static async hashDomElement(domElement) {
        // Create a string representation of the element's key properties
        const elementString = JSON.stringify({
            tagName: domElement.tagName.toLowerCase(),
            id: domElement.id || '',
            className: domElement.className || '',
            type: domElement.type || '',
            name: domElement.name || '',
            href: domElement.href || '',
            textContent: domElement.textContent?.trim() || '',
            xpath: getXPath(domElement),
            innerHTML: domElement.innerHTML?.substring(0, 100) || '',
            attributes: this.getAttributesString(domElement)
        });
        
        // Create a simple hash
        let hash = 0;
        for (let i = 0; i < elementString.length; i++) {
            const char = elementString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash.toString();
    }

    // Get attributes as string for hashing
    static getAttributesString(element) {
        const attrs = [];
        for (let attr of element.attributes) {
            attrs.push(`${attr.name}=${attr.value}`);
        }
        return attrs.sort().join('|');
    }
}

// Global instance
const clickableElementProcessor = new ClickableElementProcessor();

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
    const interaction = {
        type: interactionType,
        element: {
            tagName: element.tagName.toLowerCase(),
            type: element.type || 'unknown',
            id: element.id || 'no-id',
            name: element.name || 'no-name',
            placeholder: element.placeholder || 'no-placeholder',
            value: element.value !== undefined ? element.value : element.innerText || '',
            xpath: getXPath(element)
        },
        event: {
            type: event.type,
            coordinates: { x: event.clientX, y: event.clientY }
        }
    };
    
    formInteractionHistory.push(interaction);
    
    // Only log if form logging is enabled
    if (LogConfig.groups.form) {
        LogConfig.log('info', 'form', `Form ${interactionType}`, interaction);
    }
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
        trackFormInteraction(accumulatedEvent, 'New_Element');
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
        trackFormInteraction(accumulatedEvent, 'New_Element');
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
        
        LogConfig.log('info', 'all', 'All node data', allNodeData);
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
async function handleMouseClick(event) {
    try {
        if (!LogConfig.groups.click) return;
        
        const clickData = {
            element: event.target,
            coordinates: { x: event.clientX, y: event.clientY },
            timestamp: new Date().toISOString()
        };
        
        LogConfig.log('info', 'click', 'Mouse click detected', clickData);
        
        // Get current state of all clickable elements
        const currentElements = findInteractiveElements();
        const newElements = [];
        
        // Mark elements as new if they weren't in the previous state
        for (const {element, nodeData} of currentElements) {
            if (!isElementVisible(element)) continue;
            const hash = await ClickableElementProcessor.hashDomElement(element);
            const isNew = !clickableElementProcessor._cachedStateClickableElementsHashes.hashes.has(hash);
            element.isNew = isNew;
            
            if (isNew) {
                newElements.push({element, nodeData: {...nodeData, isNew: true}});
            }
        }
        
        // Update cached state with current elements
        clickableElementProcessor._cachedStateClickableElementsHashes.hashes.clear();
        for (const {element} of currentElements) {
            const hash = await ClickableElementProcessor.hashDomElement(element);
            clickableElementProcessor._cachedStateClickableElementsHashes.hashes.add(hash);
        }
        
        // Log state comparison
        const stateInfo = {
            cachedHashes: clickableElementProcessor._cachedStateClickableElementsHashes.hashes.size,
            currentElements: currentElements.length,
            newElements: newElements.length
        };
        
        LogConfig.log('debug', 'state', 'State comparison', stateInfo);
        
        // Log new elements if any
        if (newElements.length > 0 && LogConfig.groups.element) {
            newElements.forEach(({element, nodeData}) => {
                LogConfig.log('info', 'element', `New ${nodeData.tagName} element`, nodeData);
            });
        }
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