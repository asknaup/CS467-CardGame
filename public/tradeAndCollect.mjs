import { createTradingCardWithId } from "./generalCardCode.mjs";

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

function highlightCard(isHighlighted, playerObj, scrollCard){
    if (isHighlighted){
        if(playerObj.stageAreaId === "userStageAreaId"){
            scrollCard.style.border = "6px solid #65f76b";
        }else{
            scrollCard.style.border = "6px solid #f06cf0";
        }
    }else{
        scrollCard.style.border = "3px solid black";
    }
}

function addStagedCardFunctionality(playerObj, primaryIndex){
    playerObj.startIndex = Math.floor(primaryIndex / numScrollCards) * numScrollCards;
    playerObj.endIndex = playerObj.startIndex + (numScrollCards - 1);
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
    displayScrollCards(playerObj);
}

function createAndAppendStagedCard(playerObj, primaryIndex, cardData){
    var stageArea = document.getElementById(playerObj.stageAreaId);
    let stagedCard = createTradingCardWithId(cardData.primaryKey + playerObj.stagedCardName, cardData);
    stagedCard.onclick = function(){addStagedCardFunctionality(playerObj, primaryIndex)};
    stageArea.appendChild(stagedCard);
}

function addScrollCardFunctionality(playerObj, primaryIndex, cardData, scrollCard){
        if (cardData.isStaged == false){
            if(playerObj.stagedCardCount < 4){
                highlightCard(true, playerObj, scrollCard);
                createAndAppendStagedCard(playerObj, primaryIndex, cardData);
                cardData.isStaged = true;
                //stagedCardCount is a global variable
                playerObj.stagedCardCount += 1;
            }
        } else {
            highlightCard(false, playerObj, scrollCard);
            var stagedCard = document.getElementById(cardData.primaryKey + playerObj.stagedCardName);
            stagedCard.remove();
            cardData.isStaged = false;
            //stagedCardCount is a global variable
            playerObj.stagedCardCount -= 1;
        }
    };


function displayScrollCards(playerObj){
    // Clear out old card elements
    var cardSlots = document.getElementById(playerObj.cardSlots);
    while(cardSlots.firstChild){
        cardSlots.removeChild(cardSlots.firstChild);
    }
    for (let index = playerObj.startIndex; index <= playerObj.endIndex; index++){
        let primaryKey = playerObj.primaryKeyArr[index];
        let cardData = playerObj.cardDict[primaryKey];
        let scrollCard = createTradingCardWithId(primaryKey, cardData);
        scrollCard.onclick = function () {addScrollCardFunctionality(playerObj, index, cardData, scrollCard)};
        if (cardData.isStaged == true){
            highlightCard(true, playerObj, scrollCard);
        }else{
            highlightCard(false, playerObj, scrollCard);
        }
        cardSlots.appendChild(scrollCard);
    }
}

/* above are definitions
========================================================================================================================
below are hardcoded cards and the setup of event listeners */

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
let userObj = {primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", 
            stageAreaId: "userStageAreaId", stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard"};
let otherPlayerObj = {primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", 
            stageAreaId: "otherStageAreaId", stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard"};
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    let uniquePrimaryKey = cardData.primaryKey + index.toString()
    userObj.primaryKeyArr.push(uniquePrimaryKey);
    userObj.cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes);
    // now create other player's card set
    let otherRandomIndex = (randomIndex + 1) %  exampleCards.length;
    let otherCardData = exampleCards[otherRandomIndex];
    let otherUniquePrimaryKey = otherCardData.primaryKey + index.toString()
    otherPlayerObj.primaryKeyArr.push(otherUniquePrimaryKey);
    otherPlayerObj.cardDict[otherUniquePrimaryKey]= new Card(otherUniquePrimaryKey, otherCardData.cardName, otherCardData.image,
                otherCardData.description, otherCardData.cardType, otherCardData.attributes);
}


/*main code for tradeAndCollect */
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

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
otherScrollLeftButton.addEventListener("click", () => {
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


displayScrollCards(userObj);
var userScrollRightButton = document.getElementById("userScrollRight");
userScrollRightButton.addEventListener("click", () => {
    if (userObj.endIndex < userObj.primaryKeyArr.length - 1){
        userObj.startIndex = userObj.endIndex + 1;
        userObj.endIndex += numScrollCards;
        if (userObj.endIndex > userObj.primaryKeyArr.length - 1){
            userObj.endIndex = userObj.primaryKeyArr.length - 1
        }
        console.log(userObj.startIndex);
        console.log(userObj.endIndex);
        displayScrollCards(userObj);
    }
});

var userScrollLeftButton = document.getElementById("userScrollLeft");
userScrollLeftButton.addEventListener("click", () => {
    if (userObj.startIndex > 0){
        userObj.endIndex = userObj.startIndex - 1;
        userObj.startIndex -= numScrollCards;
        if(userObj.startIndex < 0){
            userObj.startIndex = 0;
        }
        console.log(userObj.startIndex);
        console.log(userObj.endIndex);
        displayScrollCards(userObj);
    }
});


/* trading code =============================================================================================== */
function getStagedCards(userObj, otherPlayerObj){
    let stagedCardsDict = {"otherStagedCardsArr": [], "userStagedCardsArr": []};
    var otherStageArea= document.getElementById(otherPlayerObj.stageAreaId);
    for(const otherStagedCard of otherStageArea.children){
        stagedCardsDict["otherStagedCardsArr"].push(otherStagedCard);
    }
    var userStageArea= document.getElementById(userObj.stageAreaId);
    for(const userStagedCard of userStageArea.children){
        stagedCardsDict["userStagedCardsArr"].push(userStagedCard);
    }
    return stagedCardsDict;
}

function createPopUpForm(userObj, otherPlayerObj, stagedCardsDict){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "block";
    // Clear out old card elements
    var otherPlayerTradeCardSlots = document.getElementById("otherPlayerTradeSlots");
    while(otherPlayerTradeCardSlots.firstChild){
        otherPlayerTradeCardSlots.removeChild(otherPlayerTradeCardSlots.firstChild);
    }
    // Clear out old card elements
    var userTradeCardSlots = document.getElementById("userTradeSlots");
    while(userTradeCardSlots.firstChild){
        userTradeCardSlots.removeChild(userTradeCardSlots.firstChild);
    }
    // move card element from stagedArea to pop up form
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    console.log(otherStagedCardsArr)
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        otherPlayerTradeSlots.appendChild(otherStagedCardsArr[index]);
    }
    // move card element from stagedArea to pop up form
    let userTradeSlots = document.getElementById("userTradeSlots");
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    console.log(userStagedCardsArr)
    for(let index = 0; index < userStagedCardsArr.length; index++){
        userTradeSlots.appendChild(userStagedCardsArr[index]);
    }
}

function simulateTrade(userObj, otherPlayerObj){
    let stagedCardsDict = getStagedCards(userObj, otherPlayerObj);
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        // remove isStaged status from cardObj and unhighlight its html card element
        let otherStagedCardId = otherStagedCardsArr[index].id;
        let otherPrimaryKey = otherStagedCardId.substring(0, otherStagedCardId.length - otherPlayerObj.stagedCardName.length);
        let otherStagedCardObj = otherPlayerObj.cardDict[otherPrimaryKey];
        otherStagedCardObj.isStaged = false;
        otherPlayerObj.stagedCardCount -= 1;
        var scrollCard = document.getElementById(otherPrimaryKey);
        highlightCard(false, otherPlayerObj, scrollCard);
    }
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for (let index = 0; index < userStagedCardsArr.length; index++) {
         // remove isStaged status from cardObj and unhighlight its html card element
        let userStagedCardId = userStagedCardsArr[index].id;
        let userPrimaryKey = userStagedCardId.substring(0, userStagedCardId.length - userObj.stagedCardName.length);
        let userStagedCardObj = userObj.cardDict[userPrimaryKey];
        userStagedCardObj.isStaged = false;
        userObj.stagedCardCount -= 1;
        var scrollCard = document.getElementById(userPrimaryKey);
        highlightCard(false, userObj, scrollCard);
    }
    createPopUpForm(userObj, otherPlayerObj, stagedCardsDict);
}


var startTradeButton = document.getElementById("startTradeButton");
startTradeButton.addEventListener("click", () => {
    simulateTrade(userObj, otherPlayerObj);
});

var acceptTradeButton= document.getElementById("acceptTradeButton");
acceptTradeButton.addEventListener("click", () => {
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
});

var declineTradeButton= document.getElementById("declineTradeButton");
declineTradeButton.addEventListener("click", () => {
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
});

var counterOfferTradeButton= document.getElementById("counterOfferTradeButton");
counterOfferTradeButton.addEventListener("click", () => {
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
});