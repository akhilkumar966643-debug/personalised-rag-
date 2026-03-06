// Basic interaction simulation

function appendMessage(chatHistoryId, text, isAi) {
    const history = document.getElementById(chatHistoryId);
    if (!history) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `msg animate-fade-in ${isAi ? 'msg-ai' : 'msg-user'}`;

    if (isAi) {
        msgDiv.innerHTML = `<strong><i class="fa-solid ${chatHistoryId.includes('jam') ? 'fa-user' : 'fa-robot'}"></i> ${chatHistoryId.includes('jam') ? 'Peer' : 'Lumina Tutor'}</strong><br><p style="margin-top: 5px;">${text}</p>`;
    } else {
        msgDiv.innerHTML = `<strong><i class="fa-solid fa-user-circle"></i> You</strong><br><p style="margin-top: 5px;">${text}</p>`;
    }

    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
}

function setupChat(inputId, btnId, historyId, isJam) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);

    if (!input || !btn) return;

    const handleSend = () => {
        const text = input.value.trim();
        if (text) {
            appendMessage(historyId, text, false);
            input.value = '';

            // Simulate backend AI or Peer response
            setTimeout(() => {
                if (isJam) {
                    appendMessage(historyId, "That's a great point! I think combining the equations might solve the normalization issue. What do you think?", true);
                } else {
                    // Simulate RAG Tutor Response
                    fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    })
                        .then(res => res.json())
                        .then(data => {
                            appendMessage(historyId, data.reply || "RAG Error processing your request.", true);
                        })
                        .catch(err => {
                            appendMessage(historyId, "Let me check the curriculum datastore... " + getMockRagResponse(text), true);
                        });
                }
            }, 1000 + Math.random() * 1000);
        }
    };

    btn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

function getMockRagResponse(userText) {
    const lower = userText.toLowerCase();
    if (lower.includes('schrodinger') || lower.includes('equation')) {
        return "The Schrödinger equation tells us how the quantum state of a physical system changes in time. Based on your previous struggle with calculus, maybe we should review partial derivatives first?";
    }
    return "That's an interesting thought! Based on your learning curve, I've updated your knowledge graph. Shall we do a quick 3-question quiz on this topic?";
}

// --- NEW FEATURES LOGIC --- //

// Data Hub File Upload Simulation
function simulateUpload() {
    const uploader = document.getElementById('upload-zone');
    const text = document.getElementById('upload-text');
    if (!uploader || !text) return;

    uploader.style.borderColor = 'var(--accent-success)';
    uploader.style.background = 'rgba(16, 185, 129, 0.1)';
    text.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Vectorizing Document...';

    setTimeout(() => {
        text.innerHTML = '<i class="fa-solid fa-check"></i> Document Ingested Successfully!';
        setTimeout(() => {
            text.innerText = 'Click or drag another file to upload';
            uploader.style.borderColor = '';
            uploader.style.background = '';
        }, 2000);
    }, 1500);
}

// Practice Quiz Logic Simulation
let currentQuestion = 1;
let score = 0;

function checkAnswer(qNum, btnElement, isCorrect) {
    // Disable all options
    const options = document.getElementById(`options-${qNum}`).children;
    for (let opt of options) {
        opt.disabled = true;
        opt.style.opacity = '0.6';
        opt.style.cursor = 'not-allowed';
    }

    btnElement.style.opacity = '1';

    if (isCorrect) {
        btnElement.classList.add('correct');
        score++;
        document.getElementById('quiz-score').innerText = score;
    } else {
        btnElement.classList.add('incorrect');
        // Find the correct one and highlight it
        for (let opt of options) {
            if (opt.getAttribute('onclick').includes('true')) {
                opt.style.opacity = '1';
                opt.classList.add('correct');
                opt.style.borderStyle = 'dashed';
            }
        }
    }

    document.getElementById(`exp-${qNum}`).style.display = 'block';
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    const container = document.getElementById('quiz-container');
    if (currentQuestion === 1) {
        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = `
        <h3 style="margin-bottom: 20px;">Question 2 of 3</h3>
        <p style="font-size: 1.1rem; margin-bottom: 20px;">Which principle states that you cannot simultaneously know the exact position and momentum of a particle?</p>
        
        <div id="options-2">
          <button class="option-btn" onclick="checkAnswer(2, this, false)">A) Pauli Exclusion Principle</button>
          <button class="option-btn" onclick="checkAnswer(2, this, true)">B) Heisenberg Uncertainty Principle</button>
          <button class="option-btn" onclick="checkAnswer(2, this, false)">C) Principle of Superposition</button>
          <button class="option-btn" onclick="checkAnswer(2, this, false)">D) Equivalence Principle</button>
        </div>
        
        <div class="explanation" id="exp-2">
          <strong><i class="fa-solid fa-robot"></i> Tutor Note:</strong> Exactly right! The Heisenberg Uncertainty Principle states that $\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$, meaning precise measurement of one observable fundamentally blurs the other.
        </div>
        
        <button class="btn btn-primary" id="next-btn" style="margin-top: 20px; display: none;" onclick="finishQuiz()">Finish Quiz <i class="fa-solid fa-flag-checkered"></i></button>
      `;
            container.style.opacity = '1';
            currentQuestion++;
        }, 300);
    }
}

function finishQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
    <div style="text-align: center; padding: 2rem 0;">
      <i class="fa-solid fa-trophy" style="font-size: 4rem; color: #fbbf24; margin-bottom: 20px;"></i>
      <h2>Quiz Completed!</h2>
      <p class="subtitle" style="margin-top: 10px;">You scored ${score} out of 2.</p>
      <p style="margin-top: 20px; color: var(--text-muted);">The Knowledge Graph has been updated with these results.</p>
      <button class="btn btn-primary" style="margin-top: 30px;" onclick="window.location.href='graph.html'">View Concept Map</button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
    setupChat('tutor-input', 'tutor-send', 'tutor-chat-history', false);
    setupChat('jam-input', 'jam-send', 'jam-chat-history', true);
});
