document.addEventListener('DOMContentLoaded', function () {
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');

    const cardsPerRow = 6;

    let selectedCards = [];

    // Function to create a trading card
    function createTradingCard(cardData) {
        // Card container
        var card = document.createElement('div');
        card.classList.add('card');

        // cardId
        var cardId = document.createElement('p');
        cardId.textContent = cardData.cardId;

        // Tooltip for attributes
        var toolTip = document.createElement('div');
        toolTip.classList.add('toolTip');

        var toolTipText = document.createElement('span');
        toolTipText.classList.add('toolTipText');

        // Name
        var cardName = document.createElement('h1');
        cardName.classList.add('cardName');
        cardName.textContent = cardData.cardName;

        var textOverlay = document.createElement('div');
        textOverlay.classList.add('textOverlay');

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

        toolTipText.appendChild(rarity);
        toolTipText.appendChild(manaCost);

        if (cardData.cardType == "Spell") {
            var spellType = document.createElement('p');
            spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

            var spellAbility = document.createElement('p');
            spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardData.spellAbility}`;

            var spellAttack = document.createElement('p');
            spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.spellAttack}`;

            var spellDefense = document.createElement('p');
            spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.spellDefense}`;

            toolTipText.appendChild(spellType);
            toolTipText.appendChild(spellAbility);
            toolTipText.appendChild(spellAttack);
            toolTipText.appendChild(spellDefense);
        } else {
            var attack = document.createElement('p');
            attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

            var defense = document.createElement('p');
            defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

            toolTipText.appendChild(attack);
            toolTipText.appendChild(defense);
        }

        toolTip.appendChild(toolTipText);
        textOverlay.appendChild(cardName);
        textOverlay.appendChild(cardType);
        card.appendChild(cardImage);
        card.appendChild(textOverlay);

        card.appendChild(toolTip);

        return card;
    }

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
                            // Ensure only 6 cards are displayed in each row in the staging area horizontally
                            const carouselRow = document.querySelectorAll('.carouselRow');
                            let lastRow = carouselRow[carouselRow.length - 1];

                            if (!lastRow || lastRow.childElementCount >= cardsPerRow) {
                                // Create a new row if the last one is full or doesn't exist
                                lastRow = document.createElement('div');
                                lastRow.classList.add('carouselRow');
                                cardContainer.appendChild(lastRow);
                            }

                            lastRow.appendChild(cardElement);
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
            // cardData.cardId = cardId;

            // Add card data to the array
            deckData.push(parseInt(cardId));
        });

        // Prompt the user to enter a name for the deck
        const deckName = prompt('Enter a name for the deck:');

        if (deckName) {
            // Create a JSON representation of the deck data
            const jsonDeck = JSON.stringify({ deckName, cards: deckData });

            // Log or use the JSON deck data as needed
            // console.log(jsonDeck);
            fetch('/decksubmitted', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deckName: deckName, deckList: deckData })
            })

                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    // Handle the response from the server if needed
                    console.log('Server response:', data);
                })
                .catch(error => {
                    // Handle errors that may occur during the request
                    console.error('Error:', error);
                });
        }
    }

    // Attach the saveDeck function to the button click event
    const saveDeckButton = document.getElementById('saveDeckButton');
    if (saveDeckButton) {
        saveDeckButton.addEventListener('click', () => saveDeck(selectedCards));
    }
});

function confirmReset() {
    var userConfirmation = confirm("Are you sure you want to reset the deck build? This will unstage all cards without saving any changes.");

    // Check user's response
    if (userConfirmation) {
        // If the user confirms, reload the page
        location.reload();
    } else {
        console.log("Reset canceled by the user.");
    }
}
