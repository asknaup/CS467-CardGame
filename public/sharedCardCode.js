// Function to create a trading card
function createTradingCard(cardData) {
    // Card container
    var card = document.createElement('div');
    card.classList.add('card');

    // cardId
    var cardId = document.createElement('p');
    cardId.textContent = cardData.cardId;

    // Tooltip for attributes
    // var toolTip = document.createElement('div');
    // toolTip.classList.add('toolTip');

    // var toolTipText = document.createElement('span');
    // toolTipText.classList.add('toolTipText');

    // Name
    var cardName = document.createElement('h1');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.cardName;

    // Text overlays
    var textOverlayBottom = document.createElement('div');
    textOverlayBottom.classList.add('textOverlayBottom');

    var textOverlayTop = document.createElement('div');
    textOverlayTop.classList.add('textOverlayTop');

    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    // TODO: Replace with creature
    var cardType = document.createElement('p');
    cardType.classList.add('cardType');
    cardType.textContent = cardData.cardType;

    var rarity = document.createElement('p');
    rarity.textContent = cardData.rarity;

    var manaCost = document.createElement('p');
    manaCost.innerHTML = `<strong>Mana:</strong> ${cardData.manaCost}`;

    // toolTipText.appendChild(rarity);
    // toolTipText.appendChild(manaCost);
    textOverlayBottom.appendChild(manaCost);

    if (cardData.cardType == "Spell") {
        var spellType = document.createElement('p');
        spellType.innerHTML = `<strong>Type:</strong> ${cardData.spellType}`;

        var spellAbility = document.createElement('p');
        spellAbility.innerHTML = `<strong>Ability:</strong> ${cardData.spellAbility}`;

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>ATK:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>DEF:</strong> ${cardData.spellDefense}`;

        textOverlayBottom.appendChild(spellType);
        textOverlayBottom.appendChild(spellAbility);
        textOverlayBottom.appendChild(spellAttack);
        textOverlayBottom.appendChild(spellDefense);
        // toolTipText.appendChild(spellType);
        // toolTipText.appendChild(spellAbility);
        // toolTipText.appendChild(spellAttack);
        // toolTipText.appendChild(spellDefense);

    } else {
        var attack = document.createElement('p');
        attack.innerHTML = `<strong>ATK:</strong> ${cardData.attack}`;

        var defense = document.createElement('p');
        defense.innerHTML = `<strong>DEF:</strong> ${cardData.defense}`;

        textOverlayBottom.appendChild(attack);
        textOverlayBottom.appendChild(defense);
        // toolTipText.appendChild(attack);
        // toolTipText.appendChild(defense);
    }

    // toolTip.appendChild(toolTipText);
    // textOverlayBottom.appendChild(cardName);
    // textOverlayBottom.appendChild(cardType);
    textOverlayTop.appendChild(cardName);
    textOverlayTop.appendChild(cardType);
    textOverlayTop.appendChild(rarity);

    card.appendChild(textOverlayBottom);
    card.appendChild(cardImage);
    // card.appendChild(textOverlayBottom);
    card.appendChild(textOverlayTop);

    // card.appendChild(toolTip);

    return card;
}



function createTradingCardWithId(id, cardData) {
    let cardContainer = createTradingCard(cardData);
    cardContainer.setAttribute('id', id);
    return cardContainer;
}

function createBackOfCard() {
    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');
    return cardContainer;
}

function createBackOfCardWithId(id) {
    let cardContainer = createBackOfCard();
    cardContainer.setAttribute('id', id);
    return cardContainer;
}

function addStagedCardFunctionality(playerObj, primaryIndex) {
    playerObj.startIndex = Math.floor(primaryIndex / playerObj.numCardsInView) * playerObj.numCardsInView;
    playerObj.endIndex = playerObj.startIndex + (playerObj.numCardsInView - 1);
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1) {
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
    displayCardCollectionForTrading(playerObj);
}


function createAndAppendStagedCard(playerObj, primaryIndex, cardData) {
    var stageArea = document.getElementById(playerObj.stageAreaId);
    let stagedCard = createTradingCardWithId(cardData.cardId + playerObj.stagedCardName, cardData);
    stagedCard.onclick = function () { addStagedCardFunctionality(playerObj, primaryIndex) };
    stageArea.appendChild(stagedCard);
}


function addScrollCardFunctionality(playerObj, primaryIndex, cardData, scrollCard) {
    if (cardData.isStaged == false) {
        if (playerObj.stagedCardCount < 4) {
            highlightCard(true, playerObj.isUser, scrollCard);
            createAndAppendStagedCard(playerObj, primaryIndex, cardData);
            cardData.isStaged = true;
            playerObj.stagedCardCount += 1;
        }
    } else {
        highlightCard(false, playerObj.isUser, scrollCard);
        var stagedCard = document.getElementById(cardData.cardId + playerObj.stagedCardName);
        stagedCard.remove();
        cardData.isStaged = false;
        playerObj.stagedCardCount -= 1;
    }
};


function displayCardCollectionForTrading(playerObj) {
    // Clear out old card elements
    var cardSlots = document.getElementById(playerObj.cardSlots);
    while (cardSlots.firstChild) {
        cardSlots.removeChild(cardSlots.firstChild);
    }
    for (let index = playerObj.startIndex; index <= playerObj.endIndex; index++) {
        let primaryKey = playerObj.primaryKeyArr[index];
        let cardData = playerObj.cardDict[primaryKey];
        let scrollCard = createTradingCardWithId(primaryKey, cardData);
        scrollCard.onclick = function () { addScrollCardFunctionality(playerObj, index, cardData, scrollCard) };
        if (cardData.isStaged == true) {
            highlightCard(true, playerObj.isUser, scrollCard);
        } else {
            highlightCard(false, playerObj.isUser, scrollCard);
        }
        cardSlots.appendChild(scrollCard);
    }
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

// add green or purple border to card when selected
function highlightCard(isHighlighted, isUser, scrollCard) {
    if (isHighlighted) {
        if (isUser) {
            scrollCard.style.border = "6px solid #65f76b";
        } else {
            scrollCard.style.border = "6px solid #f06cf0";
        }
    } else {
        scrollCard.style.border = "3px solid black";
    }
}


function addLeftScroll(playerObj, scrollLeftButton, displayFunc){
    scrollLeftButton.addEventListener("click", () => {
        if (playerObj.startIndex > 0){
            playerObj.endIndex = playerObj.startIndex - 1;
            playerObj.startIndex -= playerObj.numCardsInView;
            if(playerObj.startIndex < 0){
                playerObj.startIndex = 0;
            }
            console.log(playerObj.startIndex);
            console.log(playerObj.endIndex);
            displayFunc(playerObj);
        }
    });
}


function addRightScroll(playerObj, scrollRightButton, displayFunc){
    scrollRightButton.addEventListener("click", () => {
        if (playerObj.endIndex < playerObj.primaryKeyArr.length - 1){
            playerObj.startIndex = playerObj.endIndex + 1;
            playerObj.endIndex += userObj.numCardsInView;
            if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
                playerObj.endIndex = playerObj.primaryKeyArr.length - 1
            }
            displayFunc(playerObj);
        }
    });
}


function resetInitialStartAndEndIndex(playerObj){
    playerObj.startIndex = 0;
    playerObj.endIndex = playerObj.numCardsInView - 1;
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
}