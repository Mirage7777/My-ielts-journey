// js/speaking.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Topic Data (Embedded for simplicity) ---
    const part1Topics = [
        "Let's talk about your hometown. Where is it?", "What kind of work do you do?", "Do you like reading books?",
        "What's your favorite type of music?", "How do you usually spend your weekends?", "Do you enjoy cooking?"
    ];
    const part2Topics = [
        "Describe a historical place that you have visited.",
        "Describe a special gift you received.",
        "Describe a person you admire.",
        "Describe a memorable journey you have taken.",
        "Describe an interesting hobby you have."
    ];
    const part3Topics = [
        ["Why do people like to visit historical places?", "How can we protect historical places?"],
        ["What is the importance of giving gifts?", "Is it better to give handmade or store-bought gifts?"],
        ["What qualities does a person need to be a good leader?", "Do you think celebrities are good role models?"],
        ["What are the benefits of traveling?", "How has tourism changed your country?"],
        ["Why is it important for people to have hobbies?", "Can a hobby have a negative effect on a person?"]
    ];

    // --- Element References ---
    const part1Btn = document.getElementById('part1-btn');
    const part2Btn = document.getElementById('part2-btn');
    const part3Btn = document.getElementById('part3-btn');
    const part1Display = document.getElementById('part1-topic');
    const part2Display = document.getElementById('part2-topic');
    const part3Display = document.getElementById('part3-topic');
    
    // --- Timer ---
    const timerDisplay = document.getElementById('speaking-timer');
    const prepBtn = document.getElementById('prep-timer-btn');
    const speakBtn = document.getElementById('speak-timer-btn');
    let timerInterval;

    function startSpeakingTimer(duration, onEndMessage) {
        clearInterval(timerInterval);
        let timeLeft = duration;
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const seconds = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "00:00";
                alert(onEndMessage);
            }
        }, 1000);
    }
    
    prepBtn.addEventListener('click', () => startSpeakingTimer(60, "Preparation time is over!"));
    speakBtn.addEventListener('click', () => startSpeakingTimer(120, "Speaking time is over!"));

    // --- Topic Generators ---
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    part1Btn.addEventListener('click', () => {
        part1Display.textContent = getRandomItem(part1Topics);
        part1Display.style.display = 'block';
    });

    part2Btn.addEventListener('click', () => {
        part2Display.innerHTML = `
            <p>${getRandomItem(part2Topics)}</p>
            <p><strong>You should say:</strong></p>
            <ul>
                <li>where it is</li>
                <li>what it is famous for</li>
                <li>what you did there</li>
                <li>and explain why you enjoyed visiting this place.</li>
            </ul>
        `;
        part2Display.style.display = 'block';
    });

    part3Btn.addEventListener('click', () => {
        const questions = getRandomItem(part3Topics);
        part3Display.innerHTML = questions.map(q => `<p>• ${q}</p>`).join('');
        part3Display.style.display = 'block';
    });
});