// BFHL API Tester Application
const API_ENDPOINT = 'https://bfhltest-api.vercel.app/api/bfhl';

// Sample input presets
const SAMPLE_INPUTS = [
    ["M", "1", "334", "4", "B", "Z", "a", "7"],
    ["A", "C", "z", "2", "8", "9", "@", "#"],
    ["hello", "123", "456", "world", "!", "?"],
    ["X", "Y", "10", "20", "abc", "def"]
];

// DOM elements
let dataInput, testBtn, resultsSection, notification, notificationText;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    dataInput = document.getElementById('dataInput');
    testBtn = document.getElementById('testBtn');
    resultsSection = document.getElementById('resultsSection');
    notification = document.getElementById('notification');
    notificationText = document.getElementById('notificationText');
});

// Copy API endpoint to clipboard
function copyEndpoint() {
    const endpointInput = document.querySelector('.endpoint-input');
    const endpointValue = endpointInput.value;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(endpointValue).then(() => {
            showNotification('API endpoint copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(endpointValue);
        });
    } else {
        fallbackCopyTextToClipboard(endpointValue);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('API endpoint copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy endpoint', 'error');
        }
    } catch (err) {
        showNotification('Failed to copy endpoint', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Load preset data
function loadPreset(index) {
    if (index >= 0 && index < SAMPLE_INPUTS.length) {
        const preset = SAMPLE_INPUTS[index];
        dataInput.value = preset.join(',');
        showNotification(`Loaded Example ${index + 1}`, 'success');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Validate input data
function validateInput(inputString) {
    if (!inputString || inputString.trim() === '') {
        return { isValid: false, message: 'Please enter some data' };
    }
    
    const items = inputString.split(',').map(item => item.trim()).filter(item => item !== '');
    
    if (items.length === 0) {
        return { isValid: false, message: 'Please enter valid comma-separated data' };
    }
    
    return { isValid: true, data: items };
}

// Test API function
async function testAPI() {
    const inputValue = dataInput.value;
    const validation = validateInput(inputValue);
    
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        return;
    }
    
    // Show loading state
    testBtn.disabled = true;
    document.getElementById('btnText').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: validation.data })
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.is_success) {
            displayResults(responseData);
            showNotification('API request successful!', 'success');
        } else {
            throw new Error(responseData.message || 'API request failed');
        }
        
    } catch (error) {
        console.error('API Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        resultsSection.style.display = 'none';
    } finally {
        // Reset button state
        testBtn.disabled = false;
        document.getElementById('btnText').style.display = 'inline';
        document.getElementById('spinner').style.display = 'none';
    }
}

// Display API results
function displayResults(data) {
    const resultsHTML = `
        <h2>API Response</h2>
        <div class="results-grid">
            <div class="card result-card">
                <h4>👤 User Details</h4>
                <div class="result-card__content">
                    <p><strong>User ID:</strong> ${data.user_id}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Roll Number:</strong> ${data.roll_number}</p>
                </div>
            </div>
            
            <div class="card result-card">
                <h4>🔢 Numbers</h4>
                <div class="result-card__content">
                    <p><strong>Odd Numbers:</strong></p>
                    <div class="result-card__items">
                        ${data.odd_numbers.map(num => `<span class="result-tag result-tag--odd">${num}</span>`).join('')}
                        ${data.odd_numbers.length === 0 ? '<span class="result-tag">None</span>' : ''}
                    </div>
                    <p style="margin-top: 1rem;"><strong>Even Numbers:</strong></p>
                    <div class="result-card__items">
                        ${data.even_numbers.map(num => `<span class="result-tag result-tag--even">${num}</span>`).join('')}
                        ${data.even_numbers.length === 0 ? '<span class="result-tag">None</span>' : ''}
                    </div>
                </div>
            </div>
            
            <div class="card result-card">
                <h4>🔤 Alphabets</h4>
                <div class="result-card__content">
                    <div class="result-card__items">
                        ${data.alphabets.map(letter => `<span class="result-tag result-tag--alphabet">${letter}</span>`).join('')}
                        ${data.alphabets.length === 0 ? '<span class="result-tag">None</span>' : ''}
                    </div>
                </div>
            </div>
            
            <div class="card result-card">
                <h4>⚡ Special Characters</h4>
                <div class="result-card__content">
                    <div class="result-card__items">
                        ${data.special_characters.map(char => `<span class="result-tag result-tag--special">${char}</span>`).join('')}
                        ${data.special_characters.length === 0 ? '<span class="result-tag">None</span>' : ''}
                    </div>
                </div>
            </div>
            
            <div class="card result-card">
                <h4>📊 Summary</h4>
                <div class="result-card__content">
                    <p><strong>Sum of Numbers:</strong> ${data.sum}</p>
                    <p><strong>Concat String:</strong> ${data.concat_string || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;
    
    resultsSection.innerHTML = resultsHTML;
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
