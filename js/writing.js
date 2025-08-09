// js/writing.js
document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('writing-topic');
    const writingArea = document.getElementById('writing-area');
    const timerDisplay = document.getElementById('timer');
    const wordCountDisplay = document.getElementById('word-count');
    const startTask1Btn = document.getElementById('start-task1');
    const startTask2Btn = document.getElementById('start-task2');
    const saveEssayBtn = document.getElementById('save-essay');
    const essaysList = document.getElementById('essays-list');

    let essays = JSON.parse(localStorage.getItem('ielts_essays')) || [];
    let timerInterval;
    let timeLeft;

    function startTimer(duration) {
        clearInterval(timerInterval);
        timeLeft = duration * 60;
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const seconds = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
            }
        }, 1000);
    }
    
    startTask1Btn.addEventListener('click', () => startTimer(20));
    startTask2Btn.addEventListener('click', () => startTimer(40));

    writingArea.addEventListener('input', () => {
        const text = writingArea.value.trim();
        const words = text === '' ? 0 : text.split(/\s+/).length;
        wordCountDisplay.textContent = words;
    });

    saveEssayBtn.addEventListener('click', () => {
        const essay = {
            topic: topicInput.value || 'No Topic',
            content: writingArea.value,
            wordCount: wordCountDisplay.textContent,
            date: new Date().toISOString()
        };
        if (essay.content.length > 10) {
            essays.unshift(essay);
            localStorage.setItem('ielts_essays', JSON.stringify(essays));
            renderEssays();
            alert('Essay saved!');
        } else {
            alert('Please write more before saving.');
        }
    });

    function renderEssays() {
        essaysList.innerHTML = '';
        if (essays.length === 0) {
            essaysList.innerHTML = '<p>No saved essays yet.</p>';
            return;
        }
        essays.forEach((essay, index) => {
            const essayDiv = document.createElement('div');
            essayDiv.className = 'word-card'; // Reuse style
            essayDiv.innerHTML = `
                <h3>Topic: ${essay.topic}</h3>
                <p><strong>Date:</strong> ${new Date(essay.date).toLocaleString()} | <strong>Words:</strong> ${essay.wordCount}</p>
                <details>
                    <summary>View Essay</summary>
                    <pre style="white-space: pre-wrap; font-family: var(--font-family);">${essay.content}</pre>
                </details>
                 <button class="button-danger" onclick="deleteEssay(${index})" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8em;">Delete</button>
            `;
            essaysList.appendChild(essayDiv);
        });
    }
    
    window.deleteEssay = function(index) {
        if(confirm('Are you sure you want to delete this essay?')) {
            essays.splice(index, 1);
            localStorage.setItem('ielts_essays', JSON.stringify(essays));
            renderEssays();
        }
    }

    renderEssays();
});