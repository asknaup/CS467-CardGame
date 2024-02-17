document.addEventListener('DOMContentLoaded', function() {
    const cardList = document.getElementById('cardList');
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');

    // Fetch user's cards from the server
    fetch('/cards')
        .then(response => response.json())
        .then(userCards => {
            Object.keys(userCards).forEach(cardId => {
                const card = userCards[cardId];
                
                // Card HTML properties
                const cardElement = document.createElement('div');
                // cardElement.textContent = card.cardName;
                cardElement.draggable = true;
                
                // Card Image properties
                const imgElement = document.createElement('img');
                imgElement.src = 'Default_trading_card_game_card_samurai_warrior_the_number_1_in_3.jpg';
                imgElement.alt = card.cardName;
                imgElement.classList.add('card-image');

                cardElement.appendChild(imgElement);
                cardElement.addEventListener('dragstart', dragStart);
                cardContainer.appendChild(cardElement);
            })
        });

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
    }

    stagingArea.addEventListener('dragover', dragOver);
    stagingArea.addEventListener('drop', drop);

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const cardName = event.dataTransfer.getData('text/plain');
        const cardElement = document.createElement('div');
        cardElement.textContent = cardName;
        stagingArea.appendChild(cardElement)
    }
});



// //TODO: dbfunc import statement killing off the card display for some reason
// // import { dbFunc.getCardIdByUser } from './db-functionsCards.js';
// // import { gcc.createTradingCard } from "./generalCardCode.js"; // Change file extension to .js
// // import { gcc.convertListToDict } from "./generalCardCode.js"; // Change file extension to .js
// const dbFunc = require('../database/db-functions');
// const gcc = require('./generalCardCode');// Import the card data router
// // const cardDataRouter = require('../routes/cardDataRouter'); // Assuming the router file is in the 'routes' directory

// // // Mount the card data router at the desired path
// // app.use('/api', cardDataRouter);

// document.addEventListener('DOMContentLoaded', async function () {
//     //Retrieve userId from data attribute 
//     const userId = document.body.getAttribute('data-user-id');
//     console.log(userId);
//     try{
//         // Fetch cards from DB
//     const response = await fetch(`/api/cards?userId=${userId}`);
//     const cardData = await response.json();

//     // Convert to dictionary of dictionaries with key being cardId
//     const cardsDict = gss.convertListToDict(cardData);

//     // Render cards once data is fetched
//     displayCards(cardsDict);
//     } catch (error) {
//         console.error('Error fetching card data:', error)
//     }
    
// });

// // Funciton to render cards
// function displayCards(cardData) {
//     const cardContainer = document.getElementById('cardContainer');
//     const cardTemplateSource = document.getElementById('card-template').innerHTML;
//     const cardTemplate = Handlebars.compile(cardTemplateSource);

//     cardContainer.innerHTML = ''; // Clear previous card

//     cardData.array.forEach(card => {
//         const cardHTML = cardTemplate(card);
//         cardContainer.innerHTML += cardHTML;
//     });

// }


// //TODO: Fix reset button, doesn't work using generalCardCode for some reason

// // var exampleCards = dbFunc.getCardIdByUser(1001);

// // // Card container element from the HTML
// // // var cardContainer = document.getElementById('cardContainer');

// // // Navigation buttons and counter element
// // // var prevBtn = document.getElementById('prevBtn');
// // // var nextBtn = document.getElementById('nextBtn');
// // // var carouselCounter = document.getElementById('carouselCounter');

// // // Set the current index for card display
// // var currentIndex = 0;

// // // Set staging area element from the HTML
// // var stagingArea = document.getElementById('stagingArea');

// // // Track the number of cards staged
// // var stagedCardCount = 0;
// // var deckLimit = 12;
// // var displayLimit = 5;

// // // TODO: Make it so that when the user clicks on a card in the staging area, it returns to the carousel
// // //TODO: Make it so that when a card moves from the carousel i.e. clicked in the carousel and to the staging area, it is no longer occupying the carousel
// // // TODO: Discuss if limiting is the best approach UI-wise

// // // Function to move a card to the staging area
// // function moveCardToStagingArea(cardData) {
// //     var clonedCard = gcc.createTradingCard(cardData);

// //     clonedCard.classList.add('staged-card');
// //     stagingArea.appendChild(clonedCard);

// //     // Increment the staged card count
// //     stagedCardCount++;
// // }

// // //TODO: Fix movement from carousel to staging back to carousel
// // //TODO: Get cards from carousel to be removed once they're staged and vice versa, push vs pop
// // //TODO: Fix every button

