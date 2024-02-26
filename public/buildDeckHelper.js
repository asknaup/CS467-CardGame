const cardsPerRow = 6;

async function loadDeck() {
    const dropdown = document.getElementById('deckDropdown');
    const selectedDeckId = dropdown.value;

    // Check if the selected option is "new_deck"
    if (selectedDeckId === 'new_deck') {
        // Clear the staging area and do any other necessary resets
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

// Function to clear the staging area
function clearStagingArea() {
    const stagingArea = document.getElementById('stagingArea');
    stagingArea.innerHTML = ''; // Clear existing content
    initialCardIds = []; // Clear the initial card ids
    // Additional logic to reset any other related variables or states
}

// Updated function to create a trading card based on getCardInfo output
function createTradingCardFromInfo(cardInfo) {

    console.log('Creating Card Element (cardInfo[0]):', cardInfo[0]);

    var card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;

    // const cardElement = row.querySelector(`[data-card-id="${cardId}"]`);

    // card.innerHTML = cardElement.outerHTML;

    var cardId = document.createElement('p');
    cardId.textContent = cardInfo[0].cardId;

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
    manaCost.innerHTML = `<strong>Mana Cost:</strong> ${cardInfo[0].manaCost}`;

    textOverlayBottom.appendChild(rarity);
    textOverlayBottom.appendChild(manaCost);

    if (cardInfo[0].cardType == "Spell") {
        var spellType = document.createElement('p');
        spellType.innerHTML = `<strong>Spell Type:</strong> ${cardInfo[0].spellType}`;

        var spellAbility = document.createElement('p');
        spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardInfo[0].spellAbility}`;

        var spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardInfo[0].spellAttack}`;

        var spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardInfo[0].spellDefense}`;

        textOverlayBottom.appendChild(spellType);
        textOverlayBottom.appendChild(spellAbility);
        textOverlayBottom.appendChild(spellAttack);
        textOverlayBottom.appendChild(spellDefense);
    } else {
        var attack = document.createElement('p');
        attack.innerHTML = `<strong>Attack:</strong> ${cardInfo[0].attack}`;

        var defense = document.createElement('p');
        defense.innerHTML = `<strong>Defense:</strong> ${cardInfo[0].defense}`;

        textOverlayBottom.appendChild(attack);
        textOverlayBottom.appendChild(defense);
    }

    textOverlayTop.appendChild(cardName);
    textOverlayTop.appendChild(cardType);

    card.appendChild(textOverlayBottom);
    card.appendChild(cardImage);
    card.appendChild(textOverlayTop);

    return card;
}

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

let selectedCards = [];

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

document.addEventListener('DOMContentLoaded', function () {
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');

    // Assuming you have an event listener for the change event on the dropdown
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
        alert('Your deck has been saved!');
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

// Example function to fetch the deckId from the server

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

        // Try to parse the response as JSON
        const data = JSON.parse(dataText);
        return data;
    } catch (error) {
        console.error('Error fetching cardIds:', error.message);
        return []; // Return an empty array or handle the error as needed
    }
}

// Updated getCardData function
async function getCardData(selectedDeck) {
    try {
        // Use the initial cardIds when the page is loaded
        const cardIds = initialCardIds;
        console.log("getCardData card id check", cardIds);

        // Check if cardIds is defined before proceeding
        if (!cardIds || !Array.isArray(cardIds)) {
            console.error('CardIds is undefined, null, or not an array.');
            return null;  // or return some default value
        }

        // Use Promise.all to wait for all asynchronous calls to complete
        const cardPromises = cardIds.map(async (cardId) => {
            const cardData = await getCardInfo(cardId, selectedDeck);  // Pass selectedDeck here
            return cardData; // Assuming you only expect one result per cardId
        });

        // Resolve all promises and get the card data
        const cardDataArray = await Promise.all(cardPromises);

        return cardDataArray;
    } catch (error) {
        // Handle errors if any of the promises are rejected
        console.error("Error fetching card data:", error);
        return null; // or return some default value
    }
}

// async function updateStagingAreaFromInfo() {
//     try {
//         // Fetch the deckId from the server (Replace this with your actual logic)
//         const deckId = await fetchDeckIdFromServer();

//         // Check if deckId is present
//         if (!deckId) {
//             console.error('Deck ID not found');
//             return;
//         }

//         // Fetch cardIds associated with the deckId
//         const cardIds = await fetchCardIdsFromServer(deckId);

//         // Assuming you have a staging area container with an id of 'stagingArea'
//         const stagingArea = document.getElementById('stagingArea');

//         // Clear existing content
//         stagingArea.innerHTML = '';

//         // Update with new content based on deckId and cardIds
//         // Add your logic to create and append elements as needed
//         // For example, you might create divs for each card and append them to the staging area
//         if (cardIds) {
//             cardIds.forEach(async (cardId) => {
//                 // Fetch card info for each cardId
//                 const cardInfo = await getCardInfo(cardId);

//                 // Create trading card element from cardInfo
//                 const cardElement = createTradingCardFromInfo(cardInfo);

//                 // Append cardElement to the staging area
//                 stagingArea.appendChild(cardElement);
//             });
//         }
//     } catch (error) {
//         console.error('Error updating staging area:', error);
//     }
// }

async function updateStagingAreaFromInfo() {
    try {
        // Fetch the deckId from the server (Replace this with your actual logic)
        const deckId = await fetchDeckIdFromServer();

        // Check if deckId is present
        if (!deckId) {
            console.error('Deck ID not found');
            return;
        }

        // Fetch cardIds associated with the deckId
        const cardIds = await fetchCardIdsFromServer(deckId);

        // Assuming you have a staging area container with an id of 'stagingArea'
        const stagingArea = document.getElementById('stagingArea');

        // Clear existing content
        stagingArea.innerHTML = '';

        // Update with new content based on deckId and cardIds
        // Add your logic to create and append elements as needed
        // For example, you might create divs for each card and append them to the staging area
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

async function updateStagingArea() {
    try {
        // Fetch the deckId from the server (Replace this with your actual logic)
        const deckId = await fetchDeckIdFromServer();

        // Check if deckId is present
        if (!deckId) {
            console.error('Deck ID not found');
            return;
        }

        // Fetch cardIds associated with the deckId
        initialCardIds = await fetchCardIdsFromServer(deckId);

        // Assuming you have a staging area container with an id of 'stagingArea'
        const stagingArea = document.getElementById('stagingArea');

        // Clear existing content
        stagingArea.innerHTML = '';

        // Update with new content based on deckId and cardIds
        // Create and append elements using createTradingCardFromInfo function
        if (initialCardIds) {
            initialCardIds.forEach(async cardId => {
                // Fetch card information using getCardInfo
                const cardInfo = await getCardInfo(cardId);
                // Create card element using createTradingCardFromInfo
                const cardElement = createTradingCardFromInfo(cardInfo);
                stagingArea.appendChild(cardElement);
            });
        }
    } catch (error) {
        console.error('Error updating staging area:', error);
    }
}

updateStagingArea();
