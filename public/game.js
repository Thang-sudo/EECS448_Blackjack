


let currentBalance = 200;
let betAmount = 0;
let currentPhase = 'player phase'


let cardArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];//Array for suits
let suitArray = ['diamond', 'heart', 'spade', 'club']
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number

let hitButton = document.getElementById('hitButton')
document.addEventListener('DOMContentLoaded', function () {
    console.log(document)
});
hitButton.addEventListener("click", Hit)

function Hit(){
    if(currentPhase === 'player phase'){
        let cardDrawn = ''
        do{
            console.log("Hit get called")
            let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
            let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
            cardDrawn = randomCard + ' '+ randomSuit;
        }while(cardDrawn in playerHand)

        playerHand.push(cardDrawn)
        
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><p>"+cardDrawn+"</p></div>"
    }
}

function dealerDraw(){
    if(currentPhase === 'player phase'){
        let cardDrawn = ''
        do{
            console.log("Hit get called")
            let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
            let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
            cardDrawn = randomCard + ' '+ randomSuit;
        }while(cardDrawn in playerHand)

        playerHand.push(cardDrawn)
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><p>"+cardDrawn+"</p></div>"
    }
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