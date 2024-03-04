class Card{
    constructor(cardId, cardName, imagePath, description, type, rarity,
         attack, defense, mana){
        this.cardId = cardId;
        this.cardName = cardName;
        this.imagePath = imagePath;
        this.type = type;
        this.description = description;
        this.rarity = rarity;
        this.attack = attack;
        this.defense = defense;
        this.mana = mana;
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
            displayCardCollectionForTrading(playerObj);
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
            displayCardCollectionForTrading(playerObj);
        }
    });
}


async function collectionSelectHandler(collectionSelect){
    var userLoadingTitle = document.getElementById("userLoadingTitle");
    userLoadingTitle.style.display = "block";
    var otherLoadingTitle = document.getElementById("otherLoadingTitle");
    otherLoadingTitle.style.display = "block";
    let collectionKey = parseInt(collectionSelect.value);
    console.log(collectionKey);
    await switchToGivenCollection(collectionKey, userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollectionForTrading(userObj);
    userLoadingTitle.style.display = "none";
    otherLoadingTitle.style.display = "none";
}


async function switchToGivenCollection(collectionKey, userObj){
    if(!(collectionKey in userObj.collections)){
        let cardList = userObj.cardListsFromDb[collectionKey];
        let listOfCardObjs = cardList.cardList;
        userObj.primaryKeysForCollections[collectionKey] = [];
        userObj.collections[collectionKey] = {};
        for(const cardId of  listOfCardObjs){
            const cardDetailsResponse = await fetch('/getCardDetails?cardId=' + cardId);
            await cardDetailsResponse.json()
                .then((cardData) => {
                        userObj.primaryKeysForCollections[collectionKey].push(cardData.id);
                        //(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana)
                        let cardObj = new Card(cardData.id, cardData.cardName, cardData.imagePath, 
                            cardData.description, cardData.type, cardData.rarity, cardData.attack, cardData.defense, cardData.mana); 
                        userObj.collections[collectionKey][cardData.id] = cardObj;
                })
                .catch((error) => {console.log(error)});  
        }
    }
    userObj.primaryKeyArr = userObj.primaryKeysForCollections[collectionKey];
    userObj.cardDict = userObj.collections[collectionKey];
}


function resetInitialStartAndEndIndex(userObj){
    userObj.startIndex = 0;
    userObj.endIndex = numScrollCards- 1;
    if (userObj.endIndex > userObj.primaryKeyArr.length - 1){
        userObj.endIndex = userObj.primaryKeyArr.length - 1
    }
}


async function getCollection(userObj){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    for(let index = 0; index < collection.length; index++){
        let currCollectId = collection[index].collectionId
        userObj.cardListsFromDb[currCollectId] = JSON.parse(collection[index].cardId);
    }
    let collectionId = null;
    if(collection.length > 0){
        collectionId = collection[0].collectionId
        userObj.primaryKeysForCollections[collectionId] = [];
        userObj.collections[collectionId] = {};
        let cardList = userObj.cardListsFromDb[collectionId];
        let listOfCardObjs = cardList.cardList;
        for(const cardId of  listOfCardObjs){
            const cardDetailsResponse = await fetch('/getCardDetails?cardId=' + cardId);
            await cardDetailsResponse.json()
                .then((cardData) => {
                        userObj.primaryKeysForCollections[collectionId].push(cardData.id);
                        //(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana)
                        let cardObj = new Card(cardData.id, cardData.cardName, cardData.imagePath, 
                            cardData.description, cardData.type, cardData.rarity, cardData.attack, cardData.defense, cardData.mana); 
                        userObj.collections[collectionId][cardData.id] = cardObj;
                })
                .catch((error) => {console.log(error)});  
        }
    }
    userObj.primaryKeyArr = userObj.primaryKeysForCollections[collectionId];
    userObj.cardDict = userObj.collections[collectionId];
}


async function setupTradingPage(){
    var userLoadingTitle = document.getElementById("userLoadingTitle");
    userLoadingTitle.style.display = "block";
    var otherLoadingTitle = document.getElementById("otherLoadingTitle");
    otherLoadingTitle.style.display = "block";
    await getCollection(userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollectionForTrading(userObj);
    addRightScroll(userObj, userScrollRightButton);
    addLeftScroll(userObj, userScrollLeftButton);
    userLoadingTitle.style.display = "none";
    otherLoadingTitle.style.display = "none";
}


/*main code for trading */
var numScrollCards = 8;
let userObj = {isUser: true,primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},  primaryKeyArr: [], cardDict: {}, 
                stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", stageAreaId: "userStageAreaId", 
                stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard"};
                 
let otherPlayerObj = {isUser: false, primaryKeyArr: [], cardDict: {}, stagedCardCount: 0, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", 
            stageAreaId: "otherStageAreaId", stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard"};

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
var otherScrollRightButton = document.getElementById("otherScrollRight");
var userScrollLeftButton = document.getElementById("userScrollLeft");
var userScrollRightButton = document.getElementById("userScrollRight");
setupTradingPage(); 

var collectionSelect = document.getElementById("tradingCollectId");
collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect) });

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
