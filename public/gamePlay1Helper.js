// gamePlay1Helper.js
// Game play for RuleSet 1
// Client Side Javascript

// Defined globally
function dragStart(event) {

    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const cardElements = Array.from(document.querySelectorAll('.card-container.card.player'))
    const cardElement = cardElements.find(card => parseInt(card.id) === parseInt(cardId))
    // const dropZone = event.target;
    const dropZone = event.target.closest('.drop-zone');
    const existingCard = dropZone.querySelector('.card');
    if (!existingCard) {
        // If the drop zone is empty, play the card in the drop zone
        console.log("dropedCard", cardId, cardElement)
        handleEmptyDropZone(cardId, cardElement, dropZone);
    } else {
        handleExistingCardDrop(cardElement, dropZone);
    }
}

function handleEmptyDropZone(cardId, cardElement, dropZone) {
    const owner = cardElement.classList.contains('player') ? 'player' : 'opponent';
    fetch(`/getCardHandDetails?cardId=${parseInt(cardId)}&owner=${owner}`)
        .then(response => response.json())
        .then(cardData => {
            console.log("cardData", cardData)
            if (cardData.type.toLowerCase() === 'creature') {

                if (cardElement.classList.contains('player') && dropZone.parentElement.classList.contains('opponent')) {
                    // Attack the opponent
                    attackCardToOpponent(parseInt(cardId), dropZone);
                } else if (cardElement.classList.contains('player') && dropZone.parentElement.classList.contains('player')) {
                    // Play the card in the player's drop zone
                    playCard(cardElement, dropZone);
                }
            } else if (cardData.type.toLowerCase() === 'spell') {
                handleSpellCardDrop(cardData, dropZone);  // TODO: Implement this function
            } else {
                displayErrorMessage('Error: Only creature cards and spell cards can be played in this zone', dropZone.id);
            }
        })
        .catch(error => {
            console.error('Error fetching card details:', error);
        });
}

function handleExistingCardDrop(cardElement, dropZone) {
    const dropZoneId = dropZone.id;
    const cardElement = dropZone.querySelector('.card');

    fetch(`/getCardDetails?cardId=${parseInt(cardElement.id)}`)
        .then(response => response.json())
        .then(cardData => {
            if (cardData.type.toLowerCase() === 'spell') {
                applySpellEffect(cardData, dropZone);
                fetchAndRenderHand();
            } else {
                displayErrorMessage('Error: Only spell cards can be applied to existing creature cards', dropZoneId);
            }
        })
        .catch(error => {
            console.error('Error fetching card details:', error);
        });
}

function attackCardToOpponent(cardId, dropZone) {
    fetch('/attackCardToOpponent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, dropZoneId: dropZone.id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'card played successfully') {
                // Move the card from hand to the drop zone
                const cardElement = document.getElementById(cardId);
                cardElement.classList.add('greyed-out');
                dropZone.appendChild(cardElement);

                // Update player's mana UI
                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;
            } else if (data.message === 'Insufficient mana to play this card.') {
                // Display an error message for insufficient mana
                const dropZoneId = dropZone.id;
                displayErrorMessage('Error: Insufficient mana to play this card', dropZoneId);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error attacking the opponent:', error);
        });
}

function handleSpellCardDrop(spellCard, dropZone) {

    if (spellCard.ability.toLowerCase() === 'buff') {
        if (dropZone.parentElement.classList.contains('staging')) {
            displayErrorMessage('Error: Cannot play Spell card in staging area. Must be applied to player or Creature card', dropZone.id);
        } else if (spellCard.ability.toLowerCase() === 'debuff') {
            applySpellEffect(spellCard, dropZone);
            fetchAndRenderHand();

        } else {
            applySpellEffect(spellCard, dropZone);  // TODO: Implement this function
            fetchAndRenderHand();
        }
    }
}

