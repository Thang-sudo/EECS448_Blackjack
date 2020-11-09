//2 Important helper variables below, manage access carefully
let currentBalance = 50 //stores player's running chip balance
let betAmount = 0 //stores chip bet amount for each hand

//Variable included for later program expansion
let currentPhase = 'player phase'


let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];//Array for possible numerical values of cards
let suitArray = ['D', 'H', 'S', 'C'] //Array for possible suit values of cards

let playerHand = [] //Array stores player's hand
let dealerHand = [] //Array stores dealer's hand

//helper variable for player identification on scoreboard
let m_playerHolder = 0;

//Hand totals for player and dealer
let playerHandSum = 0
let dealerHandSum = 0

//Tracks the number of soft aces still in play(Aces being treated as 11s)
let numOfAce = 0

//Button mapping below
let nextButton = document.getElementById('nextTurn')
let hitButton = document.getElementById('hitButton')
let stayButton = document.getElementById('stayButton')
let dealButton = document.getElementById('dealButton')

//Chip button mapping below
let oneChip = document.getElementById('oneChips')
let fiveChips = document.getElementById('fiveChips')
let tenChips = document.getElementById('tenChips')
let fifteenChips = document.getElementById('fifteenChips')
let clearBet = document.getElementById('clearBet')

//MULTIPLAYER helper varibles below

//mode stores current play mode. Values singleplayer or multiplayer
let mode = ""

//these variables store the indices of each player in multiplayer mode
let playerNum = 0;
let enemyNum = 0;

//this player has finished the current hand and is ready to proceed
let ready = false;

//otherPlayer has finished the current hand and is ready to proceed
let enemyReady = false;

//boolean allPlayerStay is true when all players have finished with the current hand and ready to proceed
let allPlayerStay;

//stayCount stores the number of players finished with the current hand
let stayCount = 0;

/* function startSinglePlayerMode()
 * initializes a single player game
 */
function startSinglePlayerMode(){
    mode = "singleplayer";
    console.log(mode)

    /*
     * Hit and Stay buttons used by player during playing phase
     */
    stayButton.addEventListener("click", Stay)
    hitButton.addEventListener("click", Hit)

    /*
     * Next Button used after end of hand to advance game to next hand
     * Does not become available until current hand ends
     */
    nextButton.addEventListener("click", startNextTurn)

    /*
     * Deal Button used to separate the betting and playing phases
     * Pressing deal locks in bet values and deals hand. 
     */
    dealButton.addEventListener("click", changesWhenBetCalled)
}

/* function startMultiPlayerMode()
 * Initializes a multiplayer game
 * Involves a lot of client-side setup for Socket.io communication between players
 */
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

/* helper function for multiplayer mode
 * 
 */
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

/* function startGameRule()
 * Displays game rules when selected
 */
function startGameRule(){
    window.location.href = "gamerule.html"
}


/*
 * Draws a card and adds it to the hand passed in as a parameter
 * @param hand: the hand to add the card to. Either playerHand or dealerHand
 */
function drawACard(hand){
    let cardDrawn = ''
    do{
        let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
        let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
        cardDrawn = randomCard + randomSuit;
    }while(hand.includes(cardDrawn));
    return cardDrawn
}

/* @pre: player selects the Hit button in singlePlayer mode
 * @post: playerDrawCard() is called to draw a card and add it to the player's hand
 */
function Hit(){
    // console.log(mode)
    playerDrawCard(); 
}

/* @pre: player selects the Hit button in multiplayer mode
 * @post: playerDrawCard(socket) is called to draw a card and add it to the player's hand
 * @param socket need this parameter when calling playerDrawCard in multiplayer mode
 */
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
            numOfAce = numOfAce + 1; //increment soft Ace counter
            if(playerHandSum + 11 > 21){
                cardNum = 1
                numOfAce = numOfAce - 1; //decrement soft Ace counter when it becomes a '1'
            }
            else{
                cardNum = 11
            }
            playerHandSum = playerHandSum + cardNum //recalculate hand total
        }
        else{
            cardNum = parseInt(cardLabel)
            playerHandSum = cardNum + playerHandSum //recalculate hand total
        }

        //if statement prevents bust when an 11-valued Ace is in the hand. 
        if(playerHandSum > 21 && numOfAce > 0){
            playerHandSum = playerHandSum - 10; //Changes Ace value from 11 to 1
            numOfAce = numOfAce - 1; //decrements counter of 11-valued Aces
        }
        console.log(playerHandSum)
        let imgName = cardDrawn+'.png'
        document.querySelector('#player-hand').innerHTML += "<div class='card-player'><img class = 'card-img' src = 'image/cards/"+imgName+"'></div>"
    }
    handCheck(socket) //check the hand for blackjack or busts after a new card is drawn
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


// helper function checks if all players have finished the hand and are ready to advance
function checkBothPlayerStay(socket){
    socket.emit('check-all-player-stay', true);
    socket.on('all-stay', allStay =>{
        if(allStay){
            revealDealerHand();
        }
    })
}


// helper function checks player hand for blackjack or busts
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

/* reveals dealer hand
 * @pre: all player(s) have finished their hand 
 * @post: dealer's hand is revealed and winners are determined
 */
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
                dealerHandSum = dealerHandSum + cardNum //recalculate hand total
            }
            else{
                cardNum = parseInt(cardLabel)
                dealerHandSum = dealerHandSum + cardNum //recalculate hand total
            }
    }
}

/* helper function disables chip buttons when balance is too low
 * called immediately upon beginning a new hand
 */
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

/* helper function turns on the next button when the current hand has ended
 * Busting, blackjack, all players staying can trigger this function
 */
function getNextButton(){
    document.getElementById('nextTurn').style.display = "inline-block"
    hitButton.disabled = true
    stayButton.disabled = true
   
}

// Start a new turn when user presses next button
function startNextTurn(){
    betAmount = 0
    disableBetAmount(currentBalance);
    clearBet.disabled = false;
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
    
}

/* helper function initializes dealer's hand 
 * @pre: player has finished betting phase, and has selected 'Deal'
 * @post: dealer's hand is initialized, first two cards are drawn, with one hidden
 */
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

/* helper function governs betting
 * Allows betting any combination of the chips between 1 and player's chip balance
 * clearBet resets to 0
 * Pressing the deal button locks these bets in 
 */
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

/* helper function called once bets are finalized and the round advances to the playing stage
 * @pre: called by the 'deal' button
 * @post: disables betting buttons, draws player and dealer hand, enables playing buttons 
 */
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
    playerDrawCard()
    dealerDraw()
    playerDrawCard()
    document.getElementById('message').innerText = 'Hit or Stay'
    
}

// Check for the win condition
function checkWinCondition(socket){
    if(currentBalance >= 100){
        document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
        console.log("Player wins")
        document.getElementById('message').innerText = 'Player wins'
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        dealButton.style.display = "none"
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
        document.getElementById('balanceText').innerText = "Current Balance:" + currentBalance + " Chips"
        console.log("Player lost")
        document.getElementById('message').innerText = 'Player loses'
        hitButton.style.display = "none"
        stayButton.style.display = "none"
        dealButton.style.display = "none"
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

