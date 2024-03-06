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

class CreatureCard extends Card {
    constructor(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana) {
        super(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana);
    }
}

class SpellCard extends Card {
    constructor(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana, ability, utility) {
        super(cardId, cardName, imagePath, description, type, rarity, attack, defense, mana);
        this.ability = ability;
        this.utility = utility;
    }
}


async function collectionSelectHandler(collectionSelect){
        var collectionLoadingTitle = document.getElementById("collectionLoadingTitle");
        collectionLoadingTitle.style.display = "block";
        let collectionKey = parseInt(collectionSelect.value);
        userObj.currCollectId = collectionKey;
        await switchToGivenUserCollection(userObj);
        resetInitialStartAndEndIndex(userObj);
        displayCardCollection(userObj);
        collectionLoadingTitle.style.display = "none";
}


async function setupCollectionPage(){
    var collectionLoadingTitle = document.getElementById("collectionLoadingTitle");
    collectionLoadingTitle.style.display = "block";
    const response= await fetch('/getCollection');
    let collection = await response.json();
    if(collection.length > 0){ 
        userObj.currCollectId = collection[0].collectionId;
    };
    await getInitialUserCollection(collection, userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollection(userObj);
    collectionLoadingTitle.style.display = "none";
    addRightScroll(userObj, collectionScrollRightButton, displayCardCollection);
    addLeftScroll(userObj, collectionScrollLeftButton, displayCardCollection);
    collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect) });
}


/*main code for collection */
let userObj = {isUser: true, primaryKeyArr: [], cardDict: {}, primaryKeysForCollections: {}, collections: {}, cardListsFromDb: {},
            numCardsInView: 28, startIndex: 0, endIndex: 20, cardSlots: "userCardSlots", collectionContainer: "collectionContainer"};

var collectionScrollLeftButton = document.getElementById("collectionScrollLeft");
var collectionScrollRightButton = document.getElementById("collectionScrollRight");
var collectionSelect = document.getElementById("collectId");

setupCollectionPage();