function playCard(cardElement, dropZone) {
    fetch('/playCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId: parseInt(cardElement.id)}),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'card played successfully') {
                // Move the card from hand to the drop zone
                cardElement.classList.add('greyed-out');
                dropZone.appendChild(cardElement);

                // Update player's mana UI
                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;
            } else if (data.message === 'Insufficient mana to play this card.') {
                // Display an error message for insufficient mana
                const dropZoneId = dropZone.id;
                displayErrorMessage('Error: Insufficient mana to play this card', dropZoneId);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error playing the card:', error);
        });
}

function fetchAndRenderStagingArea() {
    fetch('/getPlayerStage')
        .then(response => response.json())
        .then(data => {
            // Render the staging area data on the UI
            renderStagingArea(data.playerStage);
        })
        .catch(error => {
            console.error('Error fetching staging area data:', error);
        });
}

function fetchAndRenderOpponentStage() {
    fetch('/getOpponentStage')
        .then(response => response.json())
        .then(data => {
            console.log('opponentStage:', data.opponentStage[0])
            // Render the opponent's staging area data on the UI
            renderOpponentStage(data.opponentStage);
        })
        .catch(error => {
            console.error('Error fetching opponent\'s staging area data:', error);
        });
}

function renderStagingArea(stagingAreaData) {
    // Update the player's staging area UI
    stagingAreaData.forEach(card => {
        // const cardElement = document.querySelector('#stagingArea > div#' + card.id.toString());
        const parentElement = document.getElementById('stagingArea');
        const childElement = parentElement.querySelector(`[id="${card.id}"]`);

        if (childElement) {
            const cardId = childElement.id;
            cardId.textContent = card.id;
        } else {
            console.log("Card not found in staging area");
        }
    }
    )
}

function renderOpponentStage(opponentStageData) {
    // Assuming opponentStage is an array of card IDs
    const dropZones = document.querySelectorAll('.opponent .drop-zone');
    const emptyDropZones = [];
    const fullDropZones = [];

    dropZones.forEach(dropZone => {
        const cardElement = dropZone.querySelector('.card');
        if (!cardElement) {
            emptyDropZones.push(dropZone.id); // Add drop zone ID to the emptyDropZones array if no card is found
        } else {
            fullDropZones.push(dropZone.id); // Add drop zone ID to the emptyDropZones array if no card is found
        }
    });

    // Test if card in fullDropZone is in opponentStageData
    // If not, remove card from dropZone 
    // If so, update cardElement with corresponding cardData
    fullDropZones.forEach(dropZone => {
        const cardElement = document.getElementById(dropZone).querySelector('.card');
        const cardId = cardElement ? parseInt(cardElement.id) : null;
        const cardIndex = opponentStageData.findIndex(card => parseInt(card.id) === parseInt(cardId));

        if (cardIndex !== -1) {
            // If a card exists in the drop zone and it exists in opponentStageData,
            // replace it with the corresponding data from opponentStageData
            const correspondingCardData = opponentStageData[cardIndex];
            updateCardElement(cardElement, correspondingCardData);
            cardElement.classList.add('opponent');
            opponentStageData.splice(cardIndex, 1); // Remove the card from opponentStageData
        } else {
            // If the drop zone contains a card that does not exist in opponentStageData, remove the card
            cardElement.remove();
        }
    });

    // Shuffle the emptyDropZones array
    emptyDropZones.sort(() => Math.random() - 0.5);

    if (opponentStageData.length > 0) {
        // Test if card in opponentStageData is in fullDropZone
        // If not, create new cardElement and append to dropZone
        // If so, do nothing
        emptyDropZones.forEach(dropZone => {
            // Check if opponentStageData is empty before proceeding
            if (opponentStageData.length === 0) {
                return;
            }
            // randomly select an empty drop zone
            const randomIndex = Math.floor(Math.random() * opponentStageData.length);
            const cardData = opponentStageData[randomIndex];
            // Create a new card element
            const cardContainer = createCardElement(cardData);
            cardContainer.classList.add('opponent');
            const dropZoneElement = document.getElementById(dropZone);
            dropZoneElement.appendChild(cardContainer);

            opponentStageData.splice(randomIndex, 1); // Remove the card from opponentStageData
        });
    }
}

