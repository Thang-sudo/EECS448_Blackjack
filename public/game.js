


let currentBalance = 200;
let betAmount = 0;


let cardArray =['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']//Array for suits
let suitArray = ["diamonds", "hearts", "spades", "clubs"];
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number

const m_player1Card1 = document.getElementById("player1Card1");
const m_player1Card2 = document.getElementById("player1Card2");
const m_player1Card3 = document.getElementById("player1Card3");
const m_player1Card4 = document.getElementById("player1Card4");
const m_player1Card5 = document.getElementById("player1Card5");
const m_player1Card6 = document.getElementById("player1Card6");
const m_playerBalance = document.getElementById("balance");

const m_dealerCard1 = document.getElementById("dealerCard1");
const m_dealerCard2 = document.getElementById("dealerCard2");


const m_hitButton = document.getElementById("hitButton");
const m_stayButton = document.getElementById("stayButton");

document.addEventListener('DOMContentLoaded', function() {
    console.log(document);
});
m_hitButton.addEventListener("click", Hit);

function Hit(){
    console.log("Hit Called");
    let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
    let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
    console.log(randomCard);
    console.log(randomSuit);
    let cardDrawn = randomCard + randomSuit;
}

/*Methods:



hit();//Get another card (at your own peril), calls generateCard();
stay(); //End your turn, calls revealCard();


currentPhase();//Check whose turn it is
generateCard();//will select a card from the stack
checkValidCard();
revealCard();//Reveals dealers other card
compareCardDecks();//Compares the sums of each deck
We will need a deck.js file



*/