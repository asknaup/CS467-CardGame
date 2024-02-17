// gamePlay1Helper.js
// Game play for RuleSet 1

document.addEventListener('DOMContentLoaded', function () {
    const hand = document.getElementById('hand');
    const handList = document.querySelectorAll("#hand .card");
    const playerDropZones = document.querySelectorAll(".player .drop-zone");
    console.log(handList);

    handList.forEach(card => { 
        // const cardElement = document.createElement('div');
        // cardElement.draggable = true;
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
        const cardElement = document.createElement('div');
        cardElement.textContent = cardId;
        event.target.appendChild(cardElement);
    
        // Identifying the drop zone
        const dropZoneId = event.target.id;
        console.log('Dropped into drop zone:', dropZoneId);
    }
})

// Enable drag and drop dunctionality
// document.addEventListener("DOMContentLoaded", () => {
//     const handCards = document.querySelectorAll("#hand .card");
//     const playerDropZones  = document.querySelectorAll(".player .drop-zone");

//     handCards.forEach(card => {
//         card.addEventListener("dragstart", dragStart);
//     });

//     playerDropZones .forEach(dropZone => {
//         dropZone.addEventListener("dragover", dragOver);
//         dropZone.addEventListener("drop", drop);
//     })
// });

// function dragStart(event) {
//     event.dataTransfer.setData("text/plain", event.target.id);
// }

// function dragOver(event) {
//     event.preventDefault();
// }

// function drop(event) {
//     event.preventDefault();
//     const cardId = event.dataTransfer.getData("text/plain");
//     const cardElement = document.getElementById(cardId);

//     // Find cloest drop zone
//     const dropZone = event.target.cloest('.drop-zone');

//     // Check if the drop target is a player card slot
//     if (dropZone) {
//         // Append the card to the drop zone
//         dropZone.appendChild(cardElement);
//     } else {
//         // If the drop target is not a player card slot, do nothing or handle the case as needed
//         console.log('Invalid drop target');
//     }
// }
