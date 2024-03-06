// Function to create a trading card
async function createTradingCard(cardInformation) {

    cardData = cardInformation;

    console.log("This is what's being passsed to createTradingCard:", cardData);

    // Card container
    var card = document.createElement('div');
    card.classList.add('card');

    // cardId
    // var cardId = document.createElement('p');
    // cardId.textContent = cardData.cardId;

    // Tooltip for attributes
    // var toolTip = document.createElement('div');
    // toolTip.classList.add('toolTip');

    // var toolTipText = document.createElement('span');
    // toolTipText.classList.add('toolTipText');

    // Name
    var cardName = document.createElement('h1');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.name;

    // Text overlays
    var textOverlayBottom = document.createElement('div');
    textOverlayBottom.classList.add('textOverlayBottom');

    var textOverlayTop = document.createElement('div');
    textOverlayTop.classList.add('textOverlayTop');

    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.URL;
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

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>ATK:</strong> ${cardData.attack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>DEF:</strong> ${cardData.defense}`;

        textOverlayBottom.appendChild(spellType);
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
    // textOverlayTop.appendChild(rarity);

    card.appendChild(textOverlayBottom);
    card.appendChild(cardImage);
    // card.appendChild(textOverlayBottom);
    card.appendChild(textOverlayTop);

    // card.appendChild(toolTip);

    // return card;
    const cardContainer = document.getElementById('cardContainer');

    cardContainer.appendChild(card);
}

// Example fetch request
async function fetchCreateTradingCard() {
    // try {
    // Get the query parameters from the URL
    const urlSearchParams = new URLSearchParams(window.location.search);
    console.log("urlSearchParams:", urlSearchParams);
    const params = Object.fromEntries(urlSearchParams.entries());
    let newParams = params.cardstring;
    console.log("newParams:", newParams);

    fetch('/cardViewPrintedPagePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: newParams,
    })
    .then(response => response.json())
    .then(data => {
        data.cards.forEach(element => {
            console.log("element:", element);
            createTradingCard(element);
        });
        console.log("Data from then fetch:", data);
    })
    .catch(error => {
        console.error('Error fetching card details:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Call the fetchCreateTradingCard function
    console.log("what");
    fetchCreateTradingCard();
});