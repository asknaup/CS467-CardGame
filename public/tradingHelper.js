function getStagedCards(userObj, otherPlayerObj){
    let stagedCardsDict = {"otherStagedCardsArr": [], "userStagedCardsArr": []};
    var otherStageArea= document.getElementById(otherPlayerObj.currLocationStagedCards);
    for(const otherStagedCard of otherStageArea.children){
        stagedCardsDict["otherStagedCardsArr"].push(otherStagedCard);
    }
    var userStageArea= document.getElementById(userObj.currLocationStagedCards);
    for(const userStagedCard of userStageArea.children){
        stagedCardsDict["userStagedCardsArr"].push(userStagedCard);
    }
    return stagedCardsDict;
}

function removeIsStagedStatusAndItsEffects(playerObj, index, stagedCardsArr){
    // remove isStaged status from cardObj and unhighlight its html card element
    let stagedCardId = stagedCardsArr[index].id;
    // now with primary key we can access both the stagedCardObj and stagedCard document element
    let primaryKey = stagedCardId.substring(0, stagedCardId.length - playerObj.stagedCardName.length);
    let cardObj = playerObj.cardDict[primaryKey];
    cardObj.isStaged = false;
    playerObj.stagedCardCount -= 1;
    var scrollCard = document.getElementById(primaryKey);
    highlightCard(false, playerObj.isUser, scrollCard);
}


function removeStagedStatusFromStagedCards(userObj, otherPlayerObj){
    let stagedCardsDict = getStagedCards(userObj, otherPlayerObj);
    otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(otherPlayerObj, index, otherStagedCardsArr);
    }
    userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for (let index = 0; index < userStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(userObj, index, userStagedCardsArr);
    }
}


function removeStagedCards(userObj, otherPlayerObj){
    removeStagedStatusFromStagedCards(userObj, otherPlayerObj)
    var otherStageArea= document.getElementById(otherPlayerObj.currLocationStagedCards);
    while(otherStageArea.firstChild){
        otherStageArea.removeChild(otherStageArea.firstChild);
    }
    var userStageArea= document.getElementById(userObj.currLocationStagedCards);
    while(userStageArea.firstChild){
        userStageArea.removeChild(userStageArea.firstChild);
    }
}


async function collectionSelectHandler(collectionSelect, userObj, otherPlayerObj){
    removeStagedCards(userObj, otherPlayerObj);
    let collectionKey = parseInt(collectionSelect.value);
    userObj.currCollectId = collectionKey;
    var userLoadingTitle = document.getElementById("userLoadingTitle");
    userLoadingTitle.style.display = "block";
    await switchToGivenUserCollection(userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollectionForTrading(userObj);
    userLoadingTitle.style.display = "none";
    otherPlayerObj.currCollectId = collectionKey;
    var otherLoadingTitle = document.getElementById("otherLoadingTitle");
    otherLoadingTitle.style.display = "block";
    await getCurrentAdminCollection(otherPlayerObj);
    resetInitialStartAndEndIndex(otherPlayerObj);
    displayCardCollectionForTrading(otherPlayerObj);
    otherLoadingTitle.style.display = "none";
}


async function getCurrentAdminCollection(otherPlayerObj){
    if(!(otherPlayerObj.currCollectId in otherPlayerObj.collections)){
        otherPlayerObj.primaryKeysForCollections[otherPlayerObj.currCollectId] = [];
        otherPlayerObj.collections[otherPlayerObj.currCollectId] = {};
        const adminCardsResponse = await fetch('/getAdminCardsForTrading?collectId=' + otherPlayerObj.currCollectId);
        let adminCardList = await adminCardsResponse.json()
        await createCollectionFromCardIdList(adminCardList, otherPlayerObj);
    }
    otherPlayerObj.primaryKeyArr = otherPlayerObj.primaryKeysForCollections[otherPlayerObj.currCollectId];
    otherPlayerObj.cardDict = otherPlayerObj.collections[otherPlayerObj.currCollectId];
}


function removeOldCardsFromPopUpForm(){
    // Clear out old card elements
    var otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    while(otherPlayerTradeSlots.firstChild){
        otherPlayerTradeSlots.removeChild(otherPlayerTradeSlots.firstChild);
    }
    // Clear out old card elements
    var userTradeSlots = document.getElementById("userTradeSlots");
    while(userTradeSlots.firstChild){
        userTradeSlots.removeChild(userTradeSlots.firstChild);
    }
}


function tradeButtonActions(userObj, otherPlayerObj){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "block";
    removeOldCardsFromPopUpForm();
    // move otherPlayer's cards from stage area to pop up forms
    let stagedCardsDict = getStagedCards(userObj, otherPlayerObj);
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        otherPlayerTradeSlots.appendChild(otherStagedCardsArr[index]);
    }
    otherPlayerObj.currLocationStagedCards = "otherPlayerTradeSlots";
    // move user's cards from stage area to pop up forms
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    let userTradeSlots = document.getElementById("userTradeSlots");
    for(let index = 0; index < userStagedCardsArr.length; index++){
        userTradeSlots.appendChild(userStagedCardsArr[index]);
    }
    userObj.currLocationStagedCards = "userTradeSlots";
}


