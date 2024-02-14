
import { createTradingCard } from "./generalCardCode.mjs";

class Card{
    constructor(primaryKey, cardName, image, description, cardType, attributes){
        this.primaryKey = primaryKey;
        this.cardName = cardName;
        this.image = image;
        this.description = description;
        this.cardType = cardType;
        this.attributes = attributes;
        this.isStaged = false;
    }
}

function addStagedCardFunctionality(cardArrIndex, cardArr){
    var startIndex = Math.floor(cardArrIndex / numScrollCards) * numScrollCards;
    var endIndex = startIndex + (numScrollCards - 1);
    if (endIndex > cardArr.length - 1){
        endIndex = cardArr.length - 1
    }
    displayScrollCards(startIndex, endIndex, cardArr);
}

function addScrollCardFunctionality(cardArrIndex, cardArr, scrollCard){
    scrollCard.onclick = function(){
        if (cardArr[cardArrIndex].isStaged == false){
            if(stagedCardCount < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var stageArea = document.getElementById("stageAreaZero");
                var newId = scrollCard.id + "StagedCard";
                let stagedCard = createTradingCard(newId, cardArr[cardArrIndex]);
                stagedCard.onclick = function(){addStagedCardFunctionality(cardArrIndex, cardArr)};
                stageArea.appendChild(stagedCard);
                cardArr[cardArrIndex].isStaged = true;
                //stagedCardCount is a global variable
                stagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(scrollCard.id + "StagedCard");
            stagedCard.remove();
            cardArr[cardArrIndex].isStaged = false;
            //stagedCardCount is a global variable
            stagedCardCount -= 1;
        }
    };
}

function displayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById("cardSlots");
    for (let index = startIndex; index <= endIndex; index++){
        var elementId = cardArr[index].primaryKey;
        let scrollCard = createTradingCard(elementId, cardArr[index]);
        scrollCard.classList.add('newCard');
        addScrollCardFunctionality(index, cardArr, scrollCard);
        if (cardArr[index].isStaged == true){
            scrollCard.style.border = "6px solid #4caf50";
        }else{
            scrollCard.style.border = "3px solid black";
        }
        cardSlots.appendChild(scrollCard);
    }
}

/* Create Example Dummy Cards */
// Example cards data (you can add more)
var exampleCards = [
    {primaryKey: "goblin", cardName: "Goblin", image: 'images/goblin-willow-tree.jpg', 
            description: 'A small forest goblin.', cardType:'Creature', 
            attributes: {hp:50, atk:50, def:30, specialAbility:'Cooking', goldCost:5}},
    {primaryKey: "wizard", cardName: 'Fire Ball Scroll', image: 'images/dark-wizard.png',  
                description:'A powerful fire ball.', cardType: 'Spell', 
                attributes: {hp:80, atk:60, def:20, specialAbility:'Fire Ball', goldCost:7}},
    {primaryKey: "iceDragon", cardName: 'Ice Dragon', image: 'images/ice-dragon.png', 
                description: 'An ice dragon from the North.', cardType: 'Creature', 
                attributes: {hp:120, atk:100, def:80, specialAbility:'Flying', goldCost:9}}
    // Add more cards as needed
];

let cardArr = [];
let otherCardArr = [];
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    cardArr.push(new Card(cardData.primaryKey + index.toString(), cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes));
    let randomIndex1 = (randomIndex + 1) %  exampleCards.length;
    console.log(randomIndex1);
    let otherCardData = exampleCards[randomIndex1];
    otherCardArr.push(new Card(otherCardData.primaryKey + index.toString(), otherCardData.cardName, otherCardData.image,
                otherCardData.description, otherCardData.cardType, otherCardData.attributes));
}


/* main code for tradeAndCollect */
var numScrollCards = 8;
var stagedCardCount = 0;
var startIndex = 0;
var endIndex = numScrollCards - 1;
displayScrollCards(startIndex, endIndex, cardArr);

var scrollRightButton = document.getElementById("scrollRight");
scrollRightButton.addEventListener("click", () => {
    if (endIndex < cardArr.length - 1){
        startIndex = endIndex + 1;
        endIndex += numScrollCards;
        if (endIndex > cardArr.length - 1){
            endIndex = cardArr.length - 1
        }
        console.log(startIndex);
        console.log(endIndex);
        displayScrollCards(startIndex, endIndex, cardArr);
    }
});

