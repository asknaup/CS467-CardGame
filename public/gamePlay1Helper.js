// gamePlay1Helper.js
// Game play for RuleSet 1
// Client Side Javascript
// Defined globally
function dragStart(event) {
    console.log(event.target.id)
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
    console.log("existingCard", existingCard)

    if (!existingCard) {
        // Fetch card details
        fetch(`/getCardDetails?cardId=${cardId}`)
            .then(response => response.json())
            .then(cardData => {
                console.log("cardType", cardData)
                if (cardData.type.toLowerCase() === 'creature') {
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
                } else if (cardData.type.toLowerCase() === 'spell') {
                    // Display an error message for spell cards being played in the drop zone
                    const dropZoneId = dropZone.id;
                    displayErrorMessage('Error: Cannot play Spell card in staging area. Must be applied to player or Creature card', dropZoneId);
                }
            });
    } else {
        // If there is already a card in the drop zone, display an error message
        const dropZoneId = dropZone.id;
        displayErrorMessage('Error: There is already a card here', dropZoneId);
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


document.addEventListener('DOMContentLoaded', function () {
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

            console.log("cardData");
            console.log(card);

            // Set the text content based on the card type
            if (card.type.toLowerCase() === 'creature') {
                cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
            } else if (card.type.toLowerCase() === 'spell') {
                cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nSpell Attack: ${card.spellAttack}\nSpell Defense: ${card.spellDefense}`;
            }

            // Append the card element to the hand container
            handContainer.appendChild(cardElement);
        });

         // Define handList after the hand cards are rendered
         const handList = handContainer.querySelectorAll('.card');
         console.log("handList", handList);
 
         // Add event listeners for the hand cards
         handList.forEach(card => {
             card.addEventListener('dragstart', dragStart);
         });
    }

    // const hand = document.getElementById('hand');
    const handList = hand.querySelectorAll('.card');
    const playerDropZones = document.querySelectorAll(".player .drop-zone");
    // console.log("handList", handList);
    // console.log(handData)

    handList.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    })

    function dragStart(event) {
        console.log(event.target.id)
        event.dataTransfer.setData('text/plain', event.target.id);
    }
    console.log(handList);
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
    console.log(errorContainer); // Log the error container for debugging
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

// // Remove the card from the drop zone
// dropZone.removeChild(newCardElement);

// // Make the <p> element reappear
// if (pElement) {
//     pElement.style.display = 'block';
// }

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the end turn button
    const endTurnButton = document.getElementById('endTurnButton');
    endTurnButton.addEventListener('click', endTurn);
});

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
        console.log(card)
        const cardElement = document.createElement('div');
        cardElement.draggable = true;
        cardElement.id = card.id;
        cardElement.classList.add('card');

        // Set the text content based on the card type
        if (card.type.toLowerCase() === 'creature') {
            cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nAttack: ${card.attack}\nDefense: ${card.defense}`;
        } else if (card.type.toLowerCase() === 'spell') {
            cardElement.textContent = `${card.name}\n${card.type}\nmana: ${card.mana}\nSpell Attack: ${card.attack}\nSpell Defense: ${card.defense}`;
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
    fetch('/endTurn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),  // Send an empty body since no additional data is needed
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log the message from the server
            console.log(data.opponentStage);

            // Fetch and render Players hand
            fetchAndRenderHand();

            // Update the UI based on the opponent's move
            if (data.opponentStage) {
                updateOpponentStageUI(data.opponentStage);
            }

            if (data.playerMana) {
                // Update player's mana UI
                document.getElementById('playerMana').textContent = `Player Mana: ${data.playerMana}`;
            }

            // Convert grayed-out cards back to their original state
            const grayedOutCards = document.querySelectorAll('.greyed-out');
            grayedOutCards.forEach(card => {
                card.classList.remove('greyed-out');
                const pElement = card.parentNode.querySelector('p');
                if (pElement) {
                    pElement.style.display = 'block';
                }
            });
        })
        .catch(error => {
            console.error('Error ending turn:', error);
        });

        attachDragDropListeners();
}

function updateOpponentStageUI(opponentStage) {
    // Assuming opponentStage is an array of card IDs
    const dropZones = document.querySelectorAll('.opponent .drop-zone');
    const emptyDropZones = [];

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

    console.log(opponentStage)

    if (opponentStage.length > 0 && emptyDropZones.length > 0) {
        opponentStage.forEach(card => {
            // Randomly select an empty drop zone
            const randomIndex = Math.floor(Math.random() * emptyDropZones.length);
            const selectedDropZone = emptyDropZones[randomIndex];

            // Select the drop zone container element
            const selectedDropZoneContainer = document.getElementById(selectedDropZone);
            console.log('Selected drop zone:', selectedDropZone);

            // Create a new card element
            const cardElement = document.createElement('div'); cardElement.classList.add('card');
            cardElement.draggable = true; // Make the card draggable
            cardElement.id = card.id; // Set the ID of the card element
            cardElement.textContent = `${card.name} ${card.type} mana: ${card.mana}`;

            cardElement.classList.add('card');
            cardElement.id = card; // Set the ID of the card element

            // Append the card element to the selected drop zone
            selectedDropZoneContainer.appendChild(cardElement);

            console.log(`Placed card ${card} in drop zone ${selectedDropZoneContainer.id}`);

            // Remove the selected drop zone from the emptyDropZones array
            emptyDropZones.splice(randomIndex, 1);
        });

        // Clear opponentStage since all cards have been placed
        opponentStage = [];
    }
    attachDragDropListeners();
}