function createCardElement(cardData) {
    console.log('cardData(createCardElement):', cardData)
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    cardContainer.draggable = true; // Make the entire container draggable
    cardContainer.id = cardData.id; // Set the outer div id as the cardId
    cardContainer.classList.add('card');

    // Create elements for card content
    const cardId = document.createElement('p');
    cardId.textContent = cardData.id;

    const name = document.createElement('h1');
    name.classList.add('name');
    name.textContent = cardData.name;

    const textOverlayBottom = document.createElement('div');
    textOverlayBottom.classList.add('textOverlayBottom');

    const textOverlayTop = document.createElement('div');
    textOverlayTop.classList.add('textOverlayTop');

    const cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');
    cardImage.draggable = false;

    const imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    const rarity = document.createElement('p');
    rarity.textContent = cardData.rarity;

    const mana = document.createElement('p');
    mana.innerHTML = `<strong>Mana Cost:</strong> ${cardData.mana}`;

    textOverlayBottom.appendChild(rarity);
    textOverlayBottom.appendChild(mana);

    let typeText = '';
    if (cardData.type.toLowerCase() === "spell") {
        typeText = `${cardData.type} - ${cardData.ability}`;

        // const spellType = document.createElement('p');
        // spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

        const spellAttack = document.createElement('p');
        spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.attack}`;

        const spellDefense = document.createElement('p');
        spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.defense}`;

        // textOverlayBottom.appendChild(spellType);
        textOverlayBottom.appendChild(spellAttack);
        textOverlayBottom.appendChild(spellDefense);

    } else {
        typeText = cardData.type;

        const attack = document.createElement('p');
        attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

        const defense = document.createElement('p');
        defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

        textOverlayBottom.appendChild(attack);
        textOverlayBottom.appendChild(defense);

    }

    const type = document.createElement('p');
    type.classList.add('cardType');
    type.textContent = typeText;

    textOverlayTop.appendChild(name);
    textOverlayTop.appendChild(type);

    cardContainer.appendChild(textOverlayBottom);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(textOverlayTop);

    // Add event listener for the card container
    cardContainer.addEventListener('dragstart', event => {
        // Set the cardId as the data to be transferred during the drag operation
        event.dataTransfer.setData('text/plain', cardContainer.id);
    });

    return cardContainer;
}


function updateCardElement(cardElement, cardData) {
    if (cardElement && cardData) {
        const parentNode = cardElement.parentNode;
        parentNode.removeChild(cardElement);

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.draggable = true; // Make the entire container draggable
        cardContainer.id = cardData.id; // Set the outer div id as the cardId
        cardContainer.classList.add('card');

        // Create elements for card content
        const cardId = document.createElement('p');
        cardId.textContent = cardData.id;

        const name = document.createElement('h1');
        name.classList.add('name');
        name.textContent = cardData.name;

        const textOverlayBottom = document.createElement('div');
        textOverlayBottom.classList.add('textOverlayBottom');

        const textOverlayTop = document.createElement('div');
        textOverlayTop.classList.add('textOverlayTop');

        const cardImage = document.createElement('div');
        cardImage.classList.add('cardImage');
        cardImage.draggable = false;

        const imageElement = document.createElement('img');
        imageElement.src = cardData.imagePath;
        imageElement.alt = 'Card Image';

        cardImage.appendChild(imageElement);

        const rarity = document.createElement('p');
        rarity.textContent = cardData.rarity;

        const mana = document.createElement('p');
        mana.innerHTML = `<strong>Mana Cost:</strong> ${cardData.mana}`;

        textOverlayBottom.appendChild(rarity);
        textOverlayBottom.appendChild(mana);

        let typeText = '';
        if (cardData.type.toLowerCase() === "spell") {
            typeText = `${cardData.type} - ${cardData.ability}`;

            // const spellType = document.createElement('p');
            // spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

            const spellAttack = document.createElement('p');
            spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.attack}`;

            const spellDefense = document.createElement('p');
            spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.defense}`;

            // textOverlayBottom.appendChild(spellType);
            textOverlayBottom.appendChild(spellAttack);
            textOverlayBottom.appendChild(spellDefense);
        } else {
            typeText = cardData.type;

            const attack = document.createElement('p');
            attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

            const defense = document.createElement('p');
            defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

            textOverlayBottom.appendChild(attack);
            textOverlayBottom.appendChild(defense);
        }

        const type = document.createElement('p');
        type.classList.add('cardType');
        type.textContent = typeText;

        textOverlayTop.appendChild(name);
        textOverlayTop.appendChild(type);

        cardContainer.appendChild(textOverlayBottom);
        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(textOverlayTop);

        // Add event listener for the card container
        cardContainer.addEventListener('dragstart', event => {
            // Set the cardId as the data to be transferred during the drag operation
            event.dataTransfer.setData('text/plain', cardContainer.id);
        });

        // Append the card container to the hand container
        parentNode.appendChild(cardContainer);
    }
}

