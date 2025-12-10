const cards = document.querySelectorAll(".card");
const startBtn = document.getElementById("start-btn");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timer = 60;
let score = 0;
let countdown;
let gameFinished = true;

let currentLanguage = 'kg';
const translations = {
    'kg': {
        playAgain: 'Ойноо кайрадан',
        timeUp: 'Убакыт бүттү!',
        winMessage: 'Куттуктайбыз! Сиз 50 бонус уттуңуз!'
    },
    'en': {
        playAgain: 'Play Again',
        timeUp: 'Time\'s up!',
        winMessage: 'Congratulations! You won 50 bonuses!'
    }
};

const imagesList = [
    "алма.jpg", "торт.jpg", "coffee.jpg", "food.jpg",
    "dessert.jpg", "drinks.jpg", "гамбургер.jpg", "салат.jpg"
];


let playAgainBtn;

function createPlayAgainButton() {
    playAgainBtn = document.createElement('button');
    playAgainBtn.id = 'play-again-btn';
    playAgainBtn.textContent = translations[currentLanguage].playAgain;
    playAgainBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        padding: 16px 40px;
        font-size: 20px;
        font-weight: 700;
        background: #FFAA33;
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        z-index: 9999;
        opacity: 0;
        transition: all 0.4s ease;
        pointer-events: none;
    `;
    document.body.appendChild(playAgainBtn);
    playAgainBtn.onclick = shuffleCard;
}

function showPlayAgainBtn() {
    playAgainBtn.style.opacity = '1';
    playAgainBtn.style.transform = 'translateX(-50%) scale(1)';
    playAgainBtn.style.pointerEvents = 'auto';
}

function hidePlayAgainBtn() {
    playAgainBtn.style.opacity = '0';
    playAgainBtn.style.transform = 'translateX(-50%) scale(0.8)';
    playAgainBtn.style.pointerEvents = 'none';
}

function startGameTimer() {
    countdown = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.textContent = timer;
        } else {
            endGame(false);
        }
    }, 1000);
}

function endGame(success) {
    clearInterval(countdown);
    gameFinished = true;
    score = success ? 50 : 0;
    scoreElement.textContent = score;

    if (success) {
        alert(translations[currentLanguage].winMessage);
    } else {
        alert(translations[currentLanguage].timeUp);
    }

    setTimeout(showPlayAgainBtn, 800);

    if (window.parent !== window) {
        window.parent.postMessage({ type: 'gameFinished', points: score }, '*');
    }
}

function flipCard(e) {
    if (gameFinished || disableDeck || e.currentTarget === cardOne) return;
    e.currentTarget.classList.add("flip");
    if (!cardOne) {
        cardOne = e.currentTarget;
        return;
    }
    cardTwo = e.currentTarget;
    disableDeck = true;
    let img1 = cardOne.querySelector(".back-view img").src;
    let img2 = cardTwo.querySelector(".back-view img").src;
    matchCards(img1, img2);
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matched++;
        if (matched === 8) setTimeout(() => endGame(true), 600);
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disableDeck = false;
        return;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    hidePlayAgainBtn();

    matched = 0;
    cardOne = cardTwo = "";
    disableDeck = false;
    gameFinished = false;
    timer = 60;
    score = 0;
    timerElement.textContent = timer;
    scoreElement.textContent = score;
    clearInterval(countdown);
    startGameTimer();

    let arr = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];
    arr.sort(() => Math.random() - 0.5);

    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `/game/images/${imagesList[arr[i]]}`;
        card.removeEventListener("click", flipCard);
        card.addEventListener("click", flipCard);
    });
}


window.addEventListener("load", () => {
    createPlayAgainButton();
    hidePlayAgainBtn();

    const userLang = (navigator.language || navigator.userLanguage || 'kg');
    setLanguage(userLang.startsWith('en') ? 'en' : 'kg');

    const startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.style.display = "none";

    shuffleCard();
});

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        if (playAgainBtn) {
            playAgainBtn.textContent = translations[currentLanguage].playAgain;
        }
    }
}