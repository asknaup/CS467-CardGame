// gamePlay1Helper.js
// Game play for RuleSet 1
// Client Side Javascript

document.addEventListener('DOMContentLoaded', function () {
    const hand = document.getElementById('hand');
    const handList = document.querySelectorAll("#hand .card");
    const playerDropZones = document.querySelectorAll(".player .drop-zone");
    console.log(handList);

    handList.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    })

    function dragStart(event) {
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

    function drop(event) {
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
                    console.log(cardData.type)
                    if (cardData.type.toLowerCase() === 'creature') {
                        // Only creature cards can be played in the staging area
                        fetch('/playCard', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ cardId: cardId }),  // returns req.session.cardId to server.js
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.message); // Log the message from the server
                                // Update the UI based on the response
                                if (data.message === 'card played successfully') {
                                    const handElement = document.getElementById('hand');
                                    const cardElement = document.getElementById(cardId);

                                    if (handElement && cardElement) {
                                        handElement.removeChild(cardElement);
                                    }

                                    // Create new Card element and append it to the drop zone
                                    const dropZone = event.target;

                                    // Hide p when card is played
                                    const pElement = dropZone.querySelector('p');
                                    if (pElement) {
                                        pElement.style.display = 'none';
                                    }
                                    dropZone.appendChild(cardElement);

                                    document.querySelector('#playerMana').textContent = `Player Mana: ${data.playerMana}`;
                                } else if (data.message === 'Insufficient mana to play this card.') {
                                    // Display an error message for insufficient mana
                                    const dropZoneId = dropZone.id;
                                    displayErrorMessage('Error: Insufficient mana to play this card', dropZoneId)
                                } else {
                                    // Handle error or display a message to the user
                                    console.error('Error:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error playing the card:', error);
                            });

                    } else if (cardData.type.toLowerCase() === 'spell') {
                        // Display an error message for spell cards being played in the drop zone
                        const dropZoneId = dropZone.id;
                        displayErrorMessage('Error: Cannot play Spell card in staging area. Must be applied to player or Creature card',
                            dropZoneId);
                    }
                })

        } else {
            // If there is already a card in the drop zone, display an error message
            const dropZoneId = dropZone.id;
            displayErrorMessage('Error: There is already a card here', dropZoneId)
        }
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