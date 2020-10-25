


let currentBalance = 200;
let betAmount = 0;
let currentPhase = 'player phase'


let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];//Array for suits
let suitArray = ['D', 'H', 'S', 'C']
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number
let mode = ""
let playerHandSum = 0

let hitButton = document.getElementById('hitButton')

function startSinglePlayerMode(){
    mode = "singleplayer"
}


hitButton.addEventListener("click", Hit)
// Draw card to hand
function drawACard(hand){
    let cardDrawn = ''
    do{
        let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
        let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
        cardDrawn = randomCard + randomSuit;
    }while(cardDrawn in hand)
    return cardDrawn
}

// add card to player hand
function Hit(){
    // console.log(mode)
    if(currentPhase === 'player phase'){
        let cardDrawn = drawACard(playerHand)
        playerHand.push(cardDrawn)
        let cardLabel = cardDrawn.slice(0,-1)
        let cardNum = 0
        if(cardLabel === 'J' || cardLabel === 'Q' || cardLabel === 'K' ){
            cardNum = 10
        }
        else{
            cardNum = parseInt(cardLabel)
        }
        playerHandSum = cardNum + playerHandSum
        
        console.log(playerHandSum)
        let imgName = cardDrawn+'.png'
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
    }
}


//generate dealer hand
function dealerDraw(){
    if(currentPhase === 'player phase'){
        let cardDrawn = ''
        while(dealerHand.length < 2){
            let cardDrawn = drawACard(dealerHand)
            let imgName = cardDrawn+'.png'
            dealerHand.push(cardDrawn)
            if(dealerHand.length == 2){
                document.querySelector('#dealer-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
            }
        }   
       
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