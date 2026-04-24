document.getElementById('submit-btn').addEventListener('click', processData);
document.getElementById('edges-input').addEventListener('keypress', function (e) {
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
    const dataArray = inputStr.split(',').map(s => s.replace(/["']/g, '').trim()).filter(s => s.length > 0);

    if (dataArray.length === 0) {
        showError("Please enter at least one edge (e.g. A->B).");
        return;
    }

    loading.classList.remove('hidden');

    try {
        const response = await fetch('https://bajaj-test-viekhyat.onrender.com/bfhl', {
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

            // Populate Dashboard
            document.getElementById('stat-trees').textContent = result.summary.total_trees;
            document.getElementById('stat-cycles').textContent = result.summary.total_cycles;
            document.getElementById('stat-largest-root').textContent = result.summary.largest_tree_root || 'None';

            const invalidList = document.getElementById('list-invalid');
            invalidList.innerHTML = '';
            if (result.invalid_entries.length > 0) {
                result.invalid_entries.forEach(entry => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    invalidList.appendChild(li);
                });
            } else {
                invalidList.innerHTML = '<li style="opacity:0.5">None</li>';
            }

            const dupList = document.getElementById('list-duplicates');
            dupList.innerHTML = '';
            if (result.duplicate_edges.length > 0) {
                result.duplicate_edges.forEach(entry => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    dupList.appendChild(li);
                });
            } else {
                dupList.innerHTML = '<li style="opacity:0.5">None</li>';
            }

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
