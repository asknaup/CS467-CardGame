
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

function addStagedCardFunctionality(primaryIndex, playerObj){
    playerObj.startIndex = Math.floor(primaryIndex / numScrollCards) * numScrollCards;
    playerObj.endIndex = playerObj.startIndex + (numScrollCards - 1);
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
    displayScrollCards(playerObj);
}

function addScrollCardFunctionality(primaryIndex, playerObj, scrollCard){
    scrollCard.onclick = function(){
        let primaryKey = playerObj.primaryKeyArr[primaryIndex];
        let cardData = playerObj.cardDict[primaryKey];
        if (cardData.isStaged == false){
            if(playerObj.stagedCardCount < 4){
                scrollCard.style.border = "6px solid #4caf50";
                var stageArea = document.getElementById(playerObj.stageArea);
                let stagedCard = createTradingCard(cardData.primaryKey + playerObj.stagedCard, cardData);
                stagedCard.onclick = function(){addStagedCardFunctionality(primaryIndex, playerObj)};
                stageArea.appendChild(stagedCard);
                cardData.isStaged = true;
                //stagedCardCount is a global variable
                playerObj.stagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(cardData.primaryKey + playerObj.stagedCard);
            stagedCard.remove();
            cardData.isStaged = false;
            //stagedCardCount is a global variable
            playerObj.stagedCardCount -= 1;
        }
    };
}

function displayScrollCards(playerObj){
    // Clear out old card elements
    //console.log(playerObj);
    var oldCards = document.getElementsByClassName(playerObj.newCardName);
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById(playerObj.cardSlots);
    for (let index = playerObj.startIndex; index <= playerObj.endIndex; index++){
        let primaryKey = playerObj.primaryKeyArr[index];
        let cardData = playerObj.cardDict[primaryKey];
        let scrollCard = createTradingCard(primaryKey, cardData);
        scrollCard.classList.add(playerObj.newCardName);
        addScrollCardFunctionality(index, playerObj, scrollCard);
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

var numScrollCards = 8;
let userObject = {primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7,
                    newCardName: "userNewCard", cardSlots: "userCardSlots", stageArea: "userStageArea",
                    stagedCard: "userStagedCard"};
let otherPlayerObj = {primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7,
                    newCardName: "otherNewCard", cardSlots: "otherCardSlots", stageArea: "otherStageArea",
                    stagedCard: "otherStagedCard"};
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    let uniquePrimaryKey = cardData.primaryKey + index.toString()
    userObject.primaryKeyArr.push(uniquePrimaryKey);
    userObject.cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes);
    // now create other player's card set
    let otherRandomIndex = (randomIndex + 1) %  exampleCards.length;
    let otherCardData = exampleCards[otherRandomIndex];
    let otherUniquePrimaryKey = otherCardData.primaryKey + index.toString()
    otherPlayerObj.primaryKeyArr.push(otherUniquePrimaryKey);
    otherPlayerObj.cardDict[otherUniquePrimaryKey]= new Card(otherUniquePrimaryKey, otherCardData.cardName, otherCardData.image,
                otherCardData.description, otherCardData.cardType, otherCardData.attributes);
}


/* main code for tradeAndCollect */
displayScrollCards(otherPlayerObj);
var otherScrollRightButton = document.getElementById("otherScrollRight");
otherScrollRightButton.addEventListener("click", () => {
    if (otherPlayerObj.endIndex < otherPlayerObj.primaryKeyArr.length - 1){
        otherPlayerObj.startIndex = otherPlayerObj.endIndex + 1;
        otherPlayerObj.endIndex += numScrollCards;
        if (otherPlayerObj.endIndex > otherPlayerObj.primaryKeyArr.length - 1){
            otherPlayerObj.endIndex = otherPlayerObj.primaryKeyArr.length - 1
        }
        console.log(otherPlayerObj.startIndex);
        console.log(otherPlayerObj.endIndex);
        displayScrollCards(otherPlayerObj);
    }
});

var otherrScrollLeftButton = document.getElementById("otherScrollLeft");
otherrScrollLeftButton.addEventListener("click", () => {
    if (otherPlayerObj.startIndex > 0){
        otherPlayerObj.endIndex = otherPlayerObj.startIndex - 1;
        otherPlayerObj.startIndex -= numScrollCards;
        if(otherPlayerObj.startIndex < 0){
            otherPlayerObj.startIndex = 0;
        }
        console.log(otherPlayerObj.startIndex);
        console.log(otherPlayerObj.endIndex);
        displayScrollCards(otherPlayerObj);
    }
});


displayScrollCards(userObject);
var userScrollRightButton = document.getElementById("userScrollRight");
userScrollRightButton.addEventListener("click", () => {
    if (userObject.endIndex < userObject.primaryKeyArr.length - 1){
        userObject.startIndex = userObject.endIndex + 1;
        userObject.endIndex += numScrollCards;
        if (userObject.endIndex > userObject.primaryKeyArr.length - 1){
            userObject.endIndex = userObject.primaryKeyArr.length - 1
        }
        console.log(userObject.startIndex);
        console.log(userObject.endIndex);
        displayScrollCards(userObject);
    }
});

var userScrollLeftButton = document.getElementById("userScrollLeft");
userScrollLeftButton.addEventListener("click", () => {
    if (userObject.startIndex > 0){
        userObject.endIndex = userObject.startIndex - 1;
        userObject.startIndex -= numScrollCards;
        if(userObject.startIndex < 0){
            userObject.startIndex = 0;
        }
        console.log(userObject.startIndex);
        console.log(userObject.endIndex);
        displayScrollCards(userObject);
    }
});

/* trading code =============================================================================================== */

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

