// js/tracker.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-score-form');
    const tableBody = document.querySelector('#log-table tbody');
    let scores = JSON.parse(localStorage.getItem('ielts_scores')) || [];
    let chartInstance = null;

    function renderTable() {
        tableBody.innerHTML = '';
        if (scores.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No practice logs yet.</td></tr>';
            return;
        }
        scores.forEach((score, index) => {
            const accuracy = ((score.correct / score.total) * 100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(score.date).toLocaleDateString()}</td>
                <td>${score.type.charAt(0).toUpperCase() + score.type.slice(1)}</td>
                <td>${score.source}</td>
                <td>${score.correct}/${score.total}</td>
                <td>${accuracy}%</td>
                <td><button class="button-danger" style="padding: 5px 10px; font-size: 0.8em;" onclick="deleteScore(${index})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        const listeningData = scores.filter(s => s.type === 'listening').map(s => ({x: new Date(s.date), y: (s.correct / s.total) * 100}));
        const readingData = scores.filter(s => s.type === 'reading').map(s => ({x: new Date(s.date), y: (s.correct / s.total) * 100}));

        if (chartInstance) {
            chartInstance.destroy();
        }
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Listening Accuracy',
                    data: listeningData,
                    borderColor: 'rgb(75, 192, 192)',
                }, {
                    label: 'Reading Accuracy',
                    data: readingData,
                    borderColor: 'rgb(255, 99, 132)',
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'day' } },
                    y: { beginAtZero: true, max: 100, ticks: { callback: value => value + '%' } }
                }
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newScore = {
            type: document.getElementById('practice-type').value,
            source: document.getElementById('practice-source').value,
            total: parseInt(document.getElementById('total-questions').value),
            correct: parseInt(document.getElementById('correct-answers').value),
            date: new Date().toISOString()
        };
        if (newScore.type && newScore.total > 0 && newScore.correct >= 0) {
            scores.unshift(newScore);
            scores.sort((a, b) => new Date(b.date) - new Date(a.date)); // Keep sorted by date
            localStorage.setItem('ielts_scores', JSON.stringify(scores));
            renderTable();
            renderChart();
            form.reset();
        }
    });

    window.deleteScore = function(index) {
        if (confirm(`Are you sure you want to delete this log?`)) {
            scores.splice(index, 1);
            localStorage.setItem('ielts_scores', JSON.stringify(scores));
            renderTable();
            renderChart();
        }
    }
    
    renderTable();
    renderChart();
});