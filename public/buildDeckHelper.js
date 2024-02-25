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

// Assuming you have an event listener for the change event on the dropdown
document.getElementById('deckDropdown').addEventListener('change', loadDeck);

function loadDeck() {
    const dropdown = document.getElementById('deckDropdown');
    const selectedDeckId = dropdown.value;  // Get the selected value directly

    console.log("selected deck id:", selectedDeckId);

    fetch('/deckCards', {
        method: 'POST',
        body: JSON.stringify({ deckId: selectedDeckId }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(deckDetails => {
            const stagingArea = document.getElementById('stagingArea');
            stagingArea.textContent = JSON.stringify(deckDetails, null, 2);

            sessionStorage.setItem('deckId', selectedDeckId);
        })
        .catch(error => console.error('Error fetching deck details:', error));
}


function updateStagingArea() {
    // Retrieve the deckId from sessionStorage
    const deckId = sessionStorage.getItem('deckId');

    // Check if deckId is present in sessionStorage
    if (!deckId) {
        console.error('Deck ID not found in sessionStorage');
        return; // Abort updating staging area if deckId is not found
    }

    // Fetch cardIds associated with the deckId (Replace this with your actual logic)
    const cardIds = fetchCardIdsFromServer(deckId);

    // Assuming you have a staging area container with an id of 'stagingArea'
    const stagingArea = document.getElementById('stagingArea');

    // Clear existing content
    stagingArea.innerHTML = '';

    // Update with new content based on deckId and cardIds
    // Add your logic to create and append elements as needed
    // For example, you might create divs for each card and append them to the staging area
    cardIds.forEach(cardId => {
        const cardElement = document.createElement('div');
        cardElement.textContent = cardId;
        stagingArea.appendChild(cardElement);
    });
}

// Example function to fetch cardIds from the server
async function fetchCardIdsFromServer(deckId) {
    try {
        console.log("TEST TEST TEST")
        // Make a fetch request to your server endpoint
        const response = await fetch(`/deckCards`);
        console.log("TEST TEST TEST")
        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Failed to fetch cardIds. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server Response:', data);

        // Return the cardIds from the server response
        return data.cardIds; // Adjust the property name based on your server response
    } catch (error) {
        console.error('Error fetching cardIds:', error.message);
        return []; // Return an empty array or handle the error as needed
    }
}

// Call the updateStagingArea function when the page loads or when needed
updateStagingArea();
