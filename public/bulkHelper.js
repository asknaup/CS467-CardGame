// Function to create a trading card
function createTradingCard(cardData) {

    console.log("This is what's being passsed to createTradingCard:", cardData);

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

// Example fetch request
async function fetchCreateTradingCard() {
    try {
        // Move the declaration of cardData here
        let cardData;

        const response = await fetch('/cardViewPrintedPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: null
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        cardData = await response.json();

        // Assuming cardData contains the data you want to pass to createTradingCard
        const card = createTradingCard(cardData);

        // Append the card to the document or do any other necessary operations
        document.body.appendChild(card);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the fetchCreateTradingCard function
fetchCreateTradingCard();