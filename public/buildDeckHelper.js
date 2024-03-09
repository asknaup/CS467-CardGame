const cardsPerRow = 6;

// Deck dropdown pull in 
async function loadDeck() {
    const dropdown = document.getElementById('deckDropdown');
    const selectedDeckId = dropdown.value;

    // Check if the selected option is "new_deck"
    if (selectedDeckId === 'new_deck') {
        // Clear the staging area
        clearStagingArea();
        return;
    }

    try {
        // Fetch cardIds associated with the selected deckId
        const newCardIds = await fetchCardIdsFromServer(selectedDeckId);

        // Update the initialCardIds array with the new cardIds
        initialCardIds = newCardIds;

        // Fetch deck details
        const deckDetails = await fetch('/deckCards', {
            method: 'POST',
            body: JSON.stringify({ deckId: selectedDeckId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Call the function to update the staging area
        const cardData = await getCardData();
        updateStagingArea(cardData);
    } catch (error) {
        console.error('Error loading deck:', error);
    }
}

// Clears the staging area
function clearStagingArea() {
    const stagingArea = document.getElementById('stagingArea');
    stagingArea.innerHTML = ''; // Clear existing content
    initialCardIds = []; // Clear the initial card ids
}

// Create a trading card based on getCardInfo output
function createTradingCardFromInfo(cardInfo) {

    console.log(cardInfo);
    console.log('Creating Card Element (cardInfo[0]):', cardInfo[0]);

    // Create HTML elements and append in order
    var card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;

    var cardId = document.createElement('p');

    if (cardInfo[0]) {
        cardId.textContent = cardInfo[0].cardId;
    }

    var cardName = document.createElement('h1');
    cardName.classList.add('cardName');
    cardName.textContent = cardInfo[0].cardName;

    console.log("card name output", cardInfo[0].cardName);

    var textOverlayBottom = document.createElement('div');
    textOverlayBottom.classList.add('textOverlayBottom');

    var textOverlayTop = document.createElement('div');
    textOverlayTop.classList.add('textOverlayTop');

    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardInfo[0].imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    var cardType = document.createElement('p');
    cardType.classList.add('cardType');
    cardType.textContent = cardInfo[0].cardType;

    var rarity = document.createElement('p');
    rarity.textContent = cardInfo[0].rarity;

    var manaCost = document.createElement('p');
    manaCost.innerHTML = `<strong>Mana:</strong> ${cardInfo[0].manaCost}`;

    textOverlayBottom.appendChild(manaCost);

    if (cardInfo[0].cardType == "Spell") {
        var spellType = document.createElement('p');
        spellType.innerHTML = `<strong>Type:</strong> ${cardInfo[0].spellType}`;

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>ATK:</strong> ${cardInfo[0].spellAttack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>DEF:</strong> ${cardInfo[0].spellDefense}`;

        textOverlayBottom.appendChild(spellType);
        textOverlayBottom.appendChild(spellAttack);
        textOverlayBottom.appendChild(spellDefense);
    } else {
        var attack = document.createElement('p');
        attack.innerHTML = `<strong>ATK:</strong> ${cardInfo[0].attack}`;

        var defense = document.createElement('p');
        defense.innerHTML = `<strong>DEF:</strong> ${cardInfo[0].defense}`;

        textOverlayBottom.appendChild(attack);
        textOverlayBottom.appendChild(defense);
    }

    textOverlayTop.appendChild(cardName);
    textOverlayTop.appendChild(cardType);
    textOverlayTop.appendChild(rarity);

    card.appendChild(textOverlayBottom);
    card.appendChild(cardImage);
    card.appendChild(textOverlayTop);

    return card;
}

// Updatae the display of cardContainer
function updateCardDisplay(userCards) {
    // Clear existing cards
    cardContainer.innerHTML = '';

    // Display all cards in the carousel dynamically 
    const cardIds = Object.keys(userCards);

    let currentRow;

    // Create divs for each card
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

// Create a trading card HTML object
function createTradingCard(cardData) {
    
    var card = document.createElement('div');
    card.classList.add('card');

    var cardId = document.createElement('p');
    cardId.textContent = cardData.cardId;

    var cardName = document.createElement('h1');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.cardName;

    var textOverlayBottom = document.createElement('div');
    textOverlayBottom.classList.add('textOverlayBottom');

    var textOverlayTop = document.createElement('div');
    textOverlayTop.classList.add('textOverlayTop');

    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    var cardType = document.createElement('p');
    cardType.classList.add('cardType');
    cardType.textContent = cardData.cardType;

    var rarity = document.createElement('p');
    rarity.textContent = cardData.rarity;

    var manaCost = document.createElement('p');
    manaCost.innerHTML = `<strong>Mana:</strong> ${cardData.manaCost}`;

    textOverlayBottom.appendChild(manaCost);

    if (cardData.cardType == "Spell") {
        var spellType = document.createElement('p');
        spellType.innerHTML = `<strong>Type:</strong> ${cardData.spellType}`;

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>ATK:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>DEF:</strong> ${cardData.spellDefense}`;

        textOverlayBottom.appendChild(spellType);
        textOverlayBottom.appendChild(spellAttack);
        textOverlayBottom.appendChild(spellDefense);

    } else {
        var attack = document.createElement('p');
        attack.innerHTML = `<strong>ATK:</strong> ${cardData.attack}`;

        var defense = document.createElement('p');
        defense.innerHTML = `<strong>DEF:</strong> ${cardData.defense}`;

        textOverlayBottom.appendChild(attack);
        textOverlayBottom.appendChild(defense);
    }

    textOverlayTop.appendChild(cardName);
    textOverlayTop.appendChild(cardType);
    textOverlayTop.appendChild(rarity);

    card.appendChild(textOverlayBottom);
    card.appendChild(cardImage);
    card.appendChild(textOverlayTop);

    return card;
}

let selectedCards = [];

// User card selection action in either stagingArea or cardContainer
function selectCard(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');

    if (selectedCards.includes(cardId)) {
        // Card is already selected, remove it from the selected cards array
        const selectedCardIndex = selectedCards.indexOf(cardId);
        selectedCards.splice(selectedCardIndex, 1);

        // Move the card back to the cardContainer
        cardContainer.appendChild(cardElement);
    } else {
        // Card is not selected, add it to the selected cards array
        selectedCards.push(cardId);

        // Move the card to the staging area
        stagingArea.appendChild(cardElement);
    }
}


document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('deckDropdown').addEventListener('change', loadDeck);

    loadDeck();
    updateStagingArea();

    // Fetch user's cards from the server
    fetch('/cards')
        .then(response => response.json())
        .then(userCards => {
            updateStagingAreaFromInfo(userCards);
            updateCardDisplay(userCards);

        });

    function saveDeck() {
        // Get all card elements in the staging area
        const stagingCards = document.querySelectorAll('.stagingArea .card');

        // Create an array to store card data
        const deckData = [];

        // Iterate over each card in the staging area and extract relevant data
        stagingCards.forEach(cardElement => {
            const cardId = cardElement.dataset.cardId;
            deckData.push(parseInt(cardId));
        });

        // Prompt the user to enter a name for the deck
        const deckName = prompt('Enter a name for the deck:');

        if (deckName) {
            // Create a JSON representation of the deck data
            const jsonDeck = JSON.stringify({ deckName, cards: deckData });

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
                    console.log('Server response:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
        alert('Your deck has been saved!');
    }

    function clearStagingArea() {
        const stagingArea = document.getElementById('stagingArea');
        stagingArea.innerHTML = ''; // Clear existing content
    }

    // Attach saveDeck function to button click event
    const saveDeckButton = document.getElementById('saveDeckButton');
    if (saveDeckButton) {
        saveDeckButton.addEventListener('click', () => saveDeck(selectedCards));
    }

    clearStagingArea();
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

async function fetchDeckIdFromServer() {
    try {
        const response = await fetch('/getDeckId');  // Replace with your actual endpoint
        const data = await response.json();
        return data.deckId;  // Adjust based on your server response structure
    } catch (error) {
        console.error('Error fetching deckId:', error.message);
        return null;
    }
}

async function fetchCardIdsFromServer(deckId) {
    try {
        const response = await fetch(`/getCardsForDeck?deckId=${deckId}`);
        const dataText = await response.text();

        // Parse the response as JSON
        const data = JSON.parse(dataText);
        return data;
    } catch (error) {
        console.error('Error fetching cardIds:', error.message);
        return []; // Return an empty array or handle the error as needed
    }
}

// Retrieves card parameters for saved deck selected from dropdown
async function getCardData(selectedDeck) {
    try {
        // Use the initial cardIds when the page is loaded
        const cardIds = initialCardIds;
        console.log("getCardData card id check", cardIds);

        // Check if cardIds is defined before proceeding
        if (!cardIds || !Array.isArray(cardIds)) {
            console.error('CardIds is undefined, null, or not an array.');
            return null;  
        }

        // Use Promise.all to wait for all asynchronous calls to complete
        const cardPromises = cardIds.map(async (cardId) => {
            const cardData = await getCardInfo(cardId, selectedDeck); 
            return cardData; 
        });

        // Resolve all promises and get the card data
        const cardDataArray = await Promise.all(cardPromises);

        return cardDataArray;
    } catch (error) {
        // Handle errors if any of the promises are rejected
        console.error("Error fetching card data:", error);
        return null; 
    }
}

// Staging area dynamic visualization
async function updateStagingAreaFromInfo() {
    try {
        // Fetch the deckId from the server
        const deckId = await fetchDeckIdFromServer();

        // Check if deckId is present
        if (!deckId) {
            console.error('Deck ID not found');
            return;
        }

        // Fetch cardIds associated with the deckId
        const cardIds = await fetchCardIdsFromServer(deckId);

        const stagingArea = document.getElementById('stagingArea');

        // Clear existing cards
        stagingArea.innerHTML = '';

        // Update with new cards based on deckId and cardIds
        if (cardIds) {
            cardIds.forEach(async (cardId) => {
                // Fetch card info for each cardId
                const cardInfo = await getCardInfo(cardId);

                // Create trading card element from cardInfo
                const cardElement = createTradingCardFromInfo(cardInfo);

                // Set data-card-id attribute
                cardElement.setAttribute('data-card-id', cardId);

                // Append cardElement to the staging area
                stagingArea.appendChild(cardElement);
            });
        }
    } catch (error) {
        console.error('Error updating staging area:', error);
    }
}

// Retrieve card parameters based on card id and deck id
async function getCardInfo(cardId, selectedDeck) {
    try {
        const response = await fetch('/getCardInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId: cardId, selectedDeck: selectedDeck }),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching card info:', error.message);
        return null;
    }
}

let initialCardIds = [];

// Handle updating staging area dynamically with multiple deck scenarios
async function updateStagingArea() {
    try {
        // Fetch the deckId from the server
        const deckId = await fetchDeckIdFromServer();

        // Check if deckId is present
        if (!deckId) {
            console.error('Deck ID not found');
            return;
        }

        // Fetch cardIds associated with the deckId
        initialCardIds = await fetchCardIdsFromServer(deckId);

        const stagingArea = document.getElementById('stagingArea');

        // Clear existing cards
        stagingArea.innerHTML = '';

        // Update with new cards based on deckId and cardIds
        // Create and append elements using createTradingCardFromInfo function
        if (initialCardIds) {
            initialCardIds.forEach(async cardId => {
                // Fetch card information using getCardInfo
                const cardInfo = await getCardInfo(cardId);

                // Create card element using createTradingCardFromInfo
                const cardElement = createTradingCardFromInfo(cardInfo);

                // Set data-card-id attribute
                cardElement.setAttribute('data-card-id', cardId);

                // Append cardElement to the staging area
                stagingArea.appendChild(cardElement);

                // Attach the selectCard function to the card element
                cardElement.addEventListener('click', () => selectCard(cardId));
            });
        }
    } catch (error) {
        console.error('Error updating staging area:', error);
    }
}

// Function to update existing deck with user selection edits
function updateDeck(selectedCards, deckId) {
    // Create an array to store card data
    const deckData = [];

    // Iterate over each selected card and extract relevant data
    selectedCards.forEach(cardId => {
        deckData.push(parseInt(cardId));
    });

    // Create a JSON representation of the updated deck data
    const jsonDeck = JSON.stringify({ deckId, cards: deckData });

    // Send a request to update the existing deck in the database
    fetch('/updateDeck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonDeck
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

    alert('Your deck has been updated!');
}

// Attach the updateDeck function to the button click event
const updateDeckButton = document.getElementById('updateDeckButton');
if (updateDeckButton) {
    updateDeckButton.addEventListener('click', () => {
        const deckDropdown = document.getElementById('deckDropdown');
        const selectedDeckId = deckDropdown.value;
        updateDeck(selectedCards, selectedDeckId);
    });
}

updateStagingArea();