function stopTradeButtonActions(userObj, otherPlayerObj){
    // move other player's cards back to stage area from the popup form
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let otherPlayerStageArea = document.getElementById(otherPlayerObj.stageAreaId);
    while(otherPlayerTradeSlots.firstChild) {
        otherPlayerStageArea.appendChild(otherPlayerTradeSlots.firstChild);
    }
    otherPlayerObj.currLocationStagedCards = otherPlayerObj.stageAreaId;
    // move user's cards back to stage area from the popup form
    let userTradeSlots = document.getElementById("userTradeSlots");
    let userStageArea = document.getElementById(userObj.stageAreaId);
    while(userTradeSlots.firstChild){
        userStageArea.appendChild(userTradeSlots.firstChild);
    }
    userObj.currLocationStagedCards = userObj.stageAreaId;
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
}


function getCardsToBeTraded(userObj, otherPlayerObj){
    otherPlayerObj.cardsToBeTraded = [];
    userObj.cardsToBeTraded = [];
    var otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots")
    for(const otherStagedCard of otherPlayerTradeSlots.children){
        let otherStagedCardId  = otherStagedCard.id
        let otherCardId = otherStagedCardId.substring(0, otherStagedCardId.length - otherPlayerObj.stagedCardName.length);
        otherPlayerObj.cardsToBeTraded.push(otherCardId);
    }
    var userTradeSlots = document.getElementById("userTradeSlots");
    for(const userStagedCard of userTradeSlots.children){
        let userStagedCardId  = userStagedCard.id
        let userCardId = userStagedCardId.substring(0, userStagedCardId.length - userObj.stagedCardName.length);
        userObj.cardsToBeTraded.push(userCardId)
    }
}


async function tradePostRequest(){
    let data = {'hello': 'world'};
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    await fetch('/trading', options);
}

async function confirmTradeButtonActions(){
    let updatedCollectionAfterTrading = []
    let primaryKeysForCurrCollection = userObj.primaryKeysForCollections[userObj.currCollectId];
    getCardsToBeTraded(userObj, otherPlayerObj)
    for(let index = 0; index < primaryKeysForCurrCollection.length; index++){
        let currCardId = primaryKeysForCurrCollection[index]
        if(!(userObj.cardsToBeTraded.includes(currCardId))){
            updatedCollectionAfterTrading.push(currCardId)
        }
    }
    for(let index = 0; index < otherPlayerObj.cardsToBeTraded.length; index++){
        updatedCollectionAfterTrading.push(otherPlayerObj.cardsToBeTraded[index])
    }
    objectForTradePostRequest = {};
    objectForTradePostRequest[userObj.currCollectId] = updatedCollectionAfterTrading;
    removeStagedCards(userObj, otherPlayerObj);
    //await tradePostRequest();
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
}


async function setupTradingPage(){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    if(collection.length > 0){ 
        userObj.currCollectId = collection[0].collectionId;
        otherPlayerObj.currCollectId = collection[0].collectionId;
    };
    var userLoadingTitle = document.getElementById("userLoadingTitle");
    userLoadingTitle.style.display = "block";
    await getInitialUserCollection(collection, userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollectionForTrading(userObj);
    addRightScroll(userObj, userScrollRightButton, displayCardCollectionForTrading);
    addLeftScroll(userObj, userScrollLeftButton, displayCardCollectionForTrading);
    userLoadingTitle.style.display = "none";
    var otherLoadingTitle = document.getElementById("otherLoadingTitle");
    otherLoadingTitle.style.display = "block";
    await getCurrentAdminCollection(otherPlayerObj)
    resetInitialStartAndEndIndex(otherPlayerObj);
    displayCardCollectionForTrading(otherPlayerObj);
    addRightScroll(otherPlayerObj, otherScrollRightButton, displayCardCollectionForTrading);
    addLeftScroll(otherPlayerObj, otherScrollLeftButton, displayCardCollectionForTrading);
    otherLoadingTitle.style.display = "none";
    //setup event listeners
    collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect, userObj, otherPlayerObj) });
    startTradeButton.addEventListener("click", () => { tradeButtonActions(userObj, otherPlayerObj); });
    confirmTradeButton.addEventListener("click", () => { confirmTradeButtonActions(); });
    stopTradeButton.addEventListener("click", () => { stopTradeButtonActions(userObj, otherPlayerObj); });
}


/*main code for trading */
let objectForTradePostRequest = {}
let userObj = {fileName: "tradingHelper", isUser: true, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},  primaryKeyArr: [], 
    cardDict: {}, stagedCardCount: 0, numCardsInView: 8, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", stageAreaId: "userStageAreaId", 
    stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard", currLocationStagedCards: "userStageAreaId", currCollectId: null, 
    cardsToBeTraded: []
};
                 
let otherPlayerObj = {fileName: "tradingHelper", isUser: false, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},  primaryKeyArr: [], 
    cardDict: {}, stagedCardCount: 0, numCardsInView: 8, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", stageAreaId: "otherStageAreaId", 
    stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard", currLocationStagedCards: "otherStageAreaId", currCollectId: null, 
    cardsToBeTraded: []
};

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
var otherScrollRightButton = document.getElementById("otherScrollRight");
var userScrollLeftButton = document.getElementById("userScrollLeft");
var userScrollRightButton = document.getElementById("userScrollRight");
var collectionSelect = document.getElementById("tradingCollectId");
var startTradeButton = document.getElementById("startTradeButton");
var confirmTradeButton= document.getElementById("confirmTradeButton");
var stopTradeButton= document.getElementById("stopTradeButton");

setupTradingPage();