// Function to handle dropping on the opponent's health orb
function dropOnOpponentHealthOrb(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const cardElements = Array.from(document.querySelectorAll('.card-container.card.player'))
    const cardElement = cardElements.find(card => parseInt(card.id) === parseInt(cardId))
    // const dropZone = event.target;

    console.log("parseInt(cardElement.id)", cardId)
    console.log("cardElement", cardElement)
    const owner = cardElement.classList.contains('player') ? 'player' : 'opponent';
    console.log("owner", owner)

    const parentNode = cardElement.parentNode;
    console.log("parentNode", parentNode)

    if (parentNode.id === 'hand') {
        fetch(`/getCardHandDetails?cardId=${parseInt(cardId)}&owner=${owner}`)
            .then(response => response.json())
            .then(cardData => {
                console.log("cardData", cardData)
                // Check if the card type is "damage" spell
                if (cardData.type.toLowerCase() === 'spell' && cardData.ability.toLowerCase() === 'damage') {
                    // Apply the spell effect to damage the opponent's health
                    applyDamageToOpponentHealth(cardElement);
                    fetchAndRenderHand(); // Fetch and render the hand after the spell is played
                } else {
                    // Display an error message since only "damage" spells can be applied to opponent's health
                    displayErrorMessage('Error: Only "damage" spells and playable creatures can be applied to opponent\'s health', 'opponentHealthOrb');
                }
            })
            .catch(error => {
                console.error('Error fetching card details:', error);
            });
        
    } else {
    fetch(`/getCardDeckDetails?cardId=${parseInt(cardId)}&owner=${owner}`)
        .then(response => response.json())
        .then(cardData => {
            console.log("cardData", cardData)
            if (cardData.type.toLowerCase() === "creature") {
                // If cardData is in staging area, play card and remove from staging area
                attackCardToHealth(cardElement);
                fetchAndRenderStagingArea();
            } else {
                // Display an error message since only "damage" spells can be applied to opponent's health
                displayErrorMessage('Error: Only "damage" spells and playable creatures can be applied to opponent\'s health', 'opponentHealthOrb');
            }
        })
        .catch(error => {
            console.error('Error fetching card details:', error);
        });
    }
}

function attackCardToHealth(cardElement) {
    fetch('/attackCardToHealth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id : parseInt(cardElement.id)}),
    })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server, if needed
            if (data.message) {
                const opponentHealthSpan = document.getElementById('opponentHealth');
                const opponentHealth = opponentHealthSpan.textContent;
                opponentHealthSpan.textContent = data.opponentHealth.toString()

                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;

                // Remove card from staging area
                cardElement.remove();

                // Update player's deck card count
                document.getElementById('deck-count').textContent = `Remaining Deck Cards: ${data.playerDeckCount}`;
            }
        })
        .catch(error => {
            console.error('Error applying damage to opponent health:', error);
        });
}

