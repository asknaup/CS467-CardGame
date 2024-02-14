
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

function addStagedCardFunctionality(primaryIndex, primaryKeyArr){
    var startIndex = Math.floor(primaryIndex / numScrollCards) * numScrollCards;
    var endIndex = startIndex + (numScrollCards - 1);
    if (endIndex > primaryKeyArr.length - 1){
        endIndex = primaryKeyArr.length - 1
    }
    displayScrollCards(startIndex, endIndex, primaryKeyArr);
}

function addScrollCardFunctionality(primaryIndex, primaryKeyArr, scrollCard){
    scrollCard.onclick = function(){
        let primaryKey = primaryKeyArr[primaryIndex];
        let cardData = cardDict[primaryKey];
        if (cardData.isStaged == false){
            if(stagedCardCount < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var stageArea = document.getElementById("stageAreaZero");
                let stagedCard = createTradingCard(cardData.primaryKey + "StagedCard", cardData);
                stagedCard.onclick = function(){addStagedCardFunctionality(primaryIndex, primaryKeyArr)};
                stageArea.appendChild(stagedCard);
                cardData.isStaged = true;
                //stagedCardCount is a global variable
                stagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(cardData.primaryKey + "StagedCard");
            stagedCard.remove();
            cardData.isStaged = false;
            //stagedCardCount is a global variable
            stagedCardCount -= 1;
        }
    };
}

function displayScrollCards(startIndex, endIndex, primaryKeyArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById("cardSlots");
    for (let index = startIndex; index <= endIndex; index++){
        let primaryKey = primaryKeyArr[index];
        let cardData = cardDict[primaryKey];
        let scrollCard = createTradingCard(primaryKey, cardData);
        scrollCard.classList.add('newCard');
        addScrollCardFunctionality(index, primaryKeyArr, scrollCard);
        if (cardData.isStaged == true){
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

let primaryKeyArr = [];
let cardDict = {};
let otherPrimaryKeyArr = [];
let otherCardDict = {};
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    let uniquePrimaryKey = cardData.primaryKey + index.toString()
    primaryKeyArr.push(uniquePrimaryKey);
    cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes);
    // now create other player's card set
    let otherRandomIndex = (randomIndex + 1) %  exampleCards.length;
    let otherCardData = exampleCards[otherRandomIndex];
    let otherUniquePrimaryKey = otherCardData.primaryKey + index.toString()
    otherPrimaryKeyArr.push(otherUniquePrimaryKey);
    otherCardDict[otherUniquePrimaryKey] = new Card(otherUniquePrimaryKey, otherCardData.cardName, otherCardData.image,
                otherCardData.description, otherCardData.cardType, otherCardData.attributes);
}


/* main code for tradeAndCollect */
var numScrollCards = 8;
var stagedCardCount = 0;
var startIndex = 0;
var endIndex = numScrollCards - 1;
displayScrollCards(startIndex, endIndex, primaryKeyArr);

var scrollRightButton = document.getElementById("scrollRight");
scrollRightButton.addEventListener("click", () => {
    if (endIndex < primaryKeyArr.length - 1){
        startIndex = endIndex + 1;
        endIndex += numScrollCards;
        if (endIndex > primaryKeyArr.length - 1){
            endIndex = primaryKeyArr.length - 1
        }
        console.log(startIndex);
        console.log(endIndex);
        displayScrollCards(startIndex, endIndex, primaryKeyArr);
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
        displayScrollCards(startIndex, endIndex, primaryKeyArr);
    }
});


/* other player's screen code ================================================================================== */
function otherAddStagedCardFunctionality(otherPrimaryIndex, primaryKeyArr){
    var otherStartIndex = Math.floor(otherPrimaryIndex / numScrollCards) * numScrollCards;
    var otherEndIndex = otherStartIndex + (numScrollCards - 1);
    if (otherEndIndex > primaryKeyArr.length - 1){
        otherEndIndex = primaryKeyArr.length - 1
    }
    otherDisplayScrollCards(otherStartIndex, otherEndIndex, primaryKeyArr);
}

function otherAddScrollCardFunctionality(otherPrimaryIndex, otherPrimaryKeyArr, scrollCard){
    scrollCard.onclick = function(){
        let otherPrimaryKey = otherPrimaryKeyArr[otherPrimaryIndex];
        let otherCardData = otherCardDict[otherPrimaryKey];
        if (otherCardData.isStaged == false){
            if(otherStagedCardCount < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var otherStageArea = document.getElementById("otherStageArea");
                let otherStagedCard = createTradingCard(otherCardData.primaryKey + "otherStagedCard", otherCardData);
                otherStagedCard.onclick = function(){otherAddStagedCardFunctionality(otherPrimaryIndex, otherPrimaryKeyArr)};
                otherStageArea.appendChild(otherStagedCard);
                otherCardData.isStaged = true;
                //stagedCardCount is a global variable
                otherStagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var otherStagedCard = document.getElementById(otherCardData.primaryKey + "otherStagedCard");
            otherStagedCard.remove();
            otherCardData.isStaged = false;
            //stagedCardCount is a global variable
            otherStagedCardCount -= 1;
        }
    };
}

function otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherPrimaryKeyArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("otherNewCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var otherCardSlots = document.getElementById("otherCardSlots");
    for (let index = otherStartIndex; index <= otherEndIndex; index++){
        let otherPrimaryKey = otherPrimaryKeyArr[index];
        let otherCardData = otherCardDict[otherPrimaryKey];
        let scrollCard = createTradingCard(otherPrimaryKey, otherCardData);
        scrollCard.classList.add('otherNewCard');
        otherAddScrollCardFunctionality(index, otherPrimaryKeyArr, scrollCard);
        if (otherCardData.isStaged == true){
            scrollCard.style.border = "6px solid #4caf50";
        }else{
            scrollCard.style.border = "3px solid black";
        }
        otherCardSlots.appendChild(scrollCard);
    }
}


/* main code for tradeAndCollect */
var otherStagedCardCount = 0;
var otherStartIndex = 0;
var otherEndIndex = numScrollCards - 1;
otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherPrimaryKeyArr);

var otherScrollRightButton = document.getElementById("otherScrollRight");
otherScrollRightButton.addEventListener("click", () => {
    if (otherEndIndex < otherPrimaryKeyArr.length - 1){
        otherStartIndex = otherEndIndex + 1;
        otherEndIndex += numScrollCards;
        if (otherEndIndex > otherPrimaryKeyArr.length - 1){
            otherEndIndex = otherPrimaryKeyArr.length - 1
        }
        console.log(otherStartIndex);
        console.log(otherEndIndex);
        otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherPrimaryKeyArr);
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
        otherDisplayScrollCards(otherStartIndex, otherEndIndex, otherPrimaryKeyArr);
    }
});

/* trading code =============================================================================================== */
function popUpTradeForm(){

}

function getStagedCards(){
    var stagedArea = document.getElementById("stageAreaZero");
    let endSubstring = "StagedCard";
    let cardArr = []
    for(const stagedCard of stagedArea.children){
        let primaryKeyEndIndex = stagedCard.id.length - endSubstring.length;
        let primaryKey = stagedCard.id.substring(0, primaryKeyEndIndex)
        console.log(primaryKey);
        console.log(stagedCard.id);
    }
}

var tradeHasStarted = false;
var startTradeButton = document.getElementById("startTradeButton");
startTradeButton.addEventListener("click", () => {
    tradeHasStarted = true;
    console.log(tradeHasStarted);
    getStagedCards();
    if (tradeHasStarted && otherPlayerHasStarted){
        console.log("this trade is in action")
    }
});

function otherGetStagedCards(){
    var otherStagedArea = document.getElementById("otherStageArea");
    let endSubstring = "otherStagedCard";
    let otherCardArr = []
    for(const otherStagedCard of otherStagedArea.children){
        let primaryKeyEndIndex = otherStagedCard.id.length - endSubstring.length;
        let primaryKey = otherStagedCard.id.substring(0, primaryKeyEndIndex)
        console.log(primaryKey);
        console.log(otherStagedCard.id);
    }
}

var otherPlayerHasStarted = false;
var otherStartTradeButton = document.getElementById("otherStartTradeButton");
otherStartTradeButton.addEventListener("click", () => {
    otherPlayerHasStarted = true;
    otherGetStagedCards();
    if (otherPlayerHasStarted && tradeHasStarted){
        console.log("this trade is in action")
    }
});
