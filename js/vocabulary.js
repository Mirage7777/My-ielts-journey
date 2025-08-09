// js/vocabulary.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-word-form');
    const wordListContainer = document.getElementById('word-list');
    const searchBar = document.getElementById('search-bar');
    let words = JSON.parse(localStorage.getItem('ielts_words')) || [];

    function renderWords(filteredWords = words) {
        wordListContainer.innerHTML = '';
        if (filteredWords.length === 0) {
            wordListContainer.innerHTML = '<p>No words found. Start adding new words!</p>';
            return;
        }

        filteredWords.forEach((wordData, index) => {
            const originalIndex = words.findIndex(w => w === wordData);
            const wordCard = document.createElement('div');
            wordCard.className = 'word-card';
            wordCard.innerHTML = `
                <h3>${wordData.word}</h3>
                <p><strong>Definition:</strong> ${wordData.definition}</p>
                <p><em>Example: ${wordData.example || 'N/A'}</em></p>
                ${wordData.source ? `<span>Source: ${wordData.source}</span>` : ''}
                <button class="button-danger" onclick="deleteWord(${originalIndex})" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8em;">Delete</button>
            `;
            wordListContainer.appendChild(wordCard);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newWord = {
            word: document.getElementById('word').value.trim(),
            definition: document.getElementById('definition').value.trim(),
            example: document.getElementById('example').value.trim(),
            source: document.getElementById('source').value.trim(),
            addedDate: new Date().toISOString()
        };

        if (newWord.word && newWord.definition) {
            words.unshift(newWord); // Add to the beginning
            localStorage.setItem('ielts_words', JSON.stringify(words));
            renderWords();
            form.reset();
        }
    });
    
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = words.filter(wordData => 
            wordData.word.toLowerCase().includes(searchTerm) ||
            wordData.definition.toLowerCase().includes(searchTerm)
        );
        renderWords(filtered);
    });

    window.deleteWord = function(index) {
        if (confirm(`Are you sure you want to delete "${words[index].word}"?`)) {
            words.splice(index, 1);
            localStorage.setItem('ielts_words', JSON.stringify(words));
            renderWords(); // Re-render with current filter
            searchBar.dispatchEvent(new Event('input'));
        }
    }

    renderWords();
});