// Function to apply damage to opponent's health
function applyDamageToOpponentHealth(cardElement) {
    // Send a request to the server to deduct 'damage' from the opponent's health
    fetch('/damageOpponent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id : parseInt(cardElement.id)}),
    })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server, if needed

            if (data.message) {
                const opponentHealthSpan = document.getElementById('opponentHealth');
                const opponentHealth = opponentHealthSpan.textContent;
                opponentHealthSpan.textContent = data.opponentHealth.toString()

                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;

            }
        })
        .catch(error => {
            console.error('Error applying damage to opponent health:', error);
        });
}

function applyDebuffToOpponentCard(id, targetId) {
    // Send a request to the server to deduct 'damage' from the opponent's health
    fetch('/debuffOpponent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, targetId }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server, if needed
            if (data.message) {
                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;
            }
        })
        .catch(error => {
            console.error('Error applying damage to opponent health:', error);
        });
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the end turn button
    const endTurnButton = document.getElementById('endTurnButton');
    endTurnButton.addEventListener('click', endTurn);

    const opponentHealthOrb = document.getElementById('opponentHealth');
    opponentHealthOrb.addEventListener('drop', dropOnOpponentHealthOrb);
    opponentHealthOrb.addEventListener('dragover', dragOver);

    // Fetch and render the player's hand
    fetchAndRenderHand()

    // const hand = document.getElementById('hand');
    const handList = hand.querySelectorAll('.card');
    const playerDropZones = document.querySelectorAll(".player .drop-zone");

    handList.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    })

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    playerDropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    })


    function dragOver(event) {
        event.preventDefault();
    }


})

function displayErrorMessage(message, dropZoneId) {
    const errorContainer = document.getElementById(`${dropZoneId}Error`);
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.add('show'); // Show the error container
    }

    // Set a timeout to hide the error message after 5 seconds
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.textContent = ''; // Clear the error message
            errorContainer.classList.remove('show'); // Hide the error container
        }
    }, 5000);
}

function attachDragDropListeners() {
    const handList = document.getElementById('hand').querySelectorAll('.card');
    const playerDropZones = document.querySelectorAll(".player .drop-zone");

    handList.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    playerDropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    });
}



// Function to render the hand on the UI
function renderHand(handData) {
    const handContainer = document.getElementById('hand');
    handContainer.innerHTML = ''; // Clear existing hand content

    // Iterate over the hand data and create card elements
    handData.forEach(cardData => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.draggable = true; // Make the entire container draggable
        cardContainer.id = cardData.id; // Set the outer div id as the cardId
        cardContainer.classList.add('card');

        // Create elements for card content
        const cardId = document.createElement('p');
        cardId.textContent = cardData.cardId;

        const name = document.createElement('h1');
        name.classList.add('name');
        name.textContent = cardData.name;

        const textOverlayBottom = document.createElement('div');
        textOverlayBottom.classList.add('textOverlayBottom');

        const textOverlayTop = document.createElement('div');
        textOverlayTop.classList.add('textOverlayTop');

        const cardImage = document.createElement('div');
        cardImage.classList.add('cardImage');
        cardImage.draggable = false;

        const imageElement = document.createElement('img');
        imageElement.src = cardData.imagePath;
        imageElement.alt = 'Card Image';

        cardImage.appendChild(imageElement);

        const rarity = document.createElement('p');
        rarity.textContent = cardData.rarity;

        const mana = document.createElement('p');
        mana.innerHTML = `<strong>Mana Cost:</strong> ${cardData.mana}`;

        textOverlayBottom.appendChild(rarity);
        textOverlayBottom.appendChild(mana);

        let typeText = '';
        if (cardData.type.toLowerCase() === "spell") {
            typeText = `${cardData.type} - ${cardData.ability}`;

            // const spellType = document.createElement('p');
            // spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

            const spellAttack = document.createElement('p');
            spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.attack}`;

            const spellDefense = document.createElement('p');
            spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.defense}`;

            // textOverlayBottom.appendChild(spellType);
            textOverlayBottom.appendChild(spellAttack);
            textOverlayBottom.appendChild(spellDefense);
        } else {
            typeText = cardData.type;

            const attack = document.createElement('p');
            attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

            const defense = document.createElement('p');
            defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

            textOverlayBottom.appendChild(attack);
            textOverlayBottom.appendChild(defense);
        }

        const type = document.createElement('p');
        type.classList.add('cardType');
        type.textContent = typeText;

        textOverlayTop.appendChild(name);
        textOverlayTop.appendChild(type);

        cardContainer.appendChild(textOverlayBottom);
        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(textOverlayTop);
        cardContainer.classList.add('player');

        // Add event listener for the card container
        cardContainer.addEventListener('dragstart', event => {
            // Set the cardId as the data to be transferred during the drag operation
            event.dataTransfer.setData('text/plain', cardContainer.id);
        });

        // Append the card container to the hand container
        handContainer.appendChild(cardContainer);
    });

    // Define handList after the hand cards are rendered
    const handList = handContainer.querySelectorAll('.card-container');
    return handList;
}

