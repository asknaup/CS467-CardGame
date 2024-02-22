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
    console.log(stagedCardsArr);
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


function addLeftScroll(playerObj, scrollLeftButton){
    scrollLeftButton.addEventListener("click", () => {
        if (playerObj.startIndex > 0){
            playerObj.endIndex = playerObj.startIndex - 1;
            playerObj.startIndex -= numScrollCards;
            if(playerObj.startIndex < 0){
                playerObj.startIndex = 0;
            }
            console.log(playerObj.startIndex);
            console.log(playerObj.endIndex);
            displayScrollCards(playerObj);
        }
    });
}


function addRightScroll(playerObj, scrollRightButton){
    scrollRightButton.addEventListener("click", () => {
        if (playerObj.endIndex < playerObj.primaryKeyArr.length - 1){
            playerObj.startIndex = playerObj.endIndex + 1;
            playerObj.endIndex += numScrollCards;
            if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
                playerObj.endIndex = playerObj.primaryKeyArr.length - 1
            }
            console.log(playerObj.startIndex);
            console.log(playerObj.endIndex);
            displayScrollCards(playerObj);
        }
    });
}

function createCardsForBothPlayers(exampleCards){
    for (let index = 0; index<=33; index++){
        let numCards = exampleCards.length;
        let randomIndex = Math.floor(Math.random() * numCards);
        let cardData = exampleCards[randomIndex];
        let uniquePrimaryKey = cardData.cardId + index.toString()
        userObj.primaryKeyArr.push(uniquePrimaryKey);
        userObj.cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.imagePath, cardData.cardType, 
            cardData.spellType, cardData.spellAbility, cardData.spellAttack, cardData.spellDefense, 
            cardData.attack, cardData.defense, cardData.manaCost);
        // now create other player's card set
        let otherRandomIndex = (randomIndex + 1) %  exampleCards.length;
        let otherCardData = exampleCards[otherRandomIndex];
        let otherUniquePrimaryKey = otherCardData.cardId + index.toString()
        otherPlayerObj.primaryKeyArr.push(otherUniquePrimaryKey);
        otherPlayerObj.cardDict[otherUniquePrimaryKey]= new Card(otherUniquePrimaryKey, otherCardData.cardName, otherCardData.imagePath, 
            otherCardData.cardType, otherCardData.spellType, otherCardData.spellAbility, otherCardData.spellAttack, otherCardData.spellDefense, 
            otherCardData.attack, otherCardData.defense, otherCardData.manaCost);   
    }
}

/*main code for trading */
var numScrollCards = 8;
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", 
            stageAreaId: "userStageAreaId", stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard"};
let otherPlayerObj = {isUser: false, primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", 
            stageAreaId: "otherStageAreaId", stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard"};

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
var otherScrollRightButton = document.getElementById("otherScrollRight");
var userScrollLeftButton = document.getElementById("userScrollLeft");
var userScrollRightButton = document.getElementById("userScrollRight");

async function setupTradingPage(){
    let exampleCards = []
    const response = await fetch('/cards');
    let collection = await response.json()
    Object.keys(collection).forEach(key => {exampleCards.push(collection[key])})
    console.log(exampleCards)
    createCardsForBothPlayers(exampleCards)
    displayScrollCards(otherPlayerObj);
    displayScrollCards(userObj);
    addRightScroll(otherPlayerObj, otherScrollRightButton)
    addRightScroll(userObj, userScrollRightButton)
    addLeftScroll(otherPlayerObj, otherScrollLeftButton)
    addLeftScroll(userObj, userScrollLeftButton)
}
setupTradingPage();


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