var scrollLeftButton = document.getElementById("scrollLeft");
scrollLeftButton.addEventListener("click", () => {
    if (startIndex > 0){
        endIndex = startIndex - 1;
        startIndex -= numScrollCards;
        if(startIndex < 0){
            startIndex = 0;
        }
        console.log(startIndex);
        console.log(endIndex);
        displayScrollCards(startIndex, endIndex, cardArr);
    }
});


/* other players screen =======================================================================================*/
function otherAddStagedCardFunctionality(cardArrIndex, otherCardArr){
    var otherStartIndex = Math.floor(cardArrIndex / numScrollCards) * numScrollCards;
    var otherEndIndex = otherStartIndex + (numScrollCards - 1);
    if (otherEndIndex > otherCardArr.length - 1){
        otherEndIndex = otherCardArr.length - 1
    }
    otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherCardArr);
}

function otherAddScrollCardFunctionality(cardArrIndex, cardArr, scrollCard){
    scrollCard.onclick = function(){
        if (cardArr[cardArrIndex].isStaged == false){
            if(otherStagedCardCount < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var otherStageArea = document.getElementById("otherStageArea");
                var newId = scrollCard.id + "otherStagedCard";
                let stagedCard = createTradingCard(newId, cardArr[cardArrIndex]);
                stagedCard.onclick = function(){otherAddStagedCardFunctionality(cardArrIndex, cardArr)};
                otherStageArea.appendChild(stagedCard);
                cardArr[cardArrIndex].isStaged = true;
                //stagedCardCount1 is a global variable
                otherStagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(scrollCard.id + "otherStagedCard");
            stagedCard.remove();
            cardArr[cardArrIndex].isStaged = false;
            //stagedCardCount1 is a global variable
            otherStagedCardCount -= 1;
        }
    };
}

function otherDisplayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("otherNewCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById("otherCardSlots");
    for (let index = startIndex; index <= endIndex; index++){
        var elementId = cardArr[index].primaryKey;
        let scrollCard = createTradingCard(elementId, cardArr[index]);
        scrollCard.classList.add('otherNewCard');
        otherAddScrollCardFunctionality(index, cardArr, scrollCard);
        if (cardArr[index].isStaged == true){
            scrollCard.style.border = "6px solid #4caf50";
        }else{
            scrollCard.style.border = "3px solid black";
        }
        cardSlots.appendChild(scrollCard);
    }
}

/* main code for tradeAndCollect */
var otherStagedCardCount = 0;
var otherStartIndex = 0;
var otherEndIndex = numScrollCards - 1;
otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherCardArr);

var otherScrollRightButton = document.getElementById("otherScrollRight");
otherScrollRightButton.addEventListener("click", () => {
    if (otherEndIndex < otherCardArr.length - 1){
        otherStartIndex = otherEndIndex + 1;
        otherEndIndex += numScrollCards;
        if (otherEndIndex > otherCardArr.length - 1){
            otherEndIndex = otherCardArr.length - 1
        }
        console.log(otherStartIndex);
        console.log(otherEndIndex);
        otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherCardArr);
    }
});

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
otherScrollLeftButton.addEventListener("click", () => {
    if (otherStartIndex > 0){
        otherEndIndex = otherStartIndex - 1;
        otherStartIndex -= numScrollCards;
        if(otherStartIndex < 0){
            otherStartIndex = 0;
        }
        console.log(otherStartIndex);
        console.log(otherEndIndex);
        otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherCardArr);
    }
});
/* trading code ===============================================================================================*/
function getStagedCards(){
    var stagedArea = document.getElementById("stageAreaZero");
    for(const stagedCard of stagedArea.children){
        console.log(stagedCard.id);
    }
}
var tradeHasStarted = false;
var startTradeButton = document.getElementById("startTradeButton");
startTradeButton.addEventListener("click", () => {
    tradeHasStarted = true;
    console.log(tradeHasStarted);
    getStagedCards();
    if (tradeHasStarted && otherPlayerTradeHasStarted){
        console.log("this trade is in action")
    }
});

var otherPlayerTradeHasStarted = false;
var startTradeButton1 = document.getElementById("otherStartTradeButton");
startTradeButton1.addEventListener("click", () => {
    otherPlayerTradeHasStarted = true;
    console.log(otherPlayerTradeHasStarted);
    if (otherPlayerTradeHasStarted && tradeHasStarted){
        console.log("this trade is in action")
    }
});