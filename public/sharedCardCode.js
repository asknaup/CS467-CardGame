// Function to create a trading card
/*
function createTradingCard(cardData) {
    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Card content
    // var cardContent = document.createElement('div');
    // cardContent.classList.add('cardContent');

    // // Frame header
    // var frameHeader = document.createElement('div');
    // frameHeader.classList.add('frameHeader');

    // cardId
    var cardId = document.createElement('p');
    cardId.textContent = cardData.cardId;

    // Name
    var cardName = document.createElement('h1');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.cardName;

    var textOverlay = document.createElement('div');
    textOverlay.classList.add('textOverlay');

    // frameHeader.appendChild(cardName);

    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    // // Card details
    // var cardDetails = document.createElement('div');
    // cardDetails.classList.add('cardDetails');

    // TODO: Replace with creature
    var cardType = document.createElement('p');
    cardType.classList.add('cardType');
    cardType.textContent = cardData.cardType;

    // var rarity = document.createElement('p');
    // rarity.textContent = cardData.rarity;

    // var manaCost = document.createElement('p');
    // manaCost.innerHTML = `<strong>Mana Cost:</strong> ${cardData.manaCost}`;

    // var attributesList = document.createElement('ul');
    // attributesList.classList.add('attributes');

    // if (cardData.cardType == "spell") {
    //     var spellType = document.createElement('li');
    //     spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

    //     var spellAbility = document.createElement('li');
    //     spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardData.spellAbility}`;

    //     var spellAttack = document.createElement('li');
    //     spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.spellAttack}`;

    //     var spellDefense = document.createElement('li');
    //     spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.spellDefense}`;

    //     attributesList.appendChild(spellType);
    //     attributesList.appendChild(spellAbility);
    //     attributesList.appendChild(spellAttack);
    //     attributesList.appendChild(spellDefense);
    // }

    // var cardFrame = document.createElement('div');
    // cardFrame.classList.add('cardFrame');

    // var cardBackground = document.createElement('div');
    // cardBackground.classList.add('cardBackground');

    // var attack = document.createElement('li');
    // attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

    // var defense = document.createElement('li');
    // defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

    // attributesList.appendChild(attack);
    // attributesList.appendChild(defense);

    textOverlay.appendChild(cardName);
    textOverlay.appendChild(cardType);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(textOverlay);
    // cardContainer.appendChild(cardId);

    // Build card body
    // cardDetails.appendChild(cardId);
    // cardDetails.appendChild(cardType);
    // cardDetails.appendChild(rarity);
    // cardDetails.appendChild(manaCost);
    // cardDetails.appendChild(attributesList);

    // Append elements to card content
    // cardContent.appendChild(frameHeader);
    // cardContent.appendChild(cardImage);
    // cardContent.appendChild(cardDetails);

    // cardFrame.appendChild(cardContent);

    // cardBackground.appendChild(cardFrame);

    // Append card content to card container
    // cardContainer.appendChild(cardBackground);

    return cardContainer;
}
*/

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
    manaCost.innerHTML = `<strong>Mana Cost:</strong> ${cardData.manaCost}`;

    // toolTipText.appendChild(rarity);
    // toolTipText.appendChild(manaCost);
    textOverlayBottom.appendChild(rarity);
    textOverlayBottom.appendChild(manaCost);

    if (cardData.cardType == "Spell") {
        var spellType = document.createElement('p');
        spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

        var spellAbility = document.createElement('p');
        spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardData.spellAbility}`;

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.spellDefense}`;

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
        attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

        var defense = document.createElement('p');
        defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

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
    playerObj.startIndex = Math.floor(primaryIndex / numScrollCards) * numScrollCards;
    playerObj.endIndex = playerObj.startIndex + (numScrollCards - 1);
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1) {
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
    displayScrollCards(playerObj);
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


function displayScrollCards(playerObj) {
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