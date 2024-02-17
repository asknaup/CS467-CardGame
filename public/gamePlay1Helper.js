// gamePlay1Helper.js
// Game play for RuleSet 1

// Handle button click to end turn
document.getElementById('endTurnButton').addEventListener('click', async () => {
    const response = await fetch('/play-card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cardId: 'selectedCardId'}) // Replace 'selectedCardId' with the actual card ID
    });

    if (response.ok) {
        // Handle successful response from the server
        const data = await response.json();
        console.log(data.message);
    } else {
        // Handle error response from the server
        console.error('Error:', response.statusText);
    }
})

// Enable drag and drop dunctionality
document.addEventListener("DOMContentLoaded", () => {
    const handCards = document.querySelectorAll("#hand .card");
    const dropZone = document.getElementById("drop-zone");

    handCards.forEach(card => {
        card.addEventListener("dragstart", dragStart);
    });

    dropZone.addEventListener("dragover", dragOver);
    dropZone.addEventListener("drop", drop);
});

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain"); 
    const cardElement = document.getElementById(cardId);

    // Check if the drop target is a player card slot
    if (event.target.classList.contains('drop-zone')) {
        // Append the card to the drop zone
        event.target.appendChild(cardElement);
    } else {
        // If the drop target is not a player card slot, do nothing or handle the case as needed
        console.log('Invalid drop target');
    }
}