// Function to fetch and render the hand
function fetchAndRenderHand() {
    fetch('/getHand')
        .then(response => response.json())
        .then(data => {
            // Render the hand data on the UI
            let handList = renderHand(data.hand);
        })
        .catch(error => {
            console.error('Error fetching hand data:', error);
        });
}

function endTurn() {
    console.log("END TURN")
    fetch('/endTurn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),  // Send an empty body since no additional data is needed
    })
        .then(response => response.json())
        .then(data => {
            // Fetch and render Players hand
            fetchAndRenderHand();
            fetchAndRenderStagingArea();
            fetchAndRenderOpponentStage();

            // Convert grayed-out cards back to their original state
            const grayedOutCards = document.querySelectorAll('.greyed-out');
            grayedOutCards.forEach(card => {
                card.classList.remove('greyed-out');
                const pElement = card.parentNode.querySelector('p');
                if (pElement) {
                    pElement.style.display = 'block';
                }
            });

            // Update the UI based on the opponent's move
            if (data.opponentStage && data.round <= 1) {
                initializeOpponentStageUI(data.opponentStage);
            }

            if (data.playerMana) {
                // Update player's mana UI
                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;
            }

            if (data.opponentMana) {
                // Update opponent's mana UI
                document.getElementById('opponentMana').textContent = `Opponent Mana: ${data.opponentMana}`;
            }

            if (data.opponentHealth) {
                // Update opponent's health UI
                document.getElementById('opponentHealth').textContent = data.opponentHealth;
            }

            if (data.playerHealth) {
                // Update player's health UI
                document.getElementById('playerHealth').textContent = data.playerHealth;
            }

            if (data.opponentDeckCount) {
                // Update opponent's deck card count
                document.getElementById('opponentDeckCount').textContent = `Remaining Opponent Deck Cards: ${data.opponentDeckCount}`;
            }

            if (data.playerDeckCount) {
                // Update player's deck card count
                document.getElementById('deck-count').textContent = `Remaining Deck Cards: ${data.playerDeckCount}`;
            }

        })
        .catch(error => {
            console.error('Error ending turn:', error);
        });

    attachDragDropListeners();
}

function initializeOpponentStageUI(opponentStage) {
    attachStagedCardListeners();

    // Assuming opponentStage is an array of card IDs
    const dropZones = document.querySelectorAll('.opponent .drop-zone');
    const emptyDropZones = [];

    // Attach drop event listeners to opponent drop zones
    dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('drop', drop);
    });

    // Check each drop zone for a card
    dropZones.forEach(dropZone => {
        const cardElement = dropZone.querySelector('.card');
        if (!cardElement) {
            emptyDropZones.push(dropZone.id); // Add drop zone ID to the emptyDropZones array if no card is found
        } else {
            // Check if the card is greyed out
            const isGreyedOut = cardElement.classList.contains('greyed-out');
            console.log(`Drop zone ${dropZone.id} contains a card${isGreyedOut ? ' (greyed out)' : ''}`);
        }
    });

    if (opponentStage.length > 0 && emptyDropZones.length > 0) {
        opponentStage.forEach(card => {
            // Randomly select an empty drop zone
            const randomIndex = Math.floor(Math.random() * emptyDropZones.length);
            const selectedDropZone = emptyDropZones[randomIndex];

            // Select the drop zone container element
            const selectedDropZoneContainer = document.getElementById(selectedDropZone);

            // Create a new card element
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.draggable = true; // Make the card draggable
            cardElement.id = parseInt(card.id); // Set the ID of the card element
            // cardElement.textContent = `${card.name}\n${card.type}\nmana: 
            // ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;

            // Create elements for card content
            const cardId = document.createElement('p');
            cardId.textContent = card.id;

            const name = document.createElement('h1');
            name.classList.add('name');
            name.textContent = card.name;

            const textOverlayBottom = document.createElement('div');
            textOverlayBottom.classList.add('textOverlayBottom');

            const textOverlayTop = document.createElement('div');
            textOverlayTop.classList.add('textOverlayTop');

            const cardImage = document.createElement('div');
            cardImage.classList.add('cardImage');
            cardImage.draggable = false;

            const imageElement = document.createElement('img');
            imageElement.src = card.imagePath;
            imageElement.alt = 'Card Image';

            cardImage.appendChild(imageElement);

            const rarity = document.createElement('p');
            rarity.textContent = card.rarity;

            const mana = document.createElement('p');
            mana.innerHTML = `<strong>Mana Cost:</strong> ${card.mana}`;

            textOverlayBottom.appendChild(rarity);
            textOverlayBottom.appendChild(mana);

            let typeText = '';
            if (card.type.toLowerCase() === "spell") {
                typeText = `${card.type} - ${card.ability}`;

                // const spellType = document.createElement('p');
                // spellType.innerHTML = `<strong>Spell Type:</strong> ${card.spellType}`;

                const spellAttack = document.createElement('p');
                spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${card.attack}`;

                const spellDefense = document.createElement('p');
                spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${card.defense}`;

                // textOverlayBottom.appendChild(spellType);
                textOverlayBottom.appendChild(spellAttack);
                textOverlayBottom.appendChild(spellDefense);
            } else {
                typeText = card.type;

                const attack = document.createElement('p');
                attack.innerHTML = `<strong>Attack:</strong> ${card.attack}`;

                const defense = document.createElement('p');
                defense.innerHTML = `<strong>Defense:</strong> ${card.defense}`;

                textOverlayBottom.appendChild(attack);
                textOverlayBottom.appendChild(defense);
            }

            const type = document.createElement('p');
            type.classList.add('cardType');
            type.textContent = typeText;

            textOverlayTop.appendChild(name);
            textOverlayTop.appendChild(type);

            cardElement.appendChild(textOverlayBottom);
            cardElement.appendChild(cardImage);
            cardElement.appendChild(textOverlayTop);

            // Add event listener for the card element
            cardElement.addEventListener('dragstart', event => {
                // Set the cardId as the data to be transferred during the drag operation
                event.dataTransfer.setData('text/plain', cardElement.id);
            });

            cardElement.classList.add('opponent');

            // Append the card element to the selected drop zone
            selectedDropZoneContainer.appendChild(cardElement);

            // Remove the selected drop zone from the emptyDropZones array
            emptyDropZones.splice(randomIndex, 1);
        });

        // Clear opponentStage since all cards have been placed
        opponentStage = [];
    }
    attachDragDropListeners();
}


function attachStagedCardListeners() {
    const stagedCards = document.querySelectorAll('.staged-card');
    const playerDropZones = document.querySelectorAll(".player .drop-zone");

    stagedCards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    playerDropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    });
}

