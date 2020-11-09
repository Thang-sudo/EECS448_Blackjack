let cardArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let suitArray = ['D', 'H', 'S', 'C']
let playerHand = []
let dealerHand = []
let tests = []
let allPassed = true
function drawACard(array){
    let cardDrawn = ''
    do{
        let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
        let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
        cardDrawn = randomCard + randomSuit;
    }while(playerHand.includes(cardDrawn));
    return cardDrawn
}

function dealerDrawACard(){
    let cardDrawn = ''
    do{
        let randomCard = cardArray[Math.floor(Math.random()*cardArray.length)]
        let randomSuit = suitArray[Math.floor(Math.random()*suitArray.length)]
        cardDrawn = randomCard + randomSuit;
    }while(dealerHand.includes(cardDrawn));
    return cardDrawn
}

function hasDuplicates(array) {
    // console.log(array)
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

function handCheck(hand){
    let handSum = 0;
    let numOfAce = 0;
    for(let i in hand){
        // console.log(hand[i])
        let cardLabel = hand[i].slice(0,-1)
        let cardNum = 0
        if(cardLabel === 'J' || cardLabel === 'Q' || cardLabel === 'K' ){
            cardNum = 10
            handSum = cardNum + handSum
        }
        else if(cardLabel === 'A'){
            numOfAce = numOfAce + 1;
            if(handSum + 11 > 21){
                cardNum = 1
                numOfAce = numOfAce - 1;
            }
            else{
                cardNum = 11
            }
            handSum = handSum + cardNum
            
        }
        else{
            cardNum = parseInt(cardLabel)
            handSum = cardNum + handSum
        }
        if(handSum > 21 && numOfAce > 0){
            handSum = handSum - 10;
            numOfAce = numOfAce - 1;
        }
    }
    // console.log(handSum)
    return handSum
}

function Stay(hand1, hand2){
    let condition = 0
    let playerHandSum = handCheck(hand1)
    let dealerHandSum = handCheck(hand2)
    if(playerHandSum > 21){
        condition = 2;
    }
    else if(dealerHandSum > 21 || playerHandSum > dealerHandSum){
        condition = 0;
    }
    else if(dealerHandSum > playerHandSum){
        condition = 2;
    }
    else if(playerHandSum === dealerHandSum){
        condition = 1;
    }
    return condition;
}
    

function test01(){
    let card = drawACard();
    let cardSuit = card[card.length - 1];
    let cardNumber = card.slice(0, -1);
    if(cardArray.includes(cardNumber) && suitArray.includes(cardSuit)){
        return true;
    }
    else{
        return false;
    }
}

function test02(){
    for(let i = 0; i < 3; i++){
        let card  = drawACard();
        playerHand.push(card);
    }
    if(hasDuplicates(playerHand)){
        return false;
    }
    playerHand = [];
    return true;
}

function test03(){
    for(let i = 0; i < 10; i++){
        let card  = drawACard();
        playerHand.push(card);
    }
    if(hasDuplicates(playerHand)){
        return false;
    }
    playerHand = [];
    return true;
}

function test04(){
    for(let i = 0; i < 52; i++){
        let card  = drawACard(playerHand);
        playerHand.push(card);
    }
    if(hasDuplicates(playerHand)){
        return false;
    }
    playerHand = [];
    return true;
}

function test05(){
    for(let i = 0; i < 52; i++){
        let card  = dealerDrawACard(dealerHand);
        dealerHand.push(card);
    }
    if(hasDuplicates(dealerHand)){
        return false;
    }
    dealerHand = [];
    return true;
}

function test06(){
    playerHand = ['5D', '7H', '6S'];
    if(handCheck(playerHand) === 18){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test07(){
    playerHand = ['6D', '9H', '6S'];
    if(handCheck(playerHand) === 21){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test08(){
    playerHand = ['AD', '4H', '6S'];
    if(handCheck(playerHand) === 21){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test09(){
    playerHand = ['KD', 'QH', 'AS'];
    if(handCheck(playerHand) === 21){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test10(){
    playerHand = ['KD', 'QH', 'JS'];
    if(handCheck(playerHand) === 30){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test11(){
    playerHand = ['AD', 'AH', 'AS', 'AC'];
    if(handCheck(playerHand) === 14){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test12(){
    playerHand = ['AD', 'KH', 'QS', 'AC'];
    if(handCheck(playerHand) === 22){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test13(){
    playerHand = ['AD', 'KH', 'QS'];
    if(handCheck(playerHand) === 21){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test14(){
    playerHand = ['AD', 'AH', '8S'];
    if(handCheck(playerHand) === 20){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test15(){
    playerHand = ['AD', 'AH', 'AS'];
    if(handCheck(playerHand) === 13){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test16(){
    playerHand = ['AD', 'AH', 'AS'];
    if(handCheck(playerHand) === 13){
        playerHand = []
        return true;
    }
    else{
        playerHand = []
        return false
    }
}

function test17(){
    playerHand = ['AS', 'AC', 'AD']
    dealerHand = ['AC', 'AD', 'AH']
    let output = Stay(playerHand, dealerHand)
    if(output === 1){
        playerHand = []
        dealerHand = []
        return true
    }
    playerHand = []
    dealerHand = []
    return false
}

function test18(){
    playerHand = ['10S', '5C', 'AD']
    dealerHand = ['AC', 'AD', 'AH']
    let output = Stay(playerHand, dealerHand)
    if(output === 0){
        playerHand = []
        dealerHand = []
        return true
    }
    playerHand = []
    dealerHand = []
    return false
}

function test19(){
    playerHand = ['10S', '10C', '10D']
    dealerHand = ['AC', 'AD', 'AH']
    let output = Stay(playerHand, dealerHand)
    if(output === 2){
        playerHand = []
        dealerHand = []
        return true
    }
    playerHand = []
    dealerHand = []
    return false
}

function test20(){
    playerHand = ['5S', '2C', '3D']
    dealerHand = ['10C', '8D', '2H']
    let output = Stay(playerHand, dealerHand)
    if(output === 2){
        playerHand = []
        dealerHand = []
        return true
    }
    playerHand = []
    dealerHand = []
    return false
}

function runTests(){
    let testResults = document.getElementById('testResults')
    if(test01()){
        console.log("Test01: card is drawn from deck: PASSED")
        tests.push("Test01: card is drawn from deck: PASSED")
    }
    else{
        console.log("Test01: card is drawn from deck: FAILED")
        tests.push("Test01: card is drawn from deck: FAILED")
        allPassed = false
    }

    if(test02()){
        console.log("Test02: player draws 3 different cards: PASSED")
        tests.push("Test02: player draws 3 different cards: PASSED")
    }
    else{
        console.log("Test02: player draws 3 different cards: FAILED")
        tests.push("Test02: player draws 3 different cards: FAILED")
        allPassed = false
    }

    if(test03()){
        console.log("Test03: player draws 10 different cards: PASSED")
        tests.push("Test03: player draws 10 different cards: PASSED")
    }
    else{
        console.log("Test03: player draws 10 different cards: FAILED")
        tests.push("Test03: player draws 10 different cards: FAILED")
        allPassed = false
    }

    if(test04()){
        console.log("Test04: player draws 52 different cards: PASSED")
        tests.push("Test04: player draws 52 different cards: PASSED")
    }
    else{
        console.log("Test04: player draws 52 different cards: FAILED")
        tests.push("Test04: player draws 52 different cards: FAILED")
        allPassed = false
    }

    if(test05()){
        console.log("Test05: dealer draws 52 different cards: PASSED")
        tests.push("Test05: dealer draws 52 different cards: PASSED")
    }
    else{
        console.log("Test05: dealer draws 52 different cards: FAILED")
        tests.push("Test05: dealer draws 52 different cards: FAILED")
        allPassed = false
    }

    if(test06()){
        console.log("Test06: player hand is 5D 7H 6S, the total should be 18: PASSED")
        tests.push("Test06: player hand is 5D 7H 6S, the total should be 18: PASSED")
    }
    else{
        console.log("Test06: player hand is 5D 7H 6S, the total should be 18: FAILED")
        tests.push("Test06: player hand is 5D 7H 6S, the total should be 18: FAILED")
        allPassed = false
    }

    if(test07()){
        console.log("Test07: player hand is 6D 9H 6S, the total should be 21: PASSED")
        tests.push("Test07: player hand is 6D 9H 6S, the total should be 21: PASSED")
    }
    else{
        console.log("Test07: player hand is 6D 9H 6S, the total should be 21: FAILED")
        tests.push("Test07: player hand is 6D 9H 6S, the total should be 21: FAILED")
        allPassed = false
    }

    if(test08()){
        console.log("Test08: player hand is AD 4H 6S, the total should be 21: PASSED")
        tests.push("Test08: player hand is AD 4H 6S, the total should be 21: PASSED")
    }
    else{
        console.log("Test08: player hand is AD 4H 6S, the total should be 21: FAILED")
        tests.push("Test08: player hand is AD 4H 6S, the total should be 21: FAILED")
        allPassed = false
    }

    if(test09()){
        console.log("Test09: player hand is KD QH AS, the total should be 21: PASSED")
        tests.push("Test09: player hand is KD QH AS, the total should be 21: PASSED")
    }
    else{
        console.log("Test09: player hand is KD QH AS, the total should be 21: FAILED")
        tests.push("Test09: player hand is KD QH AS, the total should be 21: FAILED")
        allPassed = false
    }

    if(test10()){
        console.log("Test10: player hand is KD QH JS, the total should be 30: PASSED")
        tests.push()

    }
    else{
        console.log("Test10: player hand is KD QH JS, the total should be 30: FAILED")
        allPassed = false
    }

    if(test11()){
        console.log("Test11: player hand is AD AH AS AC, the total should be 14: PASSED")
    }
    else{
        console.log("Test11: player hand is AD AH AS AC, the total should be 14: FAILED")
        allPassed = false
    }

    if(test12()){
        console.log("Test12: player hand is 'AD', 'KH', 'QS', 'AC', the total should be 22: PASSED")
    }
    else{
        console.log("Test12: player hand is 'AD', 'KH', 'QS', 'AC', the total should be 22: FAILED")
        allPassed = false
    }

    if(test13()){
        console.log("Test13: player hand is 'AD', 'KH', 'QS', the total should be 21: PASSED")
    }
    else{
        console.log("Test13: player hand is 'AD', 'KH', 'QS', the total should be 21: FAILED")
        allPassed = false
    }

    if(test14()){
        console.log("Test14: player hand is 'AD', 'AH', '8S', the total should be 20: PASSED")
    }
    else{
        console.log("Test14: player hand is 'AD', 'AH', '8S', the total should be 20: FAILED")
        allPassed = false
    }

    if(test15()){
        console.log("Test15: player hand is 'AD', 'AH', 'AS', the total should be 13: PASSED")
    }
    else{
        console.log("Test15: player hand is 'AD', 'AH', 'AS', the total should be 13: FAILED")
        allPassed = false
    }

    if(test17()){
        console.log("Test17: player hand is same as dealer hand, the result is tie: PASSED")
    }
    else{
        console.log("Test17: player hand is same as dealer hand, the result is tie: FAILED")
        allPassed = false
    }
    if(test18()){
        console.log("Test18: player hand is bigger than dealer hand, player wins: PASSED")
    }
    else{
        console.log("Test18: player hand is bigger than dealer hand, player wins: FAILED")
        allPassed = false
    }

    if(test19()){
        console.log("Test19: player hand is bigger than dealer hand but over 21, player loses: PASSED")
    }
    else{
        console.log("Test19: player hand is bigger than dealer hand but over 21, player loses: FAILED")
        allPassed = false
    }
    if(test20()){
        console.log("Test20: player hand is smaller than dealer hand, player loses: PASSED")
    }
    else{
        console.log("Test20: player hand is smaller than dealer hand, player loses: FAILED")
        allPassed = false
    }
    if(allPassed === true){
        testResults.innerHTML = 'Test Results: All Passed! Check console for details.'
    }
    else if(allPassed === false){
        testResults.innerHTML = 'Test Results: One or more tests failed. Check console for details.'
    }
}
