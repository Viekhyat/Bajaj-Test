// Add Canvas Network Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const numParticles = Math.floor((width * height) / 15000);
    
    for(let i=0; i<numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
        
        // Draw connections
        for(let j=i+1; j<particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(138, 43, 226, ${1 - dist/120})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawCanvas();

// Form Handling
document.getElementById('submit-btn').addEventListener('click', processData);

// Syntax Highlighter Function
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

    // Reset UI
    errorContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    
    // Parse input
    const dataArray = inputStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (dataArray.length === 0) {
        showError("Data stream empty. Please input vectors.");
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

        // Artificial delay for cool loading effect
        setTimeout(() => {
            loading.classList.add('hidden');

            if (!response.ok) {
                showError(result.error || "Graph anomaly detected.");
                return;
            }

            // Display results with syntax highlighting
            jsonOutput.innerHTML = syntaxHighlight(result);
            resultsContainer.classList.remove('hidden');
            
            // Re-trigger animation
            resultsContainer.style.animation = 'none';
            resultsContainer.offsetHeight; /* trigger reflow */
            resultsContainer.style.animation = null;
        }, 800);
        
    } catch (err) {
        loading.classList.add('hidden');
        showError("Neural link severed. Backend server offline.");
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
