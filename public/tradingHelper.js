function getPopUpCards(){
    let popUpCardsDict = {"otherPopUpCardsArr": [], "userPopUpCardsArr": []};
    var otherPlayerTradeSlots= document.getElementById("otherPlayerTradeSlots");
    for(const otherPopUpCard of otherPlayerTradeSlots.children){
        //console.log(otherStagedCard)
        popUpCardsDict["otherPopUpCardsArr"].push(otherPopUpCard);
    }
    var userTradeSlots = document.getElementById("userTradeSlots");
    for(const userPopUpCard of userTradeSlots.children){
        //console.log(userStagedCard)
        popUpCardsDict["userPopUpCardsArr"].push(userPopUpCard);
    }
    return popUpCardsDict;
}


function getStagedCards(){
    let stagedCardsDict = {"otherStagedCardsArr": [], "userStagedCardsArr": []};
    var otherStageArea= document.getElementById("otherStageAreaId");
    for(const otherStagedCard of otherStageArea.children){
        //console.log(otherStagedCard)
        stagedCardsDict["otherStagedCardsArr"].push(otherStagedCard);
    }
    var userStageArea= document.getElementById("userStageAreaId");
    for(const userStagedCard of userStageArea.children){
        //console.log(userStagedCard)
        stagedCardsDict["userStagedCardsArr"].push(userStagedCard);
    }
    return stagedCardsDict;
}


function removeIsStagedStatusAndItsEffects(playerObj, index, stagedCardsArr){
    // remove isStaged status from cardObj and unhighlight its html card element
    let stagedCardId = stagedCardsArr[index].id;
    // now with primary key we can access both the stagedCardObj and stagedCard document element
    let primaryKey = stagedCardId.substring(0, stagedCardId.length - playerObj.stagedCardName.length);
    let cardObj = playerObj.currCollection[primaryKey];
    cardObj.isStaged = false;
    playerObj.stagedCardCount -= 1;
}


function removeStagedStatusFromPopUpCards(userObj, otherPlayerObj){
    let popUpCardsDict = getPopUpCards();
    otherPopUpCardsArr = popUpCardsDict["otherPopUpCardsArr"];
    for (let index = 0; index < otherPopUpCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(otherPlayerObj, index, otherPopUpCardsArr);
    }
    userPopUpCardsArr = popUpCardsDict["userPopUpCardsArr"];
    for (let index = 0; index < userPopUpCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(userObj, index, userPopUpCardsArr);
    }
}


function removeStagedStatusFromStagedCards(userObj, otherPlayerObj){
    let stagedCardsDict = getStagedCards();
    otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(otherPlayerObj, index, otherStagedCardsArr);
    }
    userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for (let index = 0; index < userStagedCardsArr.length; index++) {
        removeIsStagedStatusAndItsEffects(userObj, index, userStagedCardsArr);
    }
}


function removePopUpCards(userObj, otherPlayerObj){
    removeStagedStatusFromPopUpCards(userObj, otherPlayerObj)
    var otherPlayerTradeSlots= document.getElementById("otherPlayerTradeSlots");
    while(otherPlayerTradeSlots.firstChild){
        otherPlayerTradeSlots.removeChild(otherPlayerTradeSlots.firstChild);
    }
    var userTradeSlots= document.getElementById("userTradeSlots");
    while(userTradeSlots.firstChild){
        userTradeSlots.removeChild(userTradeSlots.firstChild);
    }
}


function removeStagedCards(userObj, otherPlayerObj){
    removeStagedStatusFromStagedCards(userObj, otherPlayerObj)
    var otherStageArea= document.getElementById("otherStageAreaId");
    while(otherStageArea.firstChild){
        otherStageArea.removeChild(otherStageArea.firstChild);
    }
    var userStageArea= document.getElementById("userStageAreaId");
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
        otherPlayerObj.primaryKeys[otherPlayerObj.currCollectId] = [];
        otherPlayerObj.collections[otherPlayerObj.currCollectId] = {};
        const adminCardsResponse = await fetch('/getAdminCardsForTrading?collectId=' + otherPlayerObj.currCollectId);
        let adminCardList = await adminCardsResponse.json()
        await createCollectionFromCardIdList(adminCardList, otherPlayerObj);
    }
    otherPlayerObj.currPrimaryKeysArr = otherPlayerObj.primaryKeys[otherPlayerObj.currCollectId];
    otherPlayerObj.currCollection = otherPlayerObj.collections[otherPlayerObj.currCollectId];
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


function usersCombinedManaIsLessThanMarkets(){
    let stagedCardsDict = getStagedCards();
    let otherStagedCards = stagedCardsDict["otherStagedCardsArr"]
    let combinedMarketMana = 0;
    for(const otherStagedCard of otherStagedCards){
        let otherStagedCardId  = otherStagedCard.id
        let otherCardId = otherStagedCardId.substring(0, otherStagedCardId.length - otherPlayerObj.stagedCardName.length);
        let currCardObj = otherPlayerObj.currCollection[otherCardId]
        if(currCardObj.mana !== undefined){
            combinedMarketMana += currCardObj.mana
        }
    }
    let userStagedCards = stagedCardsDict["userStagedCardsArr"]
    let combinedUserMana = 0;
    for(const userStagedCard of userStagedCards){
        let userStagedCardId  = userStagedCard.id
        let userCardId = userStagedCardId.substring(0, userStagedCardId.length - userObj.stagedCardName.length);
        let currCardObj = userObj.currCollection[userCardId]
        if(currCardObj.mana !== undefined){
            combinedUserMana += currCardObj.mana
        }
    }
    return (combinedMarketMana > combinedUserMana);
}


function tradeButtonActions(){
    if(userObj.stagedCardCount == 0 || otherPlayerObj.stagedCardCount == 0){
        alert("Each staging area needs at least one card before you can make a trade");
    }else if(usersCombinedManaIsLessThanMarkets()){
        alert("The combined mana of the user's cards can't be less than the combined mana of the market's cards")
    }else{
        let tradePopUpForm = document.getElementById("tradePopUpForm");
        tradePopUpForm.style.display = "block";
        removeOldCardsFromPopUpForm();
        // move otherPlayer's cards from stage area to pop up forms
        let otherPlayerStageArea = document.getElementById("otherStageAreaId");
        let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
        while(otherPlayerStageArea.firstChild) {
            otherPlayerTradeSlots.appendChild(otherPlayerStageArea.firstChild);
        }
        // move user's cards from stage area to pop up forms
        let userStageArea = document.getElementById("userStageAreaId");
        let userTradeSlots = document.getElementById("userTradeSlots");
        while(userStageArea.firstChild){
            userTradeSlots.appendChild(userStageArea.firstChild);
        }
    }
}


function stopTradeButtonActions(){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
    // move other player's cards back to stage area from the popup form
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let otherPlayerStageArea = document.getElementById("otherStageAreaId");
    while(otherPlayerTradeSlots.firstChild) {
        otherPlayerStageArea.appendChild(otherPlayerTradeSlots.firstChild);
    }
    // move user's cards back to stage area from the popup form
    let userTradeSlots = document.getElementById("userTradeSlots");
    let userStageArea = document.getElementById("userStageAreaId");
    while(userTradeSlots.firstChild){
        userStageArea.appendChild(userTradeSlots.firstChild);
    }
}


function getCardsToBeTraded(userObj, otherPlayerObj){
    let otherCardsToBeTraded = [];
    var otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots")
    for(const otherStagedCard of otherPlayerTradeSlots.children){
        let otherStagedCardId  = otherStagedCard.id
        let otherCardId = otherStagedCardId.substring(0, otherStagedCardId.length - otherPlayerObj.stagedCardName.length);
        otherCardsToBeTraded.push(parseInt(otherCardId));
    }
    otherPlayerObj.cardsToBeTraded = otherCardsToBeTraded;
    let userCardsToBeTraded = [];
    var userTradeSlots = document.getElementById("userTradeSlots");
    for(const userStagedCard of userTradeSlots.children){
        let userStagedCardId  = userStagedCard.id
        let userCardId = userStagedCardId.substring(0, userStagedCardId.length - userObj.stagedCardName.length);
        userCardsToBeTraded.push(parseInt(userCardId))
    }
    userObj.cardsToBeTraded = userCardsToBeTraded;
}


function getUpdatedUserCollection(userObj, otherPlayerObj){
    getCardsToBeTraded(userObj, otherPlayerObj)
    let updatedUserCollection = []
    let currPrimaryKeys = userObj.primaryKeys[userObj.currCollectId];
    for(let index = 0; index < currPrimaryKeys.length; index++){
        let currCardId = currPrimaryKeys[index]
        if(userObj.cardsToBeTraded.includes(currCardId) === false){
            updatedUserCollection.push(currCardId)
        }
    }

    for(let index = 0; index < otherPlayerObj.cardsToBeTraded.length; index++){
        let currCardId = otherPlayerObj.cardsToBeTraded[index]
        updatedUserCollection.push(currCardId);
    }
    return updatedUserCollection
}


async function makePostRequestAndRefresh(updatedUserCollection, userObj){
    objectForTradePostRequest = {};
    objectForTradePostRequest[userObj.currCollectId] = updatedUserCollection;
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(objectForTradePostRequest)
    }
    await fetch('/trading', options);
    const response = await fetch('/getCollection');
    let collection = await response.json();
    await updateAndDisplayUserCollection(collection, userObj, otherPlayerObj);
}


async function confirmTradeButtonActions(){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "none";
    //console.log(updatedCollectionAfterTrading)
    let updatedUserCollection = getUpdatedUserCollection(userObj, otherPlayerObj)
    makePostRequestAndRefresh(updatedUserCollection, userObj);
    removePopUpCards(userObj, otherPlayerObj);
    refreshDisplays(userObj, otherPlayerObj);
}


async function setupTradingPage(){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    if(collection.length > 0){ 
        userObj.currCollectId = collection[0].collectionId;
        otherPlayerObj.currCollectId = collection[0].collectionId;
        console.log(collection[0])
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
    startTradeButton.addEventListener("click", () => { tradeButtonActions(); });
    confirmTradeButton.addEventListener("click", () => { confirmTradeButtonActions(); });
    stopTradeButton.addEventListener("click", () => { stopTradeButtonActions(); });
}


/*main code for trading */
let objectForTradePostRequest = {}
let userObj = {fileName: "tradingHelper", isUser: true, cardListsFromDb: {}, primaryKeys: {}, collections: {}, currPrimaryKeysArr: [], 
    currCollection: {}, stagedCardCount: 0, numCardsInView: 7, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", stagedCardName: "userStagedCard", 
    stageAreaId: "userStageAreaId", currCollectId: null, cardsToBeTraded: []
};        
let otherPlayerObj = {fileName: "tradingHelper", isUser: false, cardListsFromDb: {}, primaryKeys: {}, collections: {}, currPrimaryKeysArr: [], 
    currCollection: {}, stagedCardCount: 0, numCardsInView: 7, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", stagedCardName: "otherStagedCard", 
    stageAreaId: "otherStageAreaId", currCollectId: null, cardsToBeTraded: []
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