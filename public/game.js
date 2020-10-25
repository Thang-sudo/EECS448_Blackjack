let currentBalance = 200
let betAmount = 0
let currentPhase = 'player phase'


let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];//Array for suits
let suitArray = ['D', 'H', 'S', 'C']
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number
let mode = ""
let playerHandSum = 0
let dealerHandSum = 0
let hitButton = document.getElementById('hitButton')
let stayButton = document.getElementById('stayButton')


function startSinglePlayerMode(){
    mode = "singleplayer"
    window.location.href = "game.html"
}

function startMultiPlayerMode(){
    mode = "multiplayer"
    window.location.href = "game.html"
}

function startGameRule(){
    window.location.href = "gamerule.html"
}

hitButton.addEventListener("click", Hit)
stayButton.addEventListener("click", Stay)
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
            playerHandSum = cardNum + playerHandSum
        }
        else if(cardLabel === 'A'){
            if(playerHandSum + 11 > 21){
                cardNum = 1
            }
            else{
                cardNum = 11
            }
            playerHandSum = playerHandSum + cardNum
        }
        else{
            cardNum = parseInt(cardLabel)
            playerHandSum = cardNum + playerHandSum
        }
        
        console.log(playerHandSum)
        let imgName = cardDrawn+'.png'
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
    }
    handCheck(playerHand)
}

// Player chooses to stay
function Stay(){
    revealDealerHand()
    if(playerHandSum > dealerHandSum){
        console.log("Player won this round")
        currentBalance = currentBalance + betAmount * 2
    }
    else if(playerHand === dealerHandSum){
        console.log("It's a tie")
        currentBalance = currentBalance + betAmount
    }
    else{
        console.log("Dealer won this round")
    }
    getNextButton()
    checkWinCondition()
}

// check if player is over 21
function handCheck(){
    if(playerHandSum === 21){
        console.log("Black Jack!")
        currentBalance = currentBalance + betAmount * 2
        document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
        revealDealerHand()
        checkWinCondition()
        getNextButton()
    }
    else if(playerHandSum > 21){
        if(playerHand.includes('AD') || playerHand.includes('AH') || playerHand.includes('AS') || playerHand.includes('AC')){
            playerHandSum = playerHandSum - 10
            console.log("Ace is in hand")
            if(playerHandSum > 21){
                console.log("Busted")
                revealDealerHand()
                checkWinCondition()
                getNextButton()
            }
            else{
                return
            }
        }
        else{
            console.log("Busted")
            revealDealerHand()
            checkWinCondition()
            getNextButton()
        }
    }
}

// Reveal dealer hand
function revealDealerHand(){
    let imgName = dealerHand[0] + '.png'
    document.getElementById('dealer-hand').children[0].innerHTML = "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
}

// changes when busted or black jack happens
function getNextButton(){
    document.getElementById('nextTurn').style.display = "inline-block"
    hitButton.disabled = true
    stayButton.disabled = true
   
}

// Start a new turn when user presses next button
function startNextTurn(){
    // clear player hand and creat new hand for dealer
    document.querySelector('#player-hand').innerHTML = " "
    document.querySelector('#dealer-hand').innerHTML = "<div class='card-player'><img class = 'card-img' src = 'image/cards/red_back.png'></div> "
    document.getElementById('nextTurn').style.display = "none"
    hitButton.style.display = "none"
    stayButton.style.display = "none"
    document.getElementById('oneChips').disabled = false
    document.getElementById('fiveChips').disabled = false
    document.getElementById('tenChips').disabled = false
    document.getElementById('fifteenChips').disabled = false
    
    playerHand = []
    dealerHand = []
    dealerHandSum = 0
    playerHandSum = 0
    dealerDraw()
    document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
    
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
            let cardLabel = cardDrawn.slice(0,-1)
            let cardNum = 0
            if(cardLabel === 'J' || cardLabel === 'Q' || cardLabel === 'K' ){
                cardNum = 10
                dealerHandSum = cardNum + dealerHandSum
            }
            else if(cardLabel === 'A'){
                if(dealerHandSum + 11 > 21){
                    cardNum = 1
                }
                else{
                    cardNum = 11
                }
                dealerHandSum = dealerHandSum + cardNum
            }
            else{
                cardNum = parseInt(cardLabel)
                dealerHandSum = dealerHandSum + cardNum
            } 
        } 
        console.log(dealerHand[0])
        console.log(dealerHandSum) 
    }
}

// Player chooses an amount to bet, then player can start to hit
function bet(id){
    if(id === 'oneChip'){
        betAmount = 1
    }
    else if(id === 'fiveChips'){
        betAmount = 5
    }
    else if(id === 'tenChips'){
        betAmount = 10
    }
    else if(id === 'fifteenChips'){
        betAmount = 15
    }
    console.log(betAmount)
    currentBalance = currentBalance - betAmount
    document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
    changesWhenBetCalled()
}

// Able Hit and Stay after player bet
function changesWhenBetCalled(){
    hitButton.style.display = "inline-block"
    stayButton.style.display = "inline-block"
    hitButton.disabled = false
    stayButton.disabled = false
    document.getElementById('oneChips').disabled = true
    document.getElementById('fiveChips').disabled = true
    document.getElementById('tenChips').disabled = true
    document.getElementById('fifteenChips').disabled = true
    
}

// Check for the win condition
function checkWinCondition(){
    if(currentBalance >= 250){
        console.log("Player wins")
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        document.getElementById('nextTurn').style.display = "none"
        document.getElementById('oneChips').disabled = true
        document.getElementById('fiveChips').disabled = true
        document.getElementById('tenChips').disabled = true
        document.getElementById('fifteenChips').disabled = true
        document.getElementById('resetButton').style = 'inline-block'
    }
    else if(currentBalance <= 0){
        console.log("Player lost")
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        document.getElementById('nextTurn').style.display = "none"
        document.getElementById('oneChips').disabled = true
        document.getElementById('fiveChips').disabled = true
        document.getElementById('tenChips').disabled = true
        document.getElementById('fifteenChips').disabled = true
        document.getElementById('resetButton').style = 'inline-block'
    }
}


/*
Methods:



hit();//Get another card (at your own peril), calls generateCard();
stay(); //End your turn, calls revealCard();


currentPhase();//Check whose turn it is
generateCard();//will select a card from the stack
checkValidCard();
revealCard();//Reveals dealers other card
compareCardDecks();//Compares the sums of each deck
We will need a deck.js file


*/