// gamePlay1Helper.js
// Game play for RuleSet 1
// Client Side Javascript
// Defined globally
function dragStart(event) {
    console.log("dragStart", event.target.id)
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    attachDragDropListeners();
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const dropZone = event.target;

    // Check if dropZone already contains a card
    const existingCard = dropZone.querySelector('.card');

    if (!existingCard) {
        // Fetch card details
        fetch(`/getCardDetails?cardId=${cardId}`)
            .then(response => response.json())
            .then(cardData => {
                if (cardData.type.toLowerCase() === 'creature') {
                    // Check if the drop zone is the opponent's drop zone
                    if (dropZone.parentElement.classList.contains('opponent')) {

                        // Get id of card in dropzone
                        let cardInDropZone = dropZone.querySelector('.card');
                        let cardId = cardInDropZone.id;

                        fetch('/attackCardToOpponent', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ cardId: cardId, dropZoneId: dropZone.id }),
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
                    } else if (dropZone.parentElement.classList.contains('player')) {
                        // Only creature cards can be played in the player drop zone
                        fetch('/playCard', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ cardId: cardId }),
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
                                console.error('Error playing the card:', error);
                            });
                    }
                } else if (cardData.type.toLowerCase() === 'spell') {
                    // Check if card is a buff spell
                    if (cardData.ability.toLowerCase() === 'buff') {
                        // Check if the drop zone is the staging area
                        if (dropZone.parentElement.classList.contains('staging')) {
                            // Display an error message for spell cards being played in the staging area
                            const dropZoneId = dropZone.id;
                            displayErrorMessage('Error: Cannot play Spell card in staging area. Must be applied to player or Creature card', dropZoneId);
                        } else {
                            // Determine the target zone (player or opponent)
                            const targetZone = dropZone.parentElement.classList.contains('player') ? 'player' : 'opponent';
                            // Apply spell effect based on the target zone
                            applySpellEffect(cardData, dropZone); // Pass dropZone as a parameter
                            fetchAndRenderHand();
                        }
                    } else {
                        // Display error message for non-buff spell cards
                        const dropZoneId = dropZone.id;
                        displayErrorMessage('Error: Only buff spells can be played on your creature cards', dropZoneId);
                    }


                } else {
                    // Display an error message for invalid card types
                    const dropZoneId = dropZone.id;
                    displayErrorMessage('Error: Only creature cards and buff spells can be played in this zone', dropZoneId);
                }
            });
    } else {
        // If there is already a card in the drop zone
        const dropZoneId = dropZone.id;
        // Fetch card details
        fetch(`/getCardDetails?cardId=${cardId}`)
            .then(response => response.json())
            .then(cardData => {
                if (cardData.type.toLowerCase() === 'spell') {
                    // Apply spell effect to the existing creature card
                    applySpellEffect(cardData, dropZone);
                } else {
                    // Display an error message since only spell cards can be applied to existing creature cards
                    displayErrorMessage('Error: Only spell cards can be applied to existing creature cards', dropZoneId);
                }
            })
            .catch(error => {
                console.error('Error fetching card details:', error);
            });
    }
}


// Function to fetch and render the hand
function fetchAndRenderHand() {
    fetch('/getHand')
        .then(response => response.json())
        .then(data => {
            // Render the hand data on the UI
            renderHand(data.hand);
        })
        .catch(error => {
            console.error('Error fetching hand data:', error);
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
            // Render the opponent's staging area data on the UI
            renderOpponentStage(data.opponentStage);
        })
        .catch(error => {
            console.error('Error fetching opponent\'s staging area data:', error);
        });
}

function renderStagingArea(stagingAreaData) {
    const stagingAreaContainer = document.getElementById('stagingArea');

    // Replace cards with new data, if card is already in staging area else remove
    stagingAreaData.forEach(card => {
        const cardElement = document.getElementById(card.id);
        if (cardElement) {
            cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
        } else {
            const newCardElement = document.createElement('div');
            newCardElement.draggable = true;
            newCardElement.id = card.id;
            newCardElement.classList.add('card');
            newCardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
            stagingAreaContainer.appendChild(newCardElement);
        }
    }
    )
}

function renderOpponentStage(opponentStageData) {
    console.log("opponentStageData", opponentStageData);
    const opponentStagingAreaContainer = document.getElementById('opponentStagingArea');
    console.log("opponentStagingAreaContainer", opponentStagingAreaContainer);
    // Replace cards with new data, if card is already in staging area else remove
    opponentStageData.forEach(card => {
        const existingCardElement = document.getElementById(card.id.toString());
        console.log("existingCardElement", existingCardElement);
        // if (existingCardElement) {
            existingCardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
        // } else {
        //     // Create a new card element with updated data
        //     const newCardElement = document.createElement('div');
        //     newCardElement.draggable = true;
        //     newCardElement.id = card.id;
        //     newCardElement.classList.add('card');
        //     newCardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
            
        //     // Append the new card element to the opponent staging area
        //     opponentStagingAreaContainer.appendChild(newCardElement);
        // }
    }
    )
}



// Function to handle dropping on the opponent's health orb
function dropOnOpponentHealthOrb(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');

    // Fetch card details
    fetch(`/getCardDetails?cardId=${cardId}`)
        .then(response => response.json())
        .then(cardData => {
            // Check if the card type is "damage" spell
            if (cardData.type.toLowerCase() === 'spell' && cardData.ability.toLowerCase() === 'damage') {
                // Apply the spell effect to damage the opponent's health
                applyDamageToOpponentHealth(cardData.id);
                fetchAndRenderHand(); // Fetch and render the hand after the spell is played
            } else if (cardData.type.toLowerCase() === "creature") {
                // If cardData is in staging area, play card and remove from staging area
                attackCardToHealth(cardData.id);

            } else {
                // Display an error message since only "damage" spells can be applied to opponent's health
                displayErrorMessage('Error: Only "damage" spells can be applied to opponent\'s health', 'opponentHealthOrb');
            }
        })
        .catch(error => {
            console.error('Error fetching card details:', error);
        });
}

function attackCardToHealth(id) {
    fetch('/attackCardToHealth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
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
                const cardElement = document.getElementById(id);
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
function applyDamageToOpponentHealth(id) {
    // Send a request to the server to deduct 'damage' from the opponent's health
    fetch('/damageOpponent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
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

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the end turn button
    const endTurnButton = document.getElementById('endTurnButton');
    endTurnButton.addEventListener('click', endTurn);


    const opponentHealthOrb = document.getElementById('opponentHealth');
    opponentHealthOrb.addEventListener('drop', dropOnOpponentHealthOrb);
    opponentHealthOrb.addEventListener('dragover', dragOver);

    // Fetch initial hand data from the server
    fetch('/getHand')
        .then(response => response.json())
        .then(data => {
            // Render the initial hand data on the UI
            renderHand(data.hand);
        })
        .catch(error => {
            console.error('Error fetching initial hand data:', error);
        });



    // Function to render the hand on the UI
    function renderHand(handData) {
        const handContainer = document.getElementById('hand');
        handContainer.innerHTML = ''; // Clear existing hand content

        // Iterate over the hand data and create card elements
        handData.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.draggable = true;
            cardElement.id = card.id;
            cardElement.classList.add('card');

            // Set the text content based on the card type
            if (card.type.toLowerCase() === 'creature') {
                cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
            } else if (card.type.toLowerCase() === 'spell') {
                cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}
                \nSpell Attack: ${card.attack}\nSpell Defense: ${card.defense}\nSpell Type: ${card.ability}`;
            }

            // Append the card element to the hand container
            handContainer.appendChild(cardElement);
        });

        // Define handList after the hand cards are rendered
        const handList = handContainer.querySelectorAll('.card');

        // Add event listeners for the hand cards
        handList.forEach(card => {
            card.addEventListener('dragstart', dragStart);
        });
    }

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
    handData.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.draggable = true;
        cardElement.id = card.id;
        cardElement.classList.add('card');

        // Set the text content based on the card type
        if (card.type.toLowerCase() === 'creature') {
            cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
        } else if (card.type.toLowerCase() === 'spell') {
            cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}
            \nSpell Attack: ${card.attack}\nSpell Defense: ${card.defense}\nSpell Type: ${card.ability}`;
        }

        // Append the card element to the hand container
        handContainer.appendChild(cardElement);
    });

    // Add event listeners for the hand cards
    const handList = handContainer.querySelectorAll('.card');
    handList.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });
}

// Function to fetch and render the hand
function fetchAndRenderHand() {
    fetch('/getHand')
        .then(response => response.json())
        .then(data => {
            // Render the hand data on the UI
            renderHand(data.hand);
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
            if (data.opponentStage) {
                updateOpponentStageUI(data.opponentStage);
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

function updateOpponentStageUI(opponentStage) {
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
            console.log(`CARD: ${card.id}`);
            // Create a new card element
            const cardElement = document.createElement('div'); cardElement.classList.add('card');
            cardElement.draggable = true; // Make the card draggable
            cardElement.id = parseInt(card.id); // Set the ID of the card element
            cardElement.textContent = `${card.name}\n${card.type}\nmana: 
            ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;

            cardElement.classList.add('card');

            if (card) {
                // Append the card element to the selected drop zone
                selectedDropZoneContainer.appendChild(cardElement);
            }
            console.log(`Placed card ${card.id} in drop zone ${selectedDropZoneContainer.id}`);

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
    const dropZoneId = dropZone.getAttribute('id');

    if (!dropZoneId) {
        console.error('Error: No card found in the drop zone');
        return;
    }

    try {
        const creatureCardData = await fetchCreatureCardDetails(dropZoneId);

        if (!creatureCardData) {
            console.error('Error: Creature card details not found');
            return;
        }

        if (creatureCardData.type.toLowerCase() === 'creature') {
            if (!spellCard.ability) {
                console.error('Error: Spell effect not defined for the spell card');
                return;
            }

            creatureCardData.attack += spellCard.attack;
            creatureCardData.defense += spellCard.defense;

            // Update the card on the server-side
            updateCreatureCardOnServer(dropZoneId, creatureCardData, spellCard.id)
                .then(updatedStagedCards => {
                    // fetch hand after spell has been played
                    fetchAndRenderHand();

                    let stagedCards = updatedStagedCards['playerStage'];
                    let cardId = updatedStagedCards['cardId']

                    // Update the DOM with the updated card details
                    if (stagedCards) {
                        const cardElement = document.getElementById(dropZoneId);
                        const stagedCard = stagedCards.filter(card => parseInt(card.id) === parseInt(cardId))[0];

                        cardElement.textContent = `${stagedCard.name}\n${stagedCard.type}\nmana: 
                            ${stagedCard.mana}\nAttack: ${stagedCard.attack}\nDefense: ${stagedCard.defense}`;
                    }
                })
                .catch(error => {
                    console.error('Error updating creature card on server:', error);
                });
        } else {
            displayErrorMessage('Error: Only creature cards can be affected by spells', dropZone.id);
        }
    } catch (error) {
        console.error('Error applying spell effect:', error);
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