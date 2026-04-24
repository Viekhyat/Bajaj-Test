document.getElementById('submit-btn').addEventListener('click', processData);

async function processData() {
    const inputStr = document.getElementById('edges-input').value;
    const errorContainer = document.getElementById('error-container');
    const resultsContainer = document.getElementById('results-container');
    const loading = document.getElementById('loading');
    const jsonOutput = document.getElementById('json-output');

    // Reset UI
    errorContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    
    // Parse input
    const dataArray = inputStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (dataArray.length === 0) {
        showError("Please enter at least one edge.");
        return;
    }

    loading.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: dataArray })
        });

        const result = await response.json();

        loading.classList.add('hidden');

        if (!response.ok) {
            showError(result.error || "An error occurred while processing the request.");
            return;
        }

        // Display results
        jsonOutput.textContent = JSON.stringify(result, null, 2);
        resultsContainer.classList.remove('hidden');
        
    } catch (err) {
        loading.classList.add('hidden');
        showError("Failed to connect to the backend server. Make sure it is running.");
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.classList.remove('hidden');
}

// Allow pressing Enter to submit
document.getElementById('edges-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        processData();
    }
});
