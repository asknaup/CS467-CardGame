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
    var userLoadingTitle = document.getElementById("userLoadingTitle");
    userLoadingTitle.style.display = "block";
    var otherLoadingTitle = document.getElementById("otherLoadingTitle");
    otherLoadingTitle.style.display = "block";
    let collectionKey = parseInt(collectionSelect.value);
    userObj.currCollectId = collectionKey;
    cardsToBeTraded.userCollectId = collectionKey;
    otherPlayerObj.currCollectId = collectionKey;
    cardsToBeTraded.otherPlayerCollectId = collectionKey;
    await switchToGivenUserCollection(userObj);
    await getCurrentAdminCollection(otherPlayerObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollectionForTrading(userObj);
    resetInitialStartAndEndIndex(otherPlayerObj);
    displayCardCollectionForTrading(otherPlayerObj);
    userLoadingTitle.style.display = "none";
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


function getCardsToBeTraded(userObj, otherPlayerObj){
    cardsToBeTraded.otherPlayerCardsToBeTraded = [];
    cardsToBeTraded.userCardsToBeTraded = [];
    var otherStageArea= document.getElementById(otherPlayerObj.stageAreaId);
    for(const otherStagedCard of otherStageArea.children){
        let otherStagedCardId  = otherStagedCard.id
        let otherCardId = otherStagedCardId.substring(0, otherStagedCardId.length - otherPlayerObj.stagedCardName.length);
        cardsToBeTraded.otherPlayerCardsToBeTraded.push(otherCardId);
    }
    var userStageArea= document.getElementById(userObj.stageAreaId);
    for(const userStagedCard of userStageArea.children){
        let userStagedCardId  = userStagedCard.id
        let userCardId = userStagedCardId.substring(0, userStagedCardId.length - userObj.stagedCardName.length);
        cardsToBeTraded.userCardsToBeTraded.push(userCardId)
    }
    console.log(cardsToBeTraded)
}

function createPopUpForm(stagedCardsDict){
    let tradePopUpForm = document.getElementById("tradePopUpForm");
    tradePopUpForm.style.display = "block";
    removeOldCardsFromPopUpForm();
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let otherStagedCardsArr = stagedCardsDict["otherStagedCardsArr"];
    for (let index = 0; index < otherStagedCardsArr.length; index++) {
        otherPlayerTradeSlots.appendChild(otherStagedCardsArr[index]);
    }
    let userTradeSlots = document.getElementById("userTradeSlots");
    let userStagedCardsArr = stagedCardsDict["userStagedCardsArr"];
    for(let index = 0; index < userStagedCardsArr.length; index++){
        userTradeSlots.appendChild(userStagedCardsArr[index]);
    }
    otherPlayerObj.currLocationStagedCards = "otherPlayerTradeSlots";
    userObj.currLocationStagedCards = "userTradeSlots";
}

function stopTradeButtonActions(userObj, otherPlayerObj){
    let otherPlayerTradeSlots = document.getElementById("otherPlayerTradeSlots");
    let otherPlayerStageArea = document.getElementById(otherPlayerObj.stageAreaId);
    while(otherPlayerTradeSlots.firstChild) {
        otherPlayerStageArea.appendChild(otherPlayerTradeSlots.firstChild);
    }
    let userTradeSlots = document.getElementById("userTradeSlots");
    let userStageArea = document.getElementById(userObj.stageAreaId);
    while(userTradeSlots.firstChild){
        userStageArea.appendChild(userTradeSlots.firstChild);
    }
    otherPlayerObj.currLocationStagedCards = otherPlayerObj.stageAreaId;
    userObj.currLocationStagedCards = userObj.stageAreaId;
}

function tradeButtonActions(userObj, otherPlayerObj){
    getCardsToBeTraded(userObj, otherPlayerObj)
    let stagedCardsDict = getStagedCards(userObj, otherPlayerObj);
    createPopUpForm(stagedCardsDict);
}

function confirmTradeButtonActions(){
    removeStagedCards(userObj, otherPlayerObj);
}

async function setupTradingPage(){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    if(collection.length > 0){ 
        userObj.currCollectId = collection[0].collectionId;
        cardsToBeTraded.userCollectId =  collection[0].collectionId;
        otherPlayerObj.currCollectId = collection[0].collectionId;
        cardsToBeTraded.otherPlayerCollectId = collection[0].collectionId;;
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
    collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect, userObj, otherPlayerObj) });
    startTradeButton.addEventListener("click", () => { tradeButtonActions(userObj, otherPlayerObj);});
    confirmTradeButton.addEventListener("click", () => {
        let tradePopUpForm = document.getElementById("tradePopUpForm");
        tradePopUpForm.style.display = "none";
    });
    stopTradeButton.addEventListener("click", () => {
        stopTradeButtonActions(userObj, otherPlayerObj);
        let tradePopUpForm = document.getElementById("tradePopUpForm");
        tradePopUpForm.style.display = "none";
    });
}


/*main code for trading */
let cardsToBeTraded = {otherPlayerCollectId: null, otherPlayerCardsToBeTraded: [], userCollectId: null, userCardsToBeTraded: []};
let userObj = {fileName: "tradingHelper", isUser: true, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},  primaryKeyArr: [], 
    cardDict: {}, stagedCardCount: 0, numCardsInView: 8, startIndex: 0, endIndex: 7, cardSlots: "userCardSlots", stageAreaId: "userStageAreaId", 
    stageAreaClass: "userStageAreaClass", stagedCardName: "userStagedCard", currLocationStagedCards: "userStageAreaId", currCollectId: null};
                 
let otherPlayerObj = {fileName: "tradingHelper", isUser: false, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},  primaryKeyArr: [], 
    cardDict: {}, stagedCardCount: 0, numCardsInView: 8, startIndex: 0, endIndex: 7, cardSlots: "otherCardSlots", stageAreaId: "otherStageAreaId", 
    stageAreaClass: "otherStageAreaClass", stagedCardName: "otherStagedCard", currLocationStagedCards: "otherStageAreaId", currCollectId: null};

var otherScrollLeftButton = document.getElementById("otherScrollLeft");
var otherScrollRightButton = document.getElementById("otherScrollRight");
var userScrollLeftButton = document.getElementById("userScrollLeft");
var userScrollRightButton = document.getElementById("userScrollRight");
var collectionSelect = document.getElementById("tradingCollectId");
var startTradeButton = document.getElementById("startTradeButton");
var confirmTradeButton= document.getElementById("confirmTradeButton");
var stopTradeButton= document.getElementById("stopTradeButton");

setupTradingPage(); 