const cards = document.querySelectorAll(".card");
const startBtn = document.getElementById("start-btn");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let timer = 30;
let score = 0;
let countdown;
let gameFinished = true;

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

const imagesList = [
    "алма.jpg",
    "торт.jpg",
    "coffee.jpg",
    "food.jpg",
    "dessert.jpg",
    "drinks.jpg",
    "гамбургер.jpg",
    "салат.jpg"
];

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

    setTimeout(() => {
        alert("Игра завершена! Ваш результат: " + score + " баллов");
    }, 300);
}

function flipCard({target: clickedCard}) {
    if (gameFinished) return;

    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");

        if(!cardOne) {
            return cardOne = clickedCard;
        }

        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched === 8 && timer > 0) {
            endGame(true);
            return;
        }
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
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    gameFinished = false;

    timer = 60;
    timerElement.textContent = timer;
    score = 0;
    scoreElement.textContent = score;

    clearInterval(countdown);
    startGameTimer();

    let arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/${imagesList[arr[i]-1]}`;
        card.addEventListener("click", flipCard);
    });
}

startBtn.addEventListener("click", () => {
    if(gameFinished) shuffleCard();
});

function endGame(success) {
    clearInterval(countdown);
    gameFinished = true;
    score = success ? 50 : 0;
    scoreElement.textContent = score;

    setTimeout(() => {
        alert("Игра завершена! Ваш результат: " + score + " баллов");
        window.parent.postMessage({
            type: 'gameFinished',
            points: score
        }, '*');
    }, 300);
}

window.parent.postMessage({
    type: 'gameFinished',
    points: score
}, '*');