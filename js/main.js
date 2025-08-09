// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Load Data ---
    const words = JSON.parse(localStorage.getItem('ielts_words')) || [];
    const scores = JSON.parse(localStorage.getItem('ielts_scores')) || [];

    // --- Quick Stats ---
    document.getElementById('total-words').textContent = words.length;
    document.getElementById('total-practices').textContent = scores.length;

    // --- Countdown Timer ---
    const countdownEl = document.getElementById('countdown');
    const datePicker = document.getElementById('exam-date-picker');
    const setDateBtn = document.getElementById('set-exam-date');

    function updateCountdown() {
        const examDate = localStorage.getItem('ielts_exam_date');
        if (examDate) {
            const diff = new Date(examDate) - new Date();
            if (diff > 0) {
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                countdownEl.textContent = `${days} days`;
            } else {
                countdownEl.textContent = "Exam day has passed!";
            }
        }
    }
    setDateBtn.addEventListener('click', () => {
        if (datePicker.value) {
            localStorage.setItem('ielts_exam_date', datePicker.value);
            updateCountdown();
        }
    });

    // --- Ebbinghaus Review Words ---
    const reviewWordsList = document.getElementById('review-words-list');
    const reviewIntervals = [1, 2, 4, 7, 15];
    const today = new Date();
    const wordsToReview = words.filter(word => {
        const addedDate = new Date(word.addedDate);
        const diffDays = Math.round((today - addedDate) / (1000 * 60 * 60 * 24));
        return reviewIntervals.includes(diffDays);
    });

    if (wordsToReview.length > 0) {
        reviewWordsList.innerHTML = '';
        wordsToReview.forEach(word => {
            const p = document.createElement('p');
            p.textContent = `• ${word.word}: ${word.definition}`;
            reviewWordsList.appendChild(p);
        });
    }

    // --- Accuracy Trend Chart ---
    const ctx = document.getElementById('accuracy-trend-chart').getContext('2d');
    if (scores.length > 0) {
        const listeningData = scores.filter(s => s.type === 'listening');
        const readingData = scores.filter(s => s.type === 'reading');

        // Create labels based on all unique dates
        const allDates = [...new Set(scores.map(s => new Date(s.date).toLocaleDateString()))].sort();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: allDates,
                datasets: [
                    {
                        label: 'Listening Accuracy (%)',
                        data: allDates.map(date => {
                            const scoreOnDate = listeningData.find(s => new Date(s.date).toLocaleDateString() === date);
                            return scoreOnDate ? (scoreOnDate.correct / scoreOnDate.total) * 100 : null;
                        }),
                        borderColor: 'rgb(75, 192, 192)',
                        spanGaps: true, // Connect points with null data
                    },
                    {
                        label: 'Reading Accuracy (%)',
                        data: allDates.map(date => {
                            const scoreOnDate = readingData.find(s => new Date(s.date).toLocaleDateString() === date);
                            return scoreOnDate ? (scoreOnDate.correct / scoreOnDate.total) * 100 : null;
                        }),
                        borderColor: 'rgb(255, 99, 132)',
                        spanGaps: true,
                    }
                ]
            },
            options: { scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }

    // --- Initial Calls ---
    updateCountdown();
});