// Вопросы: картинка + правильный ответ (адаптировано под ваши рисунки)
const allQuestions = [
    { image: 'images/img1.jpg', correct: '🌲 Лес' },      // Пикачу
    { image: 'images/img2.jpg', correct: '🌲 Лес' },      // Соник
    { image: 'images/img3.jpg', correct: '✨ Сказка' },   // Марио
    { image: 'images/img4.jpg', correct: '🌊 Море' },     // Губка Боб
    { image: 'images/img5.jpg', correct: '🏠 Город' },    // Гринч
    { image: 'images/img6.jpg', correct: '🏠 Ферма' },    // Дональд Дак
    { image: 'images/img7.jpg', correct: '✨ Сказка' },   // Микки Маус
    { image: 'images/img8.jpg', correct: '🌲 Лес' }       // Тигра
];

// Все варианты ответов
const ALL_ANSWERS = ['🏠 Город', '🏠 Ферма', '🌲 Лес', '🌊 Море', '✨ Сказка'];

const TOTAL_QUESTIONS = 8;

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let soundEnabled = true;
let answered = false;

const questionImage = document.getElementById('question-image');
const answersContainer = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const questionNum = document.getElementById('question-num');
const questionTotal = document.getElementById('question-total');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('win-message');
const winTitle = document.getElementById('win-title');
const winComment = document.getElementById('win-comment');
const finalScore = document.getElementById('final-score');
const finalTotal = document.getElementById('final-total');
const restartBtn = document.getElementById('restart-btn');
const soundToggle = document.getElementById('sound-toggle');

const bgMusic = document.getElementById('bg-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const winSound = document.getElementById('win-sound');

bgMusic.volume = 0.2;
correctSound.volume = 0.6;
wrongSound.volume = 0.5;
winSound.volume = 0.7;

// Перемешивание массива
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Воспроизведение звука
function playSound(audio) {
    if (!soundEnabled) return;
    audio.currentTime = 0;
    audio.play().catch(e => console.log(e));
}

// Запуск игры
function startGame() {
    questions = shuffle(allQuestions).slice(0, TOTAL_QUESTIONS);
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = '0';
    questionTotal.textContent = TOTAL_QUESTIONS;
    winMessage.classList.remove('active');

    if (soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(e => console.log(e));
    }

    showQuestion();
}

// Показать вопрос
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    answered = false;
    feedback.textContent = '';
    feedback.classList.remove('wrong');

    const q = questions[currentQuestionIndex];
    questionNum.textContent = currentQuestionIndex + 1;

    questionImage.src = q.image;

    // Перемешиваем варианты ответов
    const allAnswers = shuffle([...ALL_ANSWERS]);

    answersContainer.innerHTML = '';

    allAnswers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(btn, answer, q.correct));
        answersContainer.appendChild(btn);
    });
}

// Проверка ответа
function checkAnswer(btn, selected, correct) {
    if (answered) return;
    answered = true;

    const allBtns = answersContainer.querySelectorAll('.answer-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.textContent = score;
        feedback.textContent = '✅ Правильно! Молодец!';
        feedback.classList.remove('wrong');
        playSound(correctSound);
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.textContent === correct) {
                b.classList.add('correct');
            }
        });
        feedback.textContent = `❌ Неправильно. Правильный ответ: ${correct}`;
        feedback.classList.add('wrong');
        playSound(wrongSound);
    }

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1800);
}

// Конец игры
function endGame() {
    finalScore.textContent = score;
    finalTotal.textContent = TOTAL_QUESTIONS;

    if (score === TOTAL_QUESTIONS) {
        winTitle.textContent = '🏆 Идеально! Ты знаешь всех!';
        winComment.textContent = 'Ты настоящий знаток персонажей!';
    } else if (score >= 6) {
        winTitle.textContent = '🎉 Отличный результат!';
        winComment.textContent = 'Ты очень внимательный!';
    } else if (score >= 4) {
        winTitle.textContent = '👍 Хорошо!';
        winComment.textContent = 'Попробуй ещё раз — получится лучше!';
    } else {
        winTitle.textContent = '😊 Неплохо!';
        winComment.textContent = 'Попробуй ещё раз, ты справишься!';
    }

    winMessage.classList.add('active');
    playSound(winSound);
}

// Обработчики
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

// Запуск фоновой музыки после первого клика
document.addEventListener('click', function startBgMusic() {
    if (soundEnabled && bgMusic.paused) {
        bgMusic.play().catch(e => console.log(e));
    }
    document.removeEventListener('click', startBgMusic);
}, { once: true });