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

        
        fetch ('/playCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId: cardId }),  // returns req.session.cardId to server.js
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log the message from the server
            // You can update the UI or perform other actions based on the response
        })
        .catch(error => {
            console.error('Error playing the card:', error);
        });

        // Create card Element and append it to the drop zone
        const cardElement = document.createElement('div');
        cardElement.textContent = cardId;
        event.target.appendChild(cardElement);

        // Identifying the drop zone
        const dropZoneId = event.target.id;
        console.log('Dropped into drop zone:', dropZoneId);
    }
})
