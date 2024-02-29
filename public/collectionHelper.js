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

function collectionSelectHandler(collectionSelect){
    collectionSelect.addEventListener("change", () => {
        let collectionKey = parseInt(collectionSelect.value);
        switchToGivenCollection(collectionKey);
        userObj.startIndex = 0;
        userObj.endIndex = numCardsInView - 1;
        if (userObj.endIndex > userObj.primaryKeyArr.length - 1){
            userObj.endIndex = userObj.primaryKeyArr.length - 1
        }
        displayCardCollection(userObj);
    })
}

function switchToGivenCollection(collectionKey){
    userObj.primaryKeyArr = userObj.primaryKeysForCollections[collectionKey];
    userObj.cardDict = userObj.collections[collectionKey];
}


async function getCollection(){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    for(let index = 0; index < collection.length; index++){
        let cardList = JSON.parse(collection[index].cardId);
        let listOfCardObjs = cardList.cardList;
        //console.log(listOfCardObjs);
        userObj.primaryKeysForCollections[index] = [];
        userObj.collections[index] = {};
        for(const cardId of  listOfCardObjs){
            const cardDetailsResponse = await fetch('/getCardDetails?cardId=' + cardId);
            await cardDetailsResponse.json()
                .then((cardData) => {
                        userObj.primaryKeysForCollections[index].push(cardData.id);
                        //(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana)
                        let cardObj = new Card(cardData.id, cardData.cardName, cardData.imagePath, 
                            cardData.description, cardData.type, cardData.rarity, cardData.attack, cardData.defense, cardData.mana); 
                        userObj.collections[index][cardData.id] = cardObj;
                })
                .catch((error) => {console.log(error)});
                
        }
    }
}

async function setupCollectionPage(){
    await getCollection();
    userObj.primaryKeyArr = userObj.primaryKeysForCollections[0];
    //console.log(userObj.primaryKeyArr)
    userObj.cardDict = userObj.collections[0];
    if(userObj.primaryKeyArr.length < userObj.endIndex){
        userObj.endIndex = userObj.primaryKeyArr.length - 1;
    }
    displayCardCollection(userObj);
    addRightScroll(userObj, collectionScrollRightButton)
    addLeftScroll(userObj, collectionScrollLeftButton)

}


/*main code for collection */
var numCardsInView = 21;
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {}, primaryKeysForCollections: {}, collections: {}, 
             startIndex: 0, endIndex: 20, cardSlots: "userCardSlots", collectionContainer: "collectionContainer"};

var collectionScrollLeftButton = document.getElementById("collectionScrollLeft");
var collectionScrollRightButton = document.getElementById("collectionScrollRight");
setupCollectionPage();


var collectionSelect = document.getElementById("collectId");
collectionSelectHandler(collectionSelect)