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
    }
}

function addLeftScroll(userObj, scrollLeftButton){
    scrollLeftButton.addEventListener("click", () => {
        if (userObj.startIndex > 0){
            userObj.endIndex = userObj.startIndex - 1;
            userObj.startIndex -= numCardsInView;
            if(userObj.startIndex < 0){
                userObj.startIndex = 0;
            }
            console.log(userObj.startIndex);
            console.log(userObj.endIndex);
            displayCardCollection(userObj);
        }
    });
}


function addRightScroll(userObj, scrollRightButton){
    scrollRightButton.addEventListener("click", () => {
        if (userObj.endIndex < userObj.primaryKeyArr.length - 1){
            userObj.startIndex = userObj.endIndex + 1;
            userObj.endIndex += numCardsInView;
            if (userObj.endIndex > userObj.primaryKeyArr.length - 1){
                userObj.endIndex = userObj.primaryKeyArr.length - 1
            }
            console.log(userObj.startIndex);
            console.log(userObj.endIndex);
            displayCardCollection(userObj);
        }
    });
}


function displayCardCollection(userObj){
    // Clear out old card elements
    var collectionContainer = document.getElementById(userObj.collectionContainer);
    while(collectionContainer.firstChild){
        collectionContainer.removeChild(collectionContainer.firstChild);
    }
    for (let index = userObj.startIndex; index <= userObj.endIndex; index++){
        let primaryKey = userObj.primaryKeyArr[index];
        let cardData = userObj.cardDict[primaryKey];
        let collectionCard = createTradingCardWithId(primaryKey, cardData);
        collectionContainer.appendChild(collectionCard);
    }
}

async function collectionSelectHandler(collectionSelect){
        let collectionKey = parseInt(collectionSelect.value);
        console.log(collectionKey);
        await switchToGivenCollection(collectionKey, userObj);
        resetInitialStartAndEndIndex(userObj);
        displayCardCollection(userObj);
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
    userObj.endIndex = numCardsInView - 1;
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

async function setupCollectionPage(){
    await getCollection(userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollection(userObj);
    addRightScroll(userObj, collectionScrollRightButton);
    addLeftScroll(userObj, collectionScrollLeftButton);
}


/*main code for collection */
var numCardsInView = 21;
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {}, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},
                startIndex: 0, endIndex: 20, cardSlots: "userCardSlots", collectionContainer: "collectionContainer"};

var collectionScrollLeftButton = document.getElementById("collectionScrollLeft");
var collectionScrollRightButton = document.getElementById("collectionScrollRight");
setupCollectionPage();


var collectionSelect = document.getElementById("collectId");
collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect) });