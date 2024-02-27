class Card{
    constructor(primaryKey, cardName, imagePath, cardType, rarity, spellType, 
        spellAbility, spellAttack, spellDefense, attack, defense, manaCost, matchIdentifier){
        this.cardId = primaryKey;
        this.cardName = cardName;
        this.imagePath = imagePath;
        this.cardType = cardType;
        this.description = "";
        this.rarity = rarity;
        this.spellType = spellType;
        this.specialAbility = spellAbility;
        this.spellAttack = spellAttack;
        this.spellDefense = spellDefense;
        this.attack = attack;
        this.defense = defense;
        this.manaCost = manaCost;
        this.matchIdentifier = matchIdentifier;
        this.isFaceUp = false;
        this.hasBeenMatched = false;
        
    }
}


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
}


/*      cardId, cardName, imagePath, cardType, rarity, spellType, spAbility, spAtk, spDef, atk, def, manaCost) */
let cardTemplates = [{cardId: "10", cardName: "Joe", imagePath: "/images/goblinGuy.jpg",  cardType: "Creature", rarity: "Common", spellType: null, 
    spellAbility: "Enhance", spellAttack: "12", spellDefense: "1", attack: null, defnese: null, manaCost: "2"},

    {cardId:"47", cardName: "Chain Lightning", imagePath: "/images/chainLightening.jpg", cardType: "Spell", rarity: "Common", spellType: "Offensive", 
    spellAbility:"_", spellAttack: "0", spellDefense: "1", attack: null, defense: null, manaCost: "1"},

    {cardId:"49", cardName: "Ronan", imagePath: "/images/building.jpg", cardType: "Creature", rarity: "Common", spellType: null, 
    spellAbility: null, spellAttack: null, spellDefense: null, attack: "3", defense: "1", manaCost: "2"},

    {cardId:"48", cardName:"lotus", imagePath: "/images/bear.jpg", cardType: "Creature", rarity: "Common", spellType: null, 
    spellAbility: null, spellAttack: "2", spellDefense: "2", attack: null, defense: null, manaCost: "2"},

    {cardId:"50", cardName: "Uilliam", imagePath: "/images/madMaxLookingGuy.jpg", cardType: "Creature", rarity: "Common", spellType: null,
     spellAbility: null, spellAttack: null, spellDefense: null, attack: "0", defense: "1", manaCost: "3"},

    {cardId:"5115", cardName: "Ivaylo", imagePath: "/images/pirate.jpg", cardType: "Creature", rarity: "common", spellType: null, 
    spellAbility: null,spellAttack:  null, spellDefense: null, attack: "9", defense: "7", manaCost: "8"},

    {cardId:"312", cardName:"_", imagePath: "/images/hoodedGuy.jpg", cardType: "Spell", rarity: "common", spellType: "Offensive", 
    spellAbility: "_", spellAttack:"0", spellDefense: "0", attack: null, defense: null, manaCost: "0"},

    {cardId:"1510",cardName: "joe", imagePath: "/images/boxer.jpg", cardType: "Creature", rarity: "common", spellType: null, 
    spellAbility: null, spellAttack: null, spellDefense: null, attack: "4", defense:"8", manaCost: "2"},

    {cardId:"154", cardName:"joe", imagePath: "/images/aragornIsThatYou.jpg", cardType: "Creature", rarity: "common", spellType: null, 
    spellAbility: null, spellAttack: null, spellDefense: null, attack: "4", defense: "8", manaCost:"2"},

    {cardId:"207", cardName:"joe", imagePath: "/images/werewolf.jpg", cardType: "Creature", rarity: "common", spellType: null, 
    spellAbility: "Enhance", spellAttack: "3",spellDefense: "3", attack: null, defense: null, manaCost: "2"},

    {cardId:"332", cardName:"_", imagePath: "/images/orbThing.jpg", cardType: "Spell", rarity: "common", spellType: "Offensive", 
    spellAbility: "_", spellAttack:"0", spellDefense: "0", attack: null, defense: null, manaCost: "0"},

    {cardId:"4632", cardName: "Invisibility", imagePath: "/images/noIdeaWhatThisIs.jpg", cardType:"Spell", rarity: "common" , spellType: "Offensive", 
    spellAbility: "_", spellAttack: "0", spellDefense: "2", attack: null, defense: null, manaCost: "2"},

    {cardId: "172", cardName: "jay", imagePath: "devilGuy", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 4, defense: 3, manaCost: 2},

    {cardId: "1062", cardName: "Ronan", imagePath: "scaryArmoredGuy", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 4, defense: 3, manaCost: 3},

    {cardId: "1014", cardName: "Lirael", imagePath: "desert", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 4, defense: 5, manaCost: 4},

    {cardId: "10923", cardName: "Gareth", imagePath: "space", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 5, defense: 4, manaCost: 4},

    {cardId: "10335", cardName: "Brigid", imagePath: "pinkGuy", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 2, defense: 2, manaCost: 3},

    {cardId: "10739", cardName: "Séimíne", imagePath: "paradise", cardType: "Creature", rarity: "common", spellType: null,
    specialAbility: null, spellAttack: null, spellDefense: null, attack: 1, defense: 1, manaCost: 2}];


// create cardObs for miniGame from cardTemplates array
userObj = {firstCard: null, firstCardSlot: null, secondCard: null, secondCardSlot: null, numTurnsTaken: 0, numCardSlots: 18, 
            cardObjs: [], cardSlotsArr: [], slotToCardDict: {}, cardsDict: {}, oldFaceUpCards: []};
for(let index = 0; index < (userObj.numCardSlots / 2); index++){
    let cardObj = cardTemplates[index];
    let cardA = new Card (cardObj.cardId + "A", cardObj.cardName, cardObj.imagePath, cardObj.cardType, cardObj.rarity, cardObj.spellType, 
    cardObj.spellAbility, cardObj.spellAttack, cardObj.spellDefense, cardObj.attack, cardObj.defense, cardObj.manaCost, cardObj.cardId);
    userObj.cardObjs.push(cardA);
    userObj.cardsDict[cardA.cardId] = cardA;

    let cardB = new Card (cardObj.cardId + "B", cardObj.cardName, cardObj.imagePath, cardObj.cardType, cardObj.rarity, cardObj.spellType, 
    cardObj.spellAbility, cardObj.spellAttack, cardObj.spellDefense, cardObj.attack, cardObj.defense, cardObj.manaCost, cardObj.cardId);
    userObj.cardObjs.push(cardB);
    userObj.cardsDict[cardB.cardId] = cardB; 
}

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


//add game logic by adding eventListeners to each cardSlot
for(let cardSlotIndex = 0; cardSlotIndex < userObj.cardSlotsArr.length; cardSlotIndex++){
    userObj.cardSlotsArr[cardSlotIndex].addEventListener("click", () => {
        runGame(cardSlotIndex)
    });
}


var playGameButton = document.getElementById("playGameButton");
playGameButton.addEventListener("click", () => {
    let miniGame = document.getElementById("miniGame");
    miniGame.style.display = "block";  
});

var minimizeButton = document.getElementById("minimizeButton");
minimizeButton.addEventListener("click", () => {
    let miniGame = document.getElementById("miniGame");
    miniGame.style.display = "none";  
})
