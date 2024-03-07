let cardTemplates = [{id: "10", name: "Joe", imagePath: "/images/goblinGuy.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: null, defnese: null, mana: "2"},

    {id:"47", name: "Chain Lightning", imagePath: "/images/chainLightening.jpg", description: "", type: "Spell", 
    rarity: "Common", attack: null, defense: null, mana: "1"},

    {id:"49", name: "Ronan", imagePath: "/images/building.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: "3", defense: "1", mana: "2"},

    {id:"48", name:"lotus", imagePath: "/images/bear.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: null, defense: null, mana: "2"},

    {id:"50", name: "Uilliam", imagePath: "/images/madMaxLookingGuy.jpg", description: "", type: "Creature", 
    rarity: "Common", attack: "0", defense: "1", mana: "3"},

    {id:"5115", name: "Ivaylo", imagePath: "/images/pirate.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "9", defense: "7", mana: "8"},

    {id:"312", name:"_", imagePath: "/images/hoodedGuy.jpg", description: "", type: "Spell", 
    rarity: "common", attack: null, defense: null, mana: "0"},

    {id:"1510", name: "joe", imagePath: "/images/boxer.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "4", defense:"8", mana: "2"},

    {id:"154", name:"joe", imagePath: "/images/aragornIsThatYou.jpg", description: "", type: "Creature", 
    rarity: "common", attack: "4", defense: "8", mana: "2"},

    {id:"207", name:"joe", imagePath: "/images/werewolf.jpg", description: "", type: "Creature", 
    rarity: "common", attack: null, defense: null, mana: "2"},

    {id:"332", name:"_", imagePath: "/images/orbThing.jpg", description: "", type: "Spell",
     rarity: "common", attack: null, defense: null, mana: "0"},

    {id:"4632", name: "Invisibility", imagePath: "/images/noIdeaWhatThisIs.jpg", description: "", type:"Spell", 
    rarity: "common" , attack: null, defense: null, mana: "2"},

    {id: "172", name: "jay", imagePath: "devilGuy", description: "", type: "Creature", 
    rarity: "common",  attack: 4, defense: 3, mana: 2},

    {id: "1062", name: "Ronan", imagePath: "scaryArmoredGuy", description: "", type: "Creature", 
    rarity: "common", attack: 4, defense: 3, mana: 3},

    {id: "1014", name: "Lirael", imagePath: "desert", description: "", type: "Creature", 
    rarity: "common", attack: 4, defense: 5, mana: 4},

    {id: "10923", name: "Gareth", imagePath: "space", description: "", type: "Creature", 
    rarity: "common", attack: 5, defense: 4, mana: 4},

    {id: "10335", name: "Brigid", imagePath: "pinkGuy", description: "", type: "Creature", 
    rarity: "common", attack: 2, defense: 2, mana: 3},

    {id: "10739", name: "Séimíne", imagePath: "paradise", description: "", type: "Creature", 
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

        let cardA = new miniGameCard (cardObj.id + "A", cardObj.name, cardObj.imagePath, cardObj.description, cardObj.type, 
                    cardObj.rarity, cardObj.attack, cardObj.defense, cardObj.mana, cardObj.id);
        userObj.cardObjs.push(cardA);
        userObj.cardsDict[cardA.id] = cardA;
    
        let cardB = new miniGameCard (cardObj.id + "B", cardObj.name, cardObj.imagePath, cardObj.description, cardObj.type, 
                    cardObj.rarity, cardObj.attack, cardObj.defense, cardObj.mana, cardObj.id);
        userObj.cardObjs.push(cardB);
        userObj.cardsDict[cardB.id] = cardB; 
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
        var backMiniGameCard = createBackOfCardWithId(cardObj.id + "Back");
        backMiniGameCard.classList.add("miniGameCard")
        backMiniGameCard.classList.add("miniGameCardBack")
        backMiniGameCard.style.position = "absolute";
        backMiniGameCard.style.zIndex = 10;
        // create trading card
        console.log(cardObj.name)
        var miniGameCard = createTradingCardWithId(cardObj.id, cardObj);
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
