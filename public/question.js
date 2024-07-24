const NOQ = 10;
let q_set = [];
let questions = null;
let score = 0;
let totalQuestions = 0;
let answeredQuestions = new Set(); // To track answered questions

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const questions = await response.json();
        return questions;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function getRandomElements(arr, n) {
    if (n > arr.length) {
        throw new RangeError("getRandomElements: more elements taken than available");
    }
    let shuffled = arr.slice(0);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
}

function createQset() {
    q_set.push(...getRandomElements(questions.easy, 4));
    q_set.push(...getRandomElements(questions.medium, 4));
    q_set.push(...getRandomElements(questions.hard, 2));
    totalQuestions = q_set.length;
    return q_set;
}

function displayQuestions(q_set) {
    const container = document.getElementById('question-container');
    q_set.forEach((q, index) => {
        const section = document.createElement('section');
        section.className = 'item';
        section.id = `item-${index + 1}`;
        section.innerHTML = `
            <div class="content">
                <h1 class="question">${q.question}</h1>
                <p class="hint" style="display: none;">${q.hint}</p>
                <div class="ip">
                    <input type="text" name="reg" id="reg-${index + 1}" placeholder="Enter your Regex">
                    <div class="buttons">
                        <button class="btn submit" id="submit-${index + 1}">Submit</button>
                        <button class="btn hint" id="hint-${index + 1}">Hint</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(section);
    });
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.submit').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.id.split('-')[1] - 1;
            const currentQuestion = q_set[index];
            const regInput = document.getElementById(`reg-${index + 1}`).value;
            if(!regInput == '')
            {
                if (evalInput(regInput, currentQuestion.test_cases)) {
                score++;
            }
            }
            answeredQuestions.add(index); // Mark this question as answered
            if (answeredQuestions.size === totalQuestions) {
                displayScore();
            }
            event.target.style.display = 'none'
        });
    });

    document.querySelectorAll('.hint').forEach(button => {
        button.addEventListener('click', (event) => {
            const currentCard = event.target.closest('.item');
            const hintParagraph = currentCard.querySelector('.hint');
            hintParagraph.style.display = 'block';
        });
    });
}

function evalInput(pattern, test_cases) {
    try {
        const regex = new RegExp(pattern);
        return test_cases.every(test_case => regex.test(test_case));
    } catch (e) {
        console.error('Invalid regex pattern:', e);
        return false;
    }
}

function displayScore() {
    const modal = document.getElementById('score-modal');
    const scoreText = document.getElementById('score-text');
    scoreText.textContent = `You answered ${score} out of ${totalQuestions} questions correctly!`;
    modal.style.display = 'block';

    // Close the modal
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

(async () => {
    questions = await fetchQuestions();
    createQset();
    displayQuestions(q_set);
})();