async function applySpellEffect(spellCard, dropZone) {
    try {
        // const dropZoneId = dropZone.getAttribute('id');
        const cardId = dropZone.querySelector('.card').id;

        if (!cardId) {
            handleNoCardFoundError(dropZone);
            return;
        }

        const creatureCardData = await fetchCreatureCardDetails(cardId);

        if (!creatureCardData) {
            console.error('Error: Creature card details not found');
            return;
        }

        if (creatureCardData.type.toLowerCase() === 'creature') {
            if (spellCard.ability.toLowerCase() === 'debuff') {
                applyDebuffToOpponentCard(spellCard.id, cardId);
            } else {
                applySpellToCreature(spellCard, cardId, creatureCardData);
            }
        } else {
            displayErrorMessage('Error: Only creature cards can be affected by spells', 1);
        }

        fetchAndRenderHand();
        fetchAndRenderStagingArea();
        fetchAndRenderOpponentStage();
    } catch (error) {
        console.error('Error applying spell effect:', error);
    }
}

function handleNoCardFoundError(dropZone) {
    console.error('Error: No card found in the drop zone');
    displayErrorMessage('Error: No card found in the drop zone', 1);
}

async function applySpellToCreature(spellCard, dropZoneId, creatureCardData) {


    if (!spellCard.ability) {
        console.error('Error: Spell effect not defined for the spell card');
        return;
    }

    try {
        const updatedStagedCards = await updateCreatureCardOnServer(dropZoneId, creatureCardData, spellCard.id);
        fetchAndRenderHand();
        // updateDOMWithUpdatedCardDetails(updatedStagedCards, dropZoneId);
    } catch (error) {
        console.error('Error updating creature card on server:', error);
    }
}

function updateDOMWithUpdatedCardDetails(updatedStagedCards, dropZoneId) {
    const stagedCards = updatedStagedCards['playerStage'];
    const cardId = updatedStagedCards['cardId'];

    if (stagedCards && dropZoneId) {
        const cardElement = document.getElementById(dropZoneId);
        const stagedCard = stagedCards.find(card => parseInt(card.id) === parseInt(cardId));

        if (cardElement && stagedCard) {
            const textOverlayBottom = cardElement.querySelector('.textOverlayBottom');
            if (textOverlayBottom) {
                textOverlayBottom.innerHTML = `<p><strong>Mana Cost:</strong> ${stagedCard.mana}</p><p><strong>Attack:</strong> ${stagedCard.attack}</p><p><strong>Defense:</strong> ${stagedCard.defense}</p>`;
            } else {
                console.error('Text overlay bottom element not found:', textOverlayBottom);
            }

        } else {
            console.error('Card element or staged card not found:', cardElement, stagedCard);
        }
    } else {
        console.error('Staged cards or drop zone ID not found:', stagedCards, dropZoneId);
    }
}



async function fetchCreatureCardDetails(cardId) {
    try {
        const response = await fetch(`/getCardDetails?cardId=${cardId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching creature card details:', error);
        return null;
    }
}

async function updateCreatureCardOnServer(cardId, updatedCardData, spellCardId) {
    // dropZoneId, creatureCardData, spellCard.id
    return new Promise((resolve, reject) => {
        fetch('/updatePlayerCreatureCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId, updatedCardData, spellCardId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'card played successfully') {
                    // Update player's mana UI
                    document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;

                    // Ensure cardId remains integer
                    const updatedCardId = parseInt(data.cardId);

                    resolve({ playerStage: data.playerStage, cardId: updatedCardId });
                } else if (data.message === 'Insufficient mana to play this card.') {
                    // Display an error message for insufficient mana
                    const dropZoneId = dropZone.id;
                    displayErrorMessage('Error: Insufficient mana to play this card', dropZoneId);
                    reject(data.message); // Reject the promise with the error message
                } else {
                    console.error('Error:', data.message);
                    reject(data.message); // Reject the promise with the error message
                }
            })
            .catch(error => {
                console.error('Error playing the card:', error);
                reject(error); // Reject the promise with the error
            });
    });
}