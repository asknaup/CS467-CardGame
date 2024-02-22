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

// OLD!!!! createTradingCard() func for prototype/testing purposes
function createTradingCard(cardData) {
    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Card content
    var cardContent = document.createElement('div');
    cardContent.classList.add('cardContent');

    // Card header
    var cardHeader = document.createElement('div');

    var cardName = document.createElement('h2');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.cardName;

    cardHeader.appendChild(cardName);
  
    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    
    // Card details
    var cardDetails = document.createElement('div');
    cardDetails.classList.add('cardDetails');

    var cardDescription = document.createElement('p');
    cardDescription.classList.add('cardDescription');
    cardDescription.textContent = cardData.description;

    var additionalText = document.createElement('p');
    additionalText.textContent = cardData.cardType; // Set additional text content

    var attributesList = document.createElement('ul');
    attributesList.classList.add('attributes');

    
    // Iterate through card attributes to create list items
    cardData.attributes = {attack: cardData.attack, defense: cardData.defense, manaCost: cardData.manaCost};
    Object.keys(cardData.attributes).forEach(function (attribute) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${attribute}:</strong> ${cardData.attributes[attribute]}`;
        attributesList.appendChild(listItem);
    });

    // Build card body
    cardDetails.appendChild(cardDescription);
    cardDetails.appendChild(additionalText);
    cardDetails.appendChild(attributesList);

    // Append elements to card content
    cardContent.appendChild(cardHeader);
    cardContent.appendChild(cardImage);
    cardContent.appendChild(cardDetails);

    // Append card content to card container
    cardContainer.appendChild(cardContent);

    return cardContainer;
}


function createTradingCardWithId(id, cardData){
    let cardContainer = createTradingCard(cardData);
    cardContainer.setAttribute('id', id);
    return cardContainer;
}


function addStagedCardFunctionality(playerObj, primaryIndex){
    playerObj.startIndex = Math.floor(primaryIndex / numScrollCards) * numScrollCards;
    playerObj.endIndex = playerObj.startIndex + (numScrollCards - 1);
    if (playerObj.endIndex > playerObj.primaryKeyArr.length - 1){
        playerObj.endIndex = playerObj.primaryKeyArr.length - 1
    }
    displayScrollCards(playerObj);
}


function createAndAppendStagedCard(playerObj, primaryIndex, cardData){
    var stageArea = document.getElementById(playerObj.stageAreaId);
    let stagedCard = createTradingCardWithId(cardData.cardId + playerObj.stagedCardName, cardData);
    stagedCard.onclick = function(){addStagedCardFunctionality(playerObj, primaryIndex)};
    stageArea.appendChild(stagedCard);
}


function addScrollCardFunctionality(playerObj, primaryIndex, cardData, scrollCard){
        if (cardData.isStaged == false){
            if(playerObj.stagedCardCount < 4){
                highlightCard(true, playerObj.isUser, scrollCard);
                createAndAppendStagedCard(playerObj, primaryIndex, cardData);
                cardData.isStaged = true;
                playerObj.stagedCardCount += 1;
            }
        } else {
            highlightCard(false, playerObj.isUser, scrollCard);
            var stagedCard = document.getElementById(cardData.primaryKey + playerObj.stagedCardName);
            stagedCard.remove();
            cardData.isStaged = false;
            playerObj.stagedCardCount -= 1;
        }
    };


function displayScrollCards(playerObj){
    // Clear out old card elements
    var cardSlots = document.getElementById(playerObj.cardSlots);
    while(cardSlots.firstChild){
        cardSlots.removeChild(cardSlots.firstChild);
    }
    for (let index = playerObj.startIndex; index <= playerObj.endIndex; index++){
        let primaryKey = playerObj.primaryKeyArr[index];
        let cardData = playerObj.cardDict[primaryKey];
        let scrollCard = createTradingCardWithId(primaryKey, cardData);
        scrollCard.onclick = function () {addScrollCardFunctionality(playerObj, index, cardData, scrollCard)};
        if (cardData.isStaged == true){
            highlightCard(true, playerObj.isUser, scrollCard);
        }else{
            highlightCard(false, playerObj.isUser, scrollCard);
        }
        cardSlots.appendChild(scrollCard);
    }
}


// add green or purple border to card when selected
function highlightCard(isHighlighted, isUser, scrollCard){
    if (isHighlighted){
        if(isUser){
            scrollCard.style.border = "6px solid #65f76b";
        }else{
            scrollCard.style.border = "6px solid #f06cf0";
        }
    }else{
        scrollCard.style.border = "3px solid black";
    }
}