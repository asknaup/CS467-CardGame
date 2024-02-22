class Card{
    constructor(primaryKey, cardName, imagePath, cardType, 
        spellType, spellAbility, spellAttack, spellDefense, attack, defense, manaCost){
        this.cardId = primaryKey;
        this.cardName = cardName;
        this.imagePath = imagePath;
        this.cardType = cardType;
        this.description = "";
        this.rarity = 0;
        this.spellType = spellType;
        this.specialAbility = spellAbility;
        this.spellAttack = spellAttack;
        this.spellDefense = spellDefense;
        this.attack = attack;
        this.defense = defense;
        this.manaCost = manaCost;
        this.isStaged = false;
    }
}



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

function removeOldCardsFromPopUpForm(){
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
}

function createPopUpForm(stagedCardsDict){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "block";
    removeOldCardsFromPopUpForm();
    /* NOTE: the cards from otherStageArea get moved to userTradeSlots in the
        pop up form because this pop up form is on other player's computer
    */
    let userTradeSlots = document.getElementById("userTradeSlots");
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        userTradeSlots.appendChild(otherStagedCardsArr[index]);
    }
    /* NOTE: the cards from userStageArea get moved to otherPlayerTradeSlots in the
        pop up form because this pop up form is on other player's computer
    */
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for(let index = 0; index < userStagedCardsArr.length; index++){
        otherPlayerTradeSlots.appendChild(userStagedCardsArr[index]);
    }
}


function removeIsStagedStatusAndItsEffects(playerObj, index, stagedCardsArr){
    // remove isStaged status from cardObj and unhighlight its html card element
    let stagedCardId = stagedCardsArr[index].id;
    // now with primary key we can access both the stagedCardObj and stagedCard document element
    let primaryKey = stagedCardId.substring(0, stagedCardId.length - playerObj.stagedCardName.length);
    let scrollCardObj = playerObj.cardDict[primaryKey];
    scrollCardObj.isStaged = false;
    playerObj.stagedCardCount -= 1;
    var scrollCard = document.getElementById(primaryKey);
    highlightCard(false, playerObj.isUser, scrollCard);
}


function simulateTrade(userObj, otherPlayerObj){
    let stagedCardsDict = getStagedCards(userObj, otherPlayerObj);
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(otherPlayerObj, index, otherStagedCardsArr);
    }
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for (let index = 0; index < userStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(userObj, index, userStagedCardsArr);
    }
    createPopUpForm(stagedCardsDict);
}


/* above are function definitions
========================================================================================================================
below are hardcoded cards  */

var numScrollCards = 8;
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", 
            stageAreaId: "userStageAreaId", stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard"};
let otherPlayerObj = {isUser: false, primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", 
            stageAreaId: "otherStageAreaId", stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard"};


/* Create Example Dummy Cards */
// Example cards data (you can add more)
var exampleCards = [
    {cardId: "goblin", cardName: "Goblin", imagePath: '/images/goblin-willow-tree.jpg', 
    cardType:'Creature', spellType: "", spellAbility: "", spellAttack: "", spellDefense: "",
    attack:50, defense:30, manaCost:5},
    {cardId: "wizard", cardName: 'Fire Ball Scroll', imagePath: '/images/dark-wizard.png',  
    cardType: 'Spell', spellType: "", spellAbility: "", spellAttack: "", spellDefense: "",
    attack:60, defense:20, manaCost:7},
    {cardId: "iceDragon", cardName: 'Ice Dragon', imagePath: '/images/ice-dragon.png', 
    cardType: 'Creature', spellType: "", spellAbility: "", spellAttack: "", spellDefense: "",
    attack:100, defense:80,  manaCost:9}
    // Add more cards as needed
];

/* populate the players' card dictionaries with card objs */
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    let uniquePrimaryKey = cardData.primaryKey + index.toString()
    userObj.primaryKeyArr.push(uniquePrimaryKey);
    userObj.cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.imagePath, cardData.cardType, 
        cardData.spellType, cardData.spellAbility, cardData.spellAttack, cardData.spellDefense, 
        cardData.attack, cardData.defense, cardData.manaCost);
    // now create other player's card set
    let otherRandomIndex = (randomIndex + 1) %  exampleCards.length;
    let otherCardData = exampleCards[otherRandomIndex];
    let otherUniquePrimaryKey = otherCardData.primaryKey + index.toString()
    otherPlayerObj.primaryKeyArr.push(otherUniquePrimaryKey);
    otherPlayerObj.cardDict[otherUniquePrimaryKey]= new Card(otherUniquePrimaryKey, otherCardData.cardName, otherCardData.imagePath, 
        otherCardData.cardType, otherCardData.spellType, otherCardData.spellAbility, otherCardData.spellAttack, otherCardData.spellDefense, 
        otherCardData.attack, otherCardData.defense, otherCardData.manaCost);
        
}

/* above are hardcoded cards
========================================================================================================================
below is the setup of event listeners and the code that executes for this file  */

/*main code for trading */
displayScrollCards(otherPlayerObj);
displayScrollCards(userObj);


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