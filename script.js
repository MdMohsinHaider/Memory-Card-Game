const cardsArray = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍇', '🍇',
    '🍉', '🍉',
    '🍓', '🍓',
    '🍒', '🍒',
    '🥝', '🥝',
    '🍍', '🍍',
    '🍑', '🍑',
    '🍊', '🍊',
    '🍐', '🍐',
    '🥥', '🥥',
    '🥭', '🥭',
    '🍈', '🍈',
    '🍋', '🍋',
    '🍏', '🍏'
];


let grid = document.getElementById('game-board');
let scoreSpan = document.getElementById('score');
let timeSpan = document.getElementById('time');
let restartBtn = document.getElementById('restart-btn');

let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let time = 0;
let timerInterval = null;
let lockBoard = false;

// Shuffle function - Fisher-Yates
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createCard(content, index) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset.content = content;
    card.dataset.index = index;

    card.innerHTML = `
    <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${content}</div>
    </div>
    `;

    card.addEventListener('click', () => {
        if (lockBoard) return;
        if (card.classList.contains('flipped')) return;
        flipCard(card);
    });

    return card;
}

function flipCard(card) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.content === card2.dataset.content) {
        matchedPairs++;
        score += 10;
        scoreSpan.textContent = score;
        flippedCards = [];
        lockBoard = false;

        if (matchedPairs === cardsArray.length / 2) {
            clearInterval(timerInterval);
            setTimeout(() => alert(`Game Over! Your time: ${time} seconds, Score: ${score}`), 300);
        }
    } else {
        score = Math.max(0, score - 2);
        scoreSpan.textContent = score;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 900);
    }
}

function startTimer() {
    time = 0;
    timeSpan.textContent = time;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time++;
        timeSpan.textContent = time;
    }, 1000);
}

function initGame() {
    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;
    scoreSpan.textContent = score;
    grid.innerHTML = '';

    let shuffledCards = shuffle(cardsArray.slice());
    shuffledCards.forEach((content, index) => {
        let card = createCard(content, index);
        grid.appendChild(card);
    });

    startTimer();
}

restartBtn.addEventListener('click', initGame);

window.onload = initGame;
