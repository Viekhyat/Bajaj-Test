document.getElementById('submit-btn').addEventListener('click', processData);
document.getElementById('edges-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        processData();
    }
});

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

async function processData() {
    const inputStr = document.getElementById('edges-input').value;
    const errorContainer = document.getElementById('error-container');
    const resultsContainer = document.getElementById('results-container');
    const loading = document.getElementById('loading');
    const jsonOutput = document.getElementById('json-output');

    // Reset UI state
    errorContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    
    // Parse and validate input
    const dataArray = inputStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (dataArray.length === 0) {
        showError("Please enter at least one edge (e.g. A->B).");
        return;
    }

    loading.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataArray })
        });

        const result = await response.json();

        // Small delay for smooth UX transition
        setTimeout(() => {
            loading.classList.add('hidden');

            if (!response.ok) {
                showError(result.error || "An error occurred while processing the request.");
                return;
            }

            // Display results with subtle highlighting
            jsonOutput.innerHTML = syntaxHighlight(result);
            resultsContainer.classList.remove('hidden');
        }, 400);
        
    } catch (err) {
        loading.classList.add('hidden');
        showError("Failed to connect to the backend server. Please ensure it is running on port 3000.");
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.classList.remove('hidden');
}
