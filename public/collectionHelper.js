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


function createExampleCardsForCollection(exampleCards){
    for (let index = 0; index <= 23; index++){
        let numCards = exampleCards.length;
        let randomIndex = Math.floor(Math.random() * numCards);
        let cardData = exampleCards[randomIndex];
        let uniquePrimaryKey = cardData.cardId + index.toString()
        userObj.primaryKeyArr.push(uniquePrimaryKey);
        userObj.cardDict[uniquePrimaryKey] = new Card(uniquePrimaryKey, cardData.cardName, cardData.imagePath, cardData.cardType, 
            cardData.spellType, cardData.spellAbility, cardData.spellAttack, cardData.spellDefense, 
            cardData.attack, cardData.defense, cardData.manaCost); 
    }
}


/*main code for collection */
var numCardsInView = 21;
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {},  startIndex: 0, endIndex: 20, cardSlots: "userCardSlots", 
            collectionContainer: "collectionContainer"};

var collectionScrollLeftButton = document.getElementById("collectionScrollLeft");
var collectionScrollRightButton = document.getElementById("collectionScrollRight");

async function setupCollectionPage(){
    let exampleCards = []
    const response = await fetch('/cards');
    let collection = await response.json()
    Object.keys(collection).forEach(key => {exampleCards.push(collection[key])})
    console.log(exampleCards)
    createExampleCardsForCollection(exampleCards)
    displayCardCollection(userObj);
    addRightScroll(userObj, collectionScrollRightButton)
    addLeftScroll(userObj, collectionScrollLeftButton)
}
setupCollectionPage();


