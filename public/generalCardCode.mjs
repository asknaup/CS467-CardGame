function convertListToDict(list) {
    let dict = {};
    for (let i = 0; i < list.length; i++) {
        let card = list[i];
        dict[card.cardId] = card;
    }
    return dict;
}

// Function to create a trading card
export function createTradingCard(cardData) {
    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Card content
    var cardContent = document.createElement('div');
    cardContent.classList.add('cardContent');

    // Card header
    var cardHeader = document.createElement('div');

    // Name
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

    var cardType = document.createElement('p');
    cardType.textContent = cardData.cardType;

    var rarity = document.createElement('p');
    rarity.textContent = cardData.rarity;

    var manaCost = document.createElement('p');
    manaCost.innerHTML = `<strong>${manaCost}:</strong> ${cardData.manaCost}`;

    var attributesList = document.createElement('ul');
    attributesList.classList.add('attributes');

    if (cardType == "spell") {
        var spellType = document.createElement('li');
        spellType.innerHTML = `<strong>${spellType}:</strong> ${cardData.spellType}`;

        var spellAbility = document.createElement('li');
        spellAbility.innerHTML = `<strong>${spellAbility}:</strong> ${cardData.spellAbility}`;

        var spellAttack = document.createElement('li');
        spellAttack.innerHTML = `<strong>${spellAttack}:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('li');
        spellDefense.innerHTML = `<strong>${spellDefense}:</strong> ${cardData.spellDefense}`;

        attributesList.appendChild(spellType);
        attributesList.appendChild(spellAbility);
        attributesList.appendChild(spellAttack);
        attributesList.appendChild(spellDefense);
    }

    // var utility = document.createElement('li');
    // utility.innerHTML = `<strong>${utility}:</strong> ${cardData.utility}`;

    var attack = document.createElement('li');
    attack.innerHTML = `<strong>${attack}:</strong> ${cardData.attack}`;

    var defense = document.createElement('li');
    defense.innerHTML = `<strong>${defense}:</strong> ${cardData.defense}`;

    attributesList.appendChild(attack);
    attributesList.appendChild(defense);
    // // Iterate through card attributes to create list items
    // Object.keys(cardData.attributes).forEach(function (attribute) {
    //     var listItem = document.createElement('li');
    //     listItem.innerHTML = `<strong>${attribute}:</strong> ${cardData.attributes[attribute]}`;
    //     attributesList.appendChild(listItem);
    // });

    // Build card body
    cardDetails.appendChild(cardType);
    cardDetails.appendChild(rarity);
    cardDetails.appendChild(manaCost);
    cardDetails.appendChild(attributesList);

    // Append elements to card content
    cardContent.appendChild(cardHeader);
    cardContent.appendChild(cardImage);
    cardContent.appendChild(cardDetails);

    // Append card content to card container
    cardContainer.appendChild(cardContent);

    return cardContainer;

}

