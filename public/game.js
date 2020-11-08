let currentBalance = 50
let betAmount = 0
let currentPhase = 'player phase'


let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];//Array for suits
let suitArray = ['D', 'H', 'S', 'C']
let playerHand = []//Arbitrary number
let dealerHand = []//Arbitrary number

let m_playerHolder = 0;
let playerHandSum = 0
let dealerHandSum = 0
let numOfAce = 0
let nextButton = document.getElementById('nextTurn')
let hitButton = document.getElementById('hitButton')
let stayButton = document.getElementById('stayButton')
let dealButton = document.getElementById('dealButton')
let oneChip = document.getElementById('oneChips')
let fiveChips = document.getElementById('fiveChips')
let tenChips = document.getElementById('tenChips')
let fifteenChips = document.getElementById('fifteenChips')
let clearBet = document.getElementById('clearBet')
let currentPlayer = 'user';
let mode = ""
let playerNum = 0;
let enemyNum = 0;
let ready = false;
let enemyReady = false;
let allPlayerStay;
let stayCount = 0;
function startSinglePlayerMode(){
    mode = "singleplayer";
    console.log(mode)
    stayButton.addEventListener("click", Stay)
    hitButton.addEventListener("click", Hit)
    nextButton.addEventListener("click", startNextTurn)
    dealButton.addEventListener("click", changesWhenBetCalled)
}

function startMultiPlayerMode(){
    
    const socket = io();
    socket.on('enough-player',()=>{
        document.getElementById('message').innerText = 'We already have enough players for the game'
    })
    mode = "multiplayer";
    console.log(mode)
    socket.on('player-number', number =>{
        if(number !== -1){
            playerNum = parseInt(number);
            if(playerNum === 1) {  
                enemyNum = 0;
            }
            else{
                enemyNum = 1;
            }
            playerConnectionStatus(playerNum);
        }
    })
    // Manange player connection on client-side

    socket.on('player-connection', number =>{
        console.log(`Player ${number} has connected` )
        playerConnectionStatus(number);
    })

    socket.on('player1-connected', number =>{
        let player = `#player${parseInt(number) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green');
    })

    socket.on('player2-connected', number =>{
        let player = `#player${parseInt(number) + 1}`
        document.querySelector(`${player} .connected span`).classList.toggle('green');
    })
    
    dealButton.addEventListener("click", changesWhenBetCalled)
    stayButton.addEventListener('click', () =>{stayInMultiplayer(socket)});
    hitButton.addEventListener('click', ()=>{hitInMultiplayer(socket)})
    nextButton.addEventListener('click', () => {
        ready = false;
        stayCount = 0;
        let playerStatus = {index: playerNum, currentBalance: currentBalance, stay: false}
        socket.emit('player-newTurn', playerStatus)
        let player = `#player${parseInt(playerNum) + 1}`
        document.querySelector(`${player} .stay span`).classList.remove('green');
        document.querySelector(`${player}-balance`).innerText = "Balance: " + currentBalance 
        startNextTurn()
    })
    socket.on('enemy-stay', payload =>{
        let player = `#player${parseInt(payload.index) + 1}`
        
        document.querySelector(`${player} .stay span`).classList.add('green');
        console.log("Enemy Stay")
        if(ready && payload.stay){
            stayCount = stayCount + 1;
            if(stayCount > 1) return;
            socket.emit('player-stay', playerNum)
            getNextButton();    
        }
    })

    socket.on('enemy-newTurn', payload =>{
        let player = `#player${parseInt(payload.index) + 1}`
        document.querySelector(`${player} .stay span`).classList.remove('green');
        document.querySelector(`${player}-balance`).innerText = "Balance: " + payload.currentBalance 
    })

    socket.on('enemy-won', payload =>{
        document.getElementById('message').innerText = `Player ${parseInt(payload.index) + 1} wins`
        document.getElementById('resetButton').style = 'inline-block'
    })
    
    socket.on('enemy-lose', payload =>{
        document.getElementById('message').innerText = `Player ${parseInt(payload.index) + 1} loses`
        document.getElementById('resetButton').style = 'inline-block'
    })
}

function playerConnectionStatus(number){
    let player = `#player${parseInt(number) + 1}`
    let playerID = `#playerID${parseInt(number) + 1}` //For scoreboard
    let m_playerTable = document.getElementById('playerTable');
    document.querySelector(`${player} .connected span`).classList.toggle('green');
    // Tell what player we are
    if(parseInt(number) === playerNum){
        console.log(`You are player ${playerNum + 1}`);
        m_playerHolder = playerNum + 1;//For scoreboard
        document.querySelector(playerID).style.fontWeight = 'bold';
        document.querySelector(playerID).innerHTML = "You are Player " + m_playerHolder;//For scoreboard
        m_playerTable.innerHTML = "Your Table";
    }
}

function startGameRule(){
    window.location.href = "gamerule.html"
}


// Draw card to hand
function drawACard(hand){
    let cardDrawn = ''
    do{
        let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
        let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
        cardDrawn = randomCard + randomSuit;
    }while(hand.includes(cardDrawn));
    return cardDrawn
}

// add card to player hand
function Hit(){
    // console.log(mode)
    playerDrawCard(); 
}

function hitInMultiplayer(socket){
    playerDrawCard(socket);
}

function playerDrawCard(socket){
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
            console.log("Drew " + cardLabel)
            numOfAce = numOfAce + 1;
            if(playerHandSum + 11 > 21){
                cardNum = 1
                numOfAce = numOfAce - 1;
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
    handCheck(socket)
}

// Player in multiple player mode hits stay
function stayInMultiplayer(socket){
    console.log(`Player ${playerNum} has stayed`)
    document.querySelector(`#player${parseInt(playerNum) + 1} .stay span`).classList.toggle('green');
    socket.emit('player-stay', playerNum);
    ready = true;
    Stay(socket);
}

// Player chooses to stay
function Stay(socket){

        revealDealerHand()
        if(dealerHandSum > 21 || playerHandSum > dealerHandSum){
            console.log("Player won this round")
            document.getElementById('message').innerText = 'Player won this round'
            currentBalance = currentBalance + betAmount * 2
        }
        else if(playerHandSum === dealerHandSum){
            document.getElementById('message').innerText = "It's a tie"
            console.log("It's a tie")
            currentBalance = currentBalance + betAmount
        }
        else{
            document.getElementById('message').innerText = 'Dealer won this round'
            console.log("Dealer won this round")
        }
        if(mode === "singleplayer"){
            getNextButton()
            checkWinCondition()
        }
        else if(mode === "multiplayer"){
            checkWinCondition(socket);
        }
        
    
}

function checkBothPlayerStay(socket){
    socket.emit('check-all-player-stay', true);
    socket.on('all-stay', allStay =>{
        if(allStay){
            revealDealerHand();
        }
    })
}



// check if player is over 21
function handCheck(socket){
    if(playerHandSum === 21){
        console.log("Black Jack!")
        document.getElementById('message').innerText = 'Black Jack!'
        currentBalance = currentBalance + betAmount * 2
        document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
        revealDealerHand()
        
        if(mode === "singleplayer"){
            checkWinCondition()
            getNextButton()
        }
        else if (mode === "multiplayer"){
            document.querySelector(`#player${parseInt(playerNum) + 1} .stay span`).classList.toggle('green');
            socket.emit('player-stay', playerNum);
            checkWinCondition(socket)
            hitButton.disabled = true
            stayButton.disabled = true
            ready = true;
        }
        
    }
    else if(playerHandSum > 21){
        if(numOfAce > 0){
            numOfAce = numOfAce - 1;
            playerHandSum = playerHandSum - 10
            console.log("Ace is in hand")
            if(playerHandSum > 21){
                console.log("Busted")
                document.getElementById('message').innerText = 'Busted!'
                revealDealerHand()
                
                if(mode === "singleplayer"){
                    checkWinCondition()
                    getNextButton()
                }
                else if(mode === "multiplayer"){
                    
                    document.querySelector(`#player${parseInt(playerNum) + 1} .stay span`).classList.toggle('green');
                    socket.emit('player-stay', playerNum);
                    console.log("Player get busted")
                    checkWinCondition(socket);
                    // getNextButton();
                    hitButton.disabled = true
                    stayButton.disabled = true
                    ready = true;
                }
            }
            else{
                return
            }
        }
        else{
            
            document.getElementById('message').innerText = 'Busted!'
            console.log("Busted")
            revealDealerHand()
            
            if(mode === "singleplayer"){
                checkWinCondition()
                getNextButton()
            }
            else if(mode === "multiplayer"){
                document.querySelector(`#player${parseInt(playerNum) + 1} .stay span`).classList.toggle('green');
                socket.emit('player-stay', playerNum);
                checkWinCondition(socket);
                hitButton.disabled = true
                stayButton.disabled = true
                ready = true;
            }
            
        }
    }
}

function disableChips(balance){
    if(balance < 1){
        
    }
}

// Reveal dealer hand
function revealDealerHand(){
    let imgName = dealerHand[0] + '.png'
    document.getElementById('dealer-hand').children[0].innerHTML = "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
    while(dealerHandSum < 17){
        let cardDrawn = drawACard(dealerHand)
            let imgName = cardDrawn+'.png'
            dealerHand.push(cardDrawn)
            document.querySelector('#dealer-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
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
}

function disableBetAmount(balance){
    if(balance < 1){
        oneChip.disabled = true;
        fiveChips.disabled = true;
        tenChips.disabled = true;
        fifteenChips.disabled = true;
    }
    else if(balance < 5){
        oneChip.disabled = false;
        fiveChips.disabled = true;
        tenChips.disabled = true;
        fifteenChips.disabled = true;
    }
    else if(balance < 10){
        oneChip.disabled = false;
        fiveChips.disabled = false;
        tenChips.disabled = true;
        fifteenChips.disabled = true;
    }
    else if(balance < 15){
        oneChip.disabled = false;
        fiveChips.disabled = false;
        tenChips.disabled = false;
        fifteenChips.disabled = true;
    }
    else{
        oneChip.disabled = false;
        fiveChips.disabled = false;
        tenChips.disabled = false;
        fifteenChips.disabled = false;
    }
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
    betAmount = 0
    disableBetAmount(currentBalance);
    document.getElementById('message').innerText = 'Choose your bet'
    document.querySelector('#player-hand').innerHTML = " "
    document.querySelector('#dealer-hand').innerHTML = "<div class='card-player'><img class = 'card-img' src = 'image/cards/red_back.png'></div> "
    document.getElementById('nextTurn').style.display = "none"
    hitButton.style.display = "none"
    stayButton.style.display = "none"
    playerHand = []
    dealerHand = []
    dealerHandSum = 0
    playerHandSum = 0
    clearBet.disabled = false;
    document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips";
    document.getElementById('betTotal').innerText = "Bet Total:" + betAmount + " Chips"
    // if(mode === "multiplayer"){
    //     console.log(socket)
    //     socket.emit('player-newTurn', playerNum)
    //     let player = `#player${parseInt(playerNum) + 1}`
    //     document.querySelector(`${player} .stay span`).classList.remove('green');
    // }
    
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
        if((currentBalance-betAmount) >= 1){
          betAmount = betAmount + 1
        }
        else{
          console.log("Insufficient funds")
        }
    }
    else if(id === 'fiveChips'){
        if((currentBalance-betAmount) >= 5){
          betAmount = betAmount + 5
        }
        else{
          console.log("Insufficient funds")
        }
    }
    else if(id === 'tenChips'){
        if((currentBalance-betAmount) >= 10){
          betAmount = betAmount + 10
        }
        else{
          console.log("Insufficient funds")
        }
    }
    else if(id === 'fifteenChips'){
        if((currentBalance-betAmount) >= 15){
          betAmount = betAmount + 15
        }
        else{
          console.log("Insufficient funds")
        }
    }
    else if(id === 'clearBet'){
      betAmount = 0;
    }
    document.getElementById('betTotal').innerText = "Bet Total:" + betAmount + " Chips"
    if(betAmount <= 0)
    {
      dealButton.style.display = "none"
      dealButton.disabled = true
    }
    else if(betAmount > 0)
    {
      dealButton.style.display = "inline-block"
      dealButton.disabled = false
    }
}

// Able Hit and Stay after player bet
function changesWhenBetCalled(){
    console.log(betAmount)
    currentBalance = currentBalance - betAmount
    document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
    hitButton.style.display = "inline-block"
    stayButton.style.display = "inline-block"
    dealButton.style.display = "none"
    hitButton.disabled = false
    stayButton.disabled = false
    dealButton.disabled = true
    oneChip.disabled = true
    fiveChips.disabled = true
    tenChips.disabled = true
    fifteenChips.disabled = true
    clearBet.disabled = true
    // playerDrawCard()
    dealerDraw()
    // playerDrawCard()
    document.getElementById('message').innerText = 'Hit or Stay'
    
}

// Check for the win condition
function checkWinCondition(socket){
    if(currentBalance >= 100){
        console.log("Player wins")
        document.getElementById('message').innerText = 'Player wins'
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        dealButtone.style.display = "none"
        document.getElementById('nextTurn').style.display = "none"
        oneChip.disabled = true
        fiveChips.disabled = true
        tenChips.disabled = true
        fifteenChips.disabled = true
        clearBet.disabled = true
        if(mode === "singleplayer"){
            document.getElementById('resetButton').style = 'inline-block'
        }
        else if(mode === "multiplayer"){
            socket.emit('player-win', playerNum);
            document.getElementById('message').innerText = `Player ${playerNum} wins`
            document.getElementById('resetButton').style = 'inline-block'
        }
    }
    else if(currentBalance <= 0){
        console.log("Player lost")
        document.getElementById('message').innerText = 'Player loses'
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        dealButtone.style.display = "none"
        document.getElementById('nextTurn').style.display = "none"
        oneChip.disabled = true
        fiveChips.disabled = true
        tenChips.disabled = true
        fifteenChips.disabled = true
        clearBet.disabled = true
        if(mode === "singleplayer"){
            document.getElementById('resetButton').style = 'inline-block'
        }
        else if(mode === "multiplayer"){
            socket.emit('player-lose', playerNum);
            document.getElementById('message').innerText = `Player ${playerNum + 1} loses`
            document.getElementById('resetButton').style = 'inline-block'
        }
    }
}