// // // Add click event to each created card for moving it to the staging area
// // function addClickEventToCard(createdCard, cardData) {
// //     createdCard.addEventListener('click', function () {
// //         moveCardToStagingArea(cardData);
// //     });
// // }

// // // Function to remove a card from the staging area
// // function removeCardFromStagingArea(cardElement) {
// //     // Remove the card element from the staging area
// //     stagingArea.removeChild(cardElement);

// //     // Decrement the staged card count
// //     stagedCardCount--;

// //     // Add the card back to the carousel
// //     var cardData = extractCardData(cardElement);
// //     addCardToCarousel(cardData);
// // }

// // // Assuming you have an element with id="cardContainer" where you want to render the cards
// // var cardContainer = document.getElementById('cardContainer');

// // // Compile the Handlebars template
// // var cardTemplate = Handlebars.compile(document.getElementById('card-template').innerHTML);

// // // Function to create and append cards to the card container
// // // function displayCards(startIndex) {
// // //     // Clear previous cards
// // //     cardContainer.innerHTML = '';

// // //     // Display three cards at a time
// // //     for (var i = startIndex; i < startIndex + displayLimit && i < exampleCards.length; i++) {
// // //         var cardData = exampleCards[i];
// // //         var cardHTML = cardTemplate(cardData);

// // //         var cardElement = document.createElement('div');
// // //         cardElement.innerHTML = cardHTML.trim();

// // //         // Add a click event to the created card for moving it to the staging area
// // //         addClickEventToCard(cardElement, cardData);

// // //         cardContainer.appendChild(cardElement.firstChild);
// // //     }

// // //     // Update the current index
// // //     currentIndex = startIndex;

// // //     // Update navigation button visibility
// // //     updateNavigationButtons();

// // //     // Update carousel counter
// // //     var currentSet = Math.floor((currentIndex + 1) / displayLimit) + 1;
// // //     carouselCounter.textContent = currentSet;
// // // }
// // // Function to remove a card from the carousel
// // function removeCardFromCarousel(cardData) {
// //     // Implement the logic to remove the card from the carousel
// //     exampleCards = exampleCards.filter(function (card) {
// //         return card !== cardData;
// //     });

// //     // Redisplay the remaining cards in the carousel
// //     displayCards(currentIndex);
// // }

// // // Function to add a card back to the carousel
// // //TODO: Implement this so that it works, need a db connection
// // function addCardToCarousel(cardData) {
// //     // Implement the logic to add the card back to the carousel
// //     exampleCards.push(cardData);

// //     // Redisplay the cards in the carousel
// //     displayCards(currentIndex);
// // }

// // // Function to navigate through cards
// // function navigateCards(offset) {
// //     var newIndex = currentIndex + offset;
// //     displayCards(newIndex);
// // }

// // // Update navigation button visibility
// // function updateNavigationButtons() {
// //     prevBtn.disabled = currentIndex === 0;
// //     nextBtn.disabled = currentIndex + displayLimit >= exampleCards.length;
// // }

// // // Function to reset the game
// // // Function to reset the staging area and refresh the page
// // function resetStagingArea() {
// //     // Display a confirmation dialog
// //     var confirmReset = window.confirm("Are you sure you want to reset?");

// //     if (confirmReset) {
// //         // Reset the staging area (clear cards)
// //         stagingArea.innerHTML = '';
// //         stagedCardCount = 0;

// //         // Adjust the staging area height (if needed)
// //         adjustStagingAreaHeight();

// //         // Refresh the page
// //         window.location.reload();
// //     }
// // }

// // // Function to save the deck
// // function saveDeck() {
// //     // Your save deck logic goes here
// //     // For example, you can display an alert
// //     alert("Deck saved!");
// // }

// // // Attach the saveDeck function to the Save Deck button click event
// // document.getElementById('saveDeckButton').addEventListener('click', saveDeck);

// // // Attach the resetStagingArea function to the Reset button click event
// // document.getElementById('resetButton').addEventListener('click', resetStagingArea);

// // // Function to clear the staging area
// // function clearStagingArea() {
// //     // Remove all cards from the staging area
// //     while (stagingArea.firstChild) {
// //         stagingArea.removeChild(stagingArea.firstChild);
// //     }

// //     // Reset the staged card count
// //     stagedCardCount = 0;
// // }

// // // Display the initial set of cards
// // // displayCards(0);

// // //TODO: Integrate connections with db
// // // TODO: Pull cards from the user card library and eliminate them once staged for the deck
// // // TODO: Add a completion button to finalize deck layout
// // // TODO: Address scalability - what if the deck is 20 cards? What if the user library is 100 cards deep?