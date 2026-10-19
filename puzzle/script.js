let currentSize = 3;
let currentImage = 'images/puzzle1.jpg';
let moves = 0;
let seconds = 0;
let timerInterval = null;
let soundEnabled = true;
let draggedPiece = null;
let touchStartPiece = null;
let isGameActive = false;
let piecesState = [];

const puzzleBoard = document.getElementById('puzzle-board');
const previewImg = document.getElementById('preview-img');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const winMessage = document.getElementById('win-message');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const levelBtns = document.querySelectorAll('.level-btn');
const imageSelect = document.getElementById('image-select');
const soundToggle = document.getElementById('sound-toggle');

const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

// Громкость
bgMusic.volume = 0.2;
clickSound.volume = 0.5;
matchSound.volume = 0.6;
winSound.volume = 0.7;

// Воспроизведение звука
function playSound(audio) {
    if (!soundEnabled) return;
    audio.currentTime = 0;
    audio.play().catch(e => console.log(e));
}

// Перемешивание
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Формат времени
function formatTime(sec) {
    const min = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${min}:${s}`;
}

// Таймер
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = '00:00';
    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

// Позиция фона для индекса
function getBgPosition(index) {
    const row = Math.floor(index / currentSize);
    const col = index % currentSize;
    const xPercent = (col / (currentSize - 1)) * 100;
    const yPercent = (row / (currentSize - 1)) * 100;
    return `${xPercent}% ${yPercent}%`;
}

// Создание пазла
function createPuzzle() {
    puzzleBoard.innerHTML = '';
    puzzleBoard.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

    const total = currentSize * currentSize;
    const correctOrder = [];
    for (let i = 0; i < total; i++) {
        correctOrder.push(i);
    }

    piecesState = shuffle(correctOrder);
    renderPieces();
    isGameActive = true;
}

// Отрисовка кусочков
function renderPieces() {
    puzzleBoard.innerHTML = '';

    piecesState.forEach((correctIndex, position) => {
        const el = document.createElement('div');
        el.className = 'puzzle-piece';
        el.draggable = true;

        el.style.backgroundImage = `url(${currentImage})`;
        el.style.backgroundSize = `${currentSize * 100}% ${currentSize * 100}%`;
        el.style.backgroundPosition = getBgPosition(correctIndex);
        el.dataset.position = position;

        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', handleDrop);
        el.addEventListener('dragend', handleDragEnd);
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd);

        puzzleBoard.appendChild(el);
    });
}

// Drag & Drop
function handleDragStart(e) {
    if (!isGameActive) return;
    draggedPiece = this;
    this.classList.add('dragging');
    playSound(clickSound);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedPiece && draggedPiece !== this) {
        swapPieces(draggedPiece, this);
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedPiece = null;
}

// Touch
function handleTouchStart(e) {
    if (!isGameActive) return;
    touchStartPiece = this;
    this.classList.add('dragging');
    playSound(clickSound);
}

function handleTouchMove(e) {
    if (!isGameActive || !touchStartPiece) return;
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.classList.contains('puzzle-piece') && element !== touchStartPiece) {
        swapPieces(touchStartPiece, element);
        touchStartPiece.classList.remove('dragging');
        touchStartPiece = element;
        touchStartPiece.classList.add('dragging');
    }
}

function handleTouchEnd() {
    if (touchStartPiece) {
        touchStartPiece.classList.remove('dragging');
        touchStartPiece = null;
    }
}

// Обмен кусочков
function swapPieces(piece1, piece2) {
    const pos1 = parseInt(piece1.dataset.position);
    const pos2 = parseInt(piece2.dataset.position);

    [piecesState[pos1], piecesState[pos2]] = [piecesState[pos2], piecesState[pos1]];

    const bg1 = piece1.style.backgroundPosition;
    const bg2 = piece2.style.backgroundPosition;
    piece1.style.backgroundPosition = bg2;
    piece2.style.backgroundPosition = bg1;

    moves++;
    movesDisplay.textContent = moves;

    playSound(matchSound);
    checkWin();
}

// Проверка победы
function checkWin() {
    let allCorrect = true;

    for (let i = 0; i < piecesState.length; i++) {
        if (piecesState[i] !== i) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        isGameActive = false;
        clearInterval(timerInterval);
        finalTime.textContent = formatTime(seconds);
        finalMoves.textContent = moves;

        setTimeout(() => {
            winMessage.classList.add('active');
            playSound(winSound);
        }, 500);
    }
}

// Запуск игры
function startGame() {
    // Фоновая музыка
    if (soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(e => console.log(e));
    }

    moves = 0;
    movesDisplay.textContent = '0';
    winMessage.classList.remove('active');
    previewImg.src = currentImage;
    createPuzzle();
    startTimer();
}

// Обработчики
levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSize = parseInt(btn.dataset.size);
    });
});

imageSelect.addEventListener('change', () => {
    currentImage = imageSelect.value;
    previewImg.src = currentImage;
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundToggle.textContent = '🔊 Звук вкл';
        soundToggle.classList.remove('muted');
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log(e));
        }
    } else {
        soundToggle.textContent = '🔇 Звук выкл';
        soundToggle.classList.add('muted');
        bgMusic.pause();
    }
});

// Старт
startGame();

// Запуск фоновой музыки после первого клика (браузеры блокируют автозапуск)
document.addEventListener('click', function startBgMusic() {
    if (soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(e => console.log(e));
    }
    document.removeEventListener('click', startBgMusic);
}, { once: true });