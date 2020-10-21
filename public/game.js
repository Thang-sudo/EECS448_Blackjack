


let currentBalance = 200;
let betAmount = 0;


let cardArray = new Array(13);//Array for suits
let suitArray = new Array(4);
let playerDeck = new Array(5);//Arbitrary number
let dealerDeck = new Array (5);//Arbitrary number



for(let i = 0; i < 4; i++)
{
    suitArray[i] = new Array(13);
}

for(let i = 0; i < 4; i++)
{
    for(let j = 0; j < 13; j++)
    {
        suitArray[i][j] = "-";
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