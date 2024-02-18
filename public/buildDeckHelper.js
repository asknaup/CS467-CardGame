document.addEventListener('DOMContentLoaded', function () {
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');

    const cardsPerRow = 6;

    let selectedCards = [];

    // Fetch user's cards from the server
    fetch('/cards')
        .then(response => response.json())
        .then(userCards => {

            updateCardDisplay(userCards);

            function updateCardDisplay(userCards) {
                // Clear existing cards
                cardContainer.innerHTML = '';

                // Display all cards in the carousel dynamically with no more than 7 cards per row
                const cardIds = Object.keys(userCards);
                const totalCards = cardIds.length;

                let currentRow;

                cardIds.forEach((cardId, index) => {
                    if (index % cardsPerRow === 0) {
                        currentRow = document.createElement('div');
                        currentRow.classList.add('carouselRow');
                        cardContainer.appendChild(currentRow);
                    }

                    const card = userCards[cardId];
                    const cardElement = createTradingCard(card);
                    cardElement.dataset.cardId = cardId;
                    cardElement.draggable = true;
                    cardElement.addEventListener('click', () => selectCard(cardId));

                    currentRow.appendChild(cardElement);
                });
            }

            function selectCard(cardId) {
                const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

                if (selectedCards.includes(cardId)) {
                    // Card is already selected, remove it from the selected cards array
                    const selectedCardIndex = selectedCards.indexOf(cardId);
                    selectedCards.splice(selectedCardIndex, 1);

                    // Check if the card is in the staging area
                    const stagingRows = document.querySelectorAll('.staging-row');
                    stagingRows.forEach(row => {
                        const stagedCardElement = row.querySelector(`[data-card-id="${cardId}"]`);
                        if (stagedCardElement) {
                            row.removeChild(stagedCardElement);
                            // Append the card back to the cardContainer
                            cardContainer.appendChild(cardElement);
                            // Add the card to the carousel row
                            const carouselRow = document.querySelector('.carouselRow');
                            carouselRow.appendChild(cardElement);
                        }
                    });
                } else {
                    // Card is not selected, add it to the selected cards array
                    selectedCards.push(cardId);

                    // Check if the card is in the carousel
                    const carouselRows = document.querySelectorAll('.carouselRow');
                    carouselRows.forEach(row => {
                        const carouselCardElement = row.querySelector(`[data-card-id="${cardId}"]`);
                        if (carouselCardElement) {
                            // Remove the card from the carousel
                            row.removeChild(carouselCardElement);

                            // Ensure only 6 cards are displayed in each row in the staging area horizontally
                            const stagingRows = document.querySelectorAll('.staging-row');
                            let lastRow = stagingRows[stagingRows.length - 1];

                            if (!lastRow || lastRow.childElementCount >= cardsPerRow) {
                                // Create a new row if the last one is full or doesn't exist
                                lastRow = document.createElement('div');
                                lastRow.classList.add('staging-row');
                                stagingArea.appendChild(lastRow);
                            }

                            lastRow.appendChild(cardElement);
                        }
                    });
                }
            }



        });

    // Function to save the deck
    function saveDeck(selectedCards) {
        // Create an array to store card data
        const deckData = [];

        // Iterate over each selected card and extract relevant data
        selectedCards.forEach(cardId => {
            const cardData = {};

            // Extract cardId from selectedCards array
            cardData.cardId = cardId;

            // Add card data to the array
            deckData.push(cardData);
        });

        // Prompt the user to enter a name for the deck
        const deckName = prompt('Enter a name for the deck:');

        if (deckName) {
            // Create a JSON representation of the deck data
            const jsonDeck = JSON.stringify({ deckName, cards: deckData });

            // Log or use the JSON deck data as needed
            console.log(jsonDeck);
        }
    }

    // Attach the saveDeck function to the button click event
    const saveDeckButton = document.getElementById('saveDeckButton');
    if (saveDeckButton) {
        saveDeckButton.addEventListener('click', () => saveDeck(selectedCards));
    }

    // ... (Your existing code)

});


// Function to create a trading card
function createTradingCard(cardData) {
    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Card content
    var cardContent = document.createElement('div');
    cardContent.classList.add('cardContent');

    // Card header
    var cardHeader = document.createElement('div');

    // cardId
    var cardId = document.createElement('p');
    cardId.textContent = cardData.cardId;

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
    manaCost.innerHTML = `<strong>Mana Cost:</strong> ${cardData.manaCost}`;

    var attributesList = document.createElement('ul');
    attributesList.classList.add('attributes');

    if (cardData.cardType == "spell") {
        var spellType = document.createElement('li');
        spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

        var spellAbility = document.createElement('li');
        spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardData.spellAbility}`;

        var spellAttack = document.createElement('li');
        spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('li');
        spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.spellDefense}`;

        attributesList.appendChild(spellType);
        attributesList.appendChild(spellAbility);
        attributesList.appendChild(spellAttack);
        attributesList.appendChild(spellDefense);
    }

    var attack = document.createElement('li');
    attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

    var defense = document.createElement('li');
    defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

    attributesList.appendChild(attack);
    attributesList.appendChild(defense);

    // Build card body
    cardDetails.appendChild(cardId);
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

