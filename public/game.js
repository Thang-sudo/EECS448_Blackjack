


let currentBalance = 200;
let betAmount = 0;
let currentPhase = 'player phase'


let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];//Array for suits
let suitArray = ['D', 'H', 'S', 'C']
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number
let mode = ""
// let singlePlayerButton = document.getElementById('btn-single')
let hitButton = document.getElementById('hitButton')

// singlePlayerButton.addEventListener("click", () => {
//     mode = "singlePlayer"
//     console.log(mode)
// })

hitButton.addEventListener("click", Hit)

function Hit(){
    // console.log(mode)
    if(currentPhase === 'player phase'){
        let cardDrawn = ''
        do{
            console.log("Hit get called")
            let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
            let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
            cardDrawn = randomCard + randomSuit;
        }while(cardDrawn in playerHand)

        playerHand.push(cardDrawn)
        let imgName = cardDrawn+'.png'
        console.log(imgName)
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
    }
}

function dealerDraw(){
    if(currentPhase === 'player phase'){
        let cardDrawn = ''
        do{
            console.log("Hit get called")
            let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
            let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
            cardDrawn = randomCard + randomSuit;
        }while(cardDrawn in playerHand)
        let imgName = cardDrawn+'.png'
        playerHand.push(cardDrawn)
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><img src = '"+imgName+"'></div>"
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