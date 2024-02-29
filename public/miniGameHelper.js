class Card{
    constructor(cardId, cardName, imagePath, description, type, rarity,
         attack, defense, mana, matchIdentifier){
        this.cardId = cardId;
        this.cardName = cardName;
        this.imagePath = imagePath;
        this.type = type;
        this.description = description;
        this.rarity = rarity;
        this.attack = attack;
        this.defense = defense;
        this.mana = mana;
        this.matchIdentifier = matchIdentifier;
        this.isFaceUp = false;
        this.hasBeenMatched = false;
    }
}

/*      cardId, cardName, imagePath, cardType, rarity, spellType, spAbility, spAtk, spDef, atk, def, manaCost) */
let cardTemplates = [{cardId: "10", cardName: "Joe", imagePath: "/images/goblinGuy.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: null, defnese: null, mana: "2"},

    {cardId:"47", cardName: "Chain Lightning", imagePath: "/images/chainLightening.jpg", description: "", type: "Spell", 
    rarity: "Common", attack: null, defense: null, mana: "1"},

    {cardId:"49", cardName: "Ronan", imagePath: "/images/building.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: "3", defense: "1", mana: "2"},

    {cardId:"48", cardName:"lotus", imagePath: "/images/bear.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: null, defense: null, mana: "2"},

    {cardId:"50", cardName: "Uilliam", imagePath: "/images/madMaxLookingGuy.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: "0", defense: "1", mana: "3"},

    {cardId:"5115", cardName: "Ivaylo", imagePath: "/images/pirate.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "9", defense: "7", mana: "8"},

    {cardId:"312", cardName:"_", imagePath: "/images/hoodedGuy.jpg", description: "", type: "Spell", 
    rarity: "common", attack: null, defense: null, mana: "0"},

    {cardId:"1510",cardName: "joe", imagePath: "/images/boxer.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "4", defense:"8", mana: "2"},

    {cardId:"154", cardName:"joe", imagePath: "/images/aragornIsThatYou.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "4", defense: "8", mana: "2"},

    {cardId:"207", cardName:"joe", imagePath: "/images/werewolf.jpg", description: "", type: "Creature", 
    rarity: "common", attack: null, defense: null, mana: "2"},

    {cardId:"332", cardName:"_", imagePath: "/images/orbThing.jpg", description: "", type: "Spell",
     rarity: "common", attack: null, defense: null, mana: "0"},

    {cardId:"4632", cardName: "Invisibility", imagePath: "/images/noIdeaWhatThisIs.jpg", description: "", type:"Spell", 
    rarity: "common" , attack: null, defense: null, mana: "2"},

    {cardId: "172", cardName: "jay", imagePath: "devilGuy", description: "", type: "Creature", 
    rarity: "common",  attack: 4, defense: 3, mana: 2},

    {cardId: "1062", cardName: "Ronan", imagePath: "scaryArmoredGuy", description: "", type: "Creature", 
    rarity: "common", attack: 4, defense: 3, mana: 3},

    {cardId: "1014", cardName: "Lirael", imagePath: "desert", description: "", type: "Creature", 
    rarity: "common", attack: 4, defense: 5, mana: 4},

    {cardId: "10923", cardName: "Gareth", imagePath: "space", description: "", type: "Creature", 
    rarity: "common", attack: 5, defense: 4, mana: 4},

    {cardId: "10335", cardName: "Brigid", imagePath: "pinkGuy", description: "", type: "Creature", 
    rarity: "common", attack: 2, defense: 2, mana: 3},

    {cardId: "10739", cardName: "Séimíne", imagePath: "paradise", description: "", type: "Creature", 
    rarity: "common", attack: 1, defense: 1, mana: 2}];


function flipCardFaceUp(cardSlot){
    let backOfCard = cardSlot.firstElementChild;
    let frontOfCard = cardSlot.lastElementChild;
    if(parseInt(backOfCard.style.zIndex) > parseInt(frontOfCard.style.zIndex)){
        let tempZIndex = backOfCard.style.zIndex;
        backOfCard.style.zIndex =  frontOfCard.style.zIndex;
        frontOfCard.style.zIndex = tempZIndex;
    }
}


function flipCardFaceDown(cardSlot){
    let backOfCard = cardSlot.firstElementChild;
    let frontOfCard = cardSlot.lastElementChild;
    if(parseInt(backOfCard.style.zIndex) < parseInt(frontOfCard.style.zIndex)){
        let tempZIndex = backOfCard.style.zIndex;
        backOfCard.style.zIndex =  frontOfCard.style.zIndex;
        frontOfCard.style.zIndex = tempZIndex;
    }
}


function flipOverOldFaceUpCards(){
    for(const tuple of userObj.oldFaceUpCards){
        let [oldCardSlot, oldCard] = tuple;
        if(!oldCard.isFaceUp){
            flipCardFaceDown(oldCardSlot);
        }
    }
    userObj.oldFaceUpCards = [];
}


function runGame(cardSlotIndex){
    let cardSlot = userObj.cardSlotsArr[cardSlotIndex]
    let cardObj = userObj.slotToCardDict[cardSlot.id]
    if(!cardObj.isFaceUp ){
        gameLogic(cardObj, cardSlot)
    }
}


function gameLogic(cardObj, cardSlot){
    if(userObj.numTurnsTaken % 2 == 0){
        cardObj.isFaceUp = true;
        userObj.firstCard = cardObj;
        userObj.firstCardSlot = cardSlot;
        flipCardFaceUp(userObj.firstCardSlot);
    }else{
        cardObj.isFaceUp = true;
        userObj.secondCard = cardObj;
        userObj.secondCardSlot = cardSlot;
        flipCardFaceUp(userObj.secondCardSlot);
        if(userObj.firstCard.matchIdentifier === userObj.secondCard.matchIdentifier){
            userObj.firstCard.hasBeenMatched = true;
            userObj.secondCard.hasBeenMatched = true;
            userObj.numOfMatchesLeft -= 1;
        }else{
            userObj.firstCard.isFaceUp= false;
            userObj.secondCard.isFaceUp = false;
            userObj.oldFaceUpCards.push([userObj.firstCardSlot, userObj.firstCard]);
            userObj.oldFaceUpCards.push([userObj.secondCardSlot, userObj.secondCard]);
            setTimeout(flipOverOldFaceUpCards, 1500);
        }
    }
    userObj.numTurnsTaken += 1;
    if(userObj.numOfMatchesLeft === 0){
        let wonTitlePart1 = document.getElementById("wonTitlePart1");
        wonTitlePart1.style.display = "block";
        let wonTitlePart2 = document.getElementById("wonTitlePart2");
        wonTitlePart2.style.display = "block";
    }
}


function setupCardObjs(){
    userObj.cardObjs = [];
    userObj.cardSlotsArr = [];
    userObj.slotToCardDict = {};
    userObj.cardsDict = {};
    userObj.numOfMatchesLeft = 9;
    for(let index = 0; index < (userObj.numCardSlots / 2); index++){
        let cardObj = cardTemplates[index];

        let cardA = new Card (cardObj.cardId + "A", cardObj.cardName, cardObj.imagePath, cardObj.description, cardObj.type, 
                    cardObj.rarity, cardObj.attack, cardObj.defense, cardObj.mana, cardObj.cardId);
        userObj.cardObjs.push(cardA);
        userObj.cardsDict[cardA.cardId] = cardA;
    
        let cardB = new Card (cardObj.cardId + "B", cardObj.cardName, cardObj.imagePath, cardObj.description, cardObj.type, 
                    cardObj.rarity, cardObj.attack, cardObj.defense, cardObj.mana, cardObj.cardId);
        userObj.cardObjs.push(cardB);
        userObj.cardsDict[cardB.cardId] = cardB; 
    }
}


function shuffleCards(){
    // Fischer-Yates Shuffle
    for (let i = userObj.cardObjs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [userObj.cardObjs[i], userObj.cardObjs[j]] = [userObj.cardObjs[j], userObj.cardObjs[i]]
    }
}


function populateCardSlots(){
    // fill cardSlots with card elements
    for(let index = 0; index < userObj.cardObjs.length; index++){
        var cardObj = userObj.cardObjs[index];
        // create back of trading car
        var backMiniGameCard = createBackOfCardWithId(cardObj.cardId + "Back");
        backMiniGameCard.classList.add("miniGameCard")
        backMiniGameCard.classList.add("miniGameCardBack")
        backMiniGameCard.style.position = "absolute";
        backMiniGameCard.style.zIndex = 10;
        // create trading card
        var miniGameCard = createTradingCardWithId(cardObj.cardId, cardObj);
        miniGameCard.classList.add("miniGameCard")
        miniGameCard.style.position = "absolute";
        miniGameCard.style.zIndex = 2;
        // store miniGameCardSlot in var
        userObj.cardSlotsArr.push(document.getElementById("cardSlot" + index));
        userObj.cardSlotsArr[index].setAttribute('id', "cardSlot" + index);
        userObj.cardSlotsArr[index].appendChild(backMiniGameCard);
        userObj.cardSlotsArr[index].appendChild(miniGameCard);
        // keep track of which card is in which cardSlot
        userObj.slotToCardDict["cardSlot" + index] = cardObj;
    }
}

function removeOldCardsFromBoard(){
    for(let slotNum = 0; slotNum < userObj.numCardSlots; slotNum++){
        var cardSlotDiv = document.getElementById("cardSlot" + slotNum);
        while(cardSlotDiv.firstChild){
            cardSlotDiv.removeChild(cardSlotDiv.firstChild);
        }
    }
}

function setUpMiniGame(){
    let wonTitlePart1 = document.getElementById("wonTitlePart1");
    wonTitlePart1.style.display = "none";
    let wonTitlePart2 = document.getElementById("wonTitlePart2");
    wonTitlePart2.style.display = "none";
    removeOldCardsFromBoard();
    setupCardObjs();
    shuffleCards();
    populateCardSlots();
}


// create cardObs for miniGame from cardTemplates array
userObj = {firstCard: null, firstCardSlot: null, secondCard: null, secondCardSlot: null, numTurnsTaken: 0, numCardSlots: 18, 
            cardObjs: [], cardSlotsArr: [], slotToCardDict: {}, cardsDict: {}, oldFaceUpCards: [], numOfMatchesLeft: 9};


/* Main code for miniGame */
setUpMiniGame();

/* Setup Event Listeners: add game logic by adding eventListeners to each cardSlot */
for(let cardSlotIndex = 0; cardSlotIndex < userObj.cardSlotsArr.length; cardSlotIndex++){
    userObj.cardSlotsArr[cardSlotIndex].addEventListener("click", () => {
        runGame(cardSlotIndex)
    });
}


var playGameButton = document.getElementById("playGameButton");
playGameButton.addEventListener("click", () => {
    let miniGame = document.getElementById("miniGame");
    if (miniGame.style.display ==="none"){
        miniGame.style.display = "block";
    }else{
        miniGame.style.display = "none";
    }
});

var minimizeButton = document.getElementById("minimizeButton");
minimizeButton.addEventListener("click", () => {
    let miniGame = document.getElementById("miniGame");
    miniGame.style.display = "none";  
})

var refreshGameButton = document.getElementById("refreshGameButton");
refreshGameButton.addEventListener("click", () => {
    setUpMiniGame();
});
