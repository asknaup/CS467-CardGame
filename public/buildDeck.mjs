//TODO: dbfunc import statement killing off the card display for some reason
// import dbFunc from './database/db-functions';
import { createTradingCard } from "./generalCardCode.mjs";

//TODO: Fix reset button, doesn't work using generalCardCode for some reason

// Example cards data (you can add more)
var exampleCards = [
    {
        name: 'Goblin',
        image: 'images/goblin-willow-tree.jpg',
        description: 'A small forest goblin.',
        cardType: 'Creature',
        attributes: {
            HP: 100,
            Attack: 50,
            Defense: 30,
            'Special Ability': 'Cooking',
            'Gold Cost': 5,
        },
    },
    {
        name: 'Fire Ball Scroll',
        image: 'images/dark-wizard.png',
        description: 'A powerful fire ball.',
        cardType: 'Spell',
        attributes: {
            HP: 80,
            Attack: 60,
            Defense: 20,
            'Special Ability': 'Fire Ball',
            'Gold Cost': 7,
        },
    },

    {
        name: 'Ice Dragon',
        image: 'images/ice-dragon.png',
        description: 'An ice dragon from the North.',
        cardType: 'Creature',
        attributes: {
            HP: 50,
            Attack: 20,
            Defense: 10,
            'Special Ability': 'Flying',
            'Gold Cost': 9,
        },
    },
    {
        name: 'Goblin 2!!',
        image: 'images/goblin-willow-tree.jpg',
        description: 'A small forest goblin.',
        cardType: 'Creature',
        attributes: {
            HP: 100,
            Attack: 50,
            Defense: 30,
            'Special Ability': 'Cooking',
            'Gold Cost': 5,
        },
    },
    {
        name: 'Fire Ball Scroll 2!!',
        image: 'images/ice-dragon.png',
        description: 'A powerful fire ball.',
        cardType: 'Spell',
        attributes: {
            HP: 80,
            Attack: 60,
            Defense: 20,
            'Special Ability': 'Fire Ball',
            'Gold Cost': 7,
        },
    },

    {
        name: 'Ice Dragon 2!!',
        image: 'images/ice-dragon.png',
        description: 'An ice dragon from the North.',
        cardType: 'Creature',
        attributes: {
            HP: 50,
            Attack: 20,
            Defense: 10,
            'Special Ability': 'Flying',
            'Gold Cost': 9,
        },
    },
    {
        name: 'Goblin 3!!!',
        image: 'images/dark-wizard.png',
        description: 'A small forest goblin.',
        cardType: 'Creature',
        attributes: {
            HP: 100,
            Attack: 50,
            Defense: 30,
            'Special Ability': 'Cooking',
            'Gold Cost': 5,
        },
    },
    {
        name: 'Fire Ball Scroll 3!!!',
        image: 'images/dark-wizard.png',
        description: 'A powerful fire ball.',
        cardType: 'Spell',
        attributes: {
            HP: 80,
            Attack: 60,
            Defense: 20,
            'Special Ability': 'Fire Ball',
            'Gold Cost': 7,
        },
    },
    // Add more cards as needed
    {
        name: 'Ice Dragon 3!!!',
        image: 'images/goblin-willow-tree.jpg',
        description: 'An ice dragon from the North.',
        cardType: 'Creature',
        attributes: {
            HP: 50,
            Attack: 20,
            Defense: 10,
            'Special Ability': 'Flying',
            'Gold Cost': 9,
        },
    },
];

// var exampleCards = dbFunc.getCardIdByUser(1001);
// console.log(exampleCards);

// Card container element from the HTML
var cardContainer = document.getElementById('cardContainer');

// Navigation buttons and counter element
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var carouselCounter = document.getElementById('carouselCounter');

// Set the current index for card display
var currentIndex = 0;

// Set staging area element from the HTML
var stagingArea = document.getElementById('stagingArea');

// Track number of cards staged
var stagedCardCount = 0;
var deckLimit = 12;
var displayLimit = 5;

// TODO: Make it so that when the user clicks on a card in the staging area, it returns to the carousel
//TODO: Make it so that when a card moves from the carousel i.e. clicked in the carousel and to the staging area, it is no longer occupying the carousel
// TODO: Discuss if limiting is best approach UI wise

// Function to move a card to the staging area
function moveCardToStagingArea(cardData) {
    if (stagedCardCount < deckLimit) {
        // Clone the card for the staging area using the clicked card data
        var clonedCard = createTradingCard(cardData);

        // Add a click event to the cloned card for removing it from the staging area
        clonedCard.addEventListener('click', function () {
            removeCardFromStagingArea(clonedCard);
        });

        // Set a class for styling and layout purposes
        clonedCard.classList.add('staged-card');

        // Append the cloned card to the staging area
        stagingArea.appendChild(clonedCard);

        // Remove the card from the carousel
        removeCardFromCarousel(cardData);

        // Increment the staged card count
        stagedCardCount++;

    } else {
        // Optionally provide feedback to the user that the limit has been reached
        console.log('Maximum number of cards staged reached (5 cards).');
    }
}

// Add click event to each created card for moving it to the staging area
function addClickEventToCard(createdCard, cardData) {
    createdCard.addEventListener('click', function () {
        moveCardToStagingArea(cardData);
    });
}

// Function to remove a card from the staging area
function removeCardFromStagingArea(cardElement) {
    // Remove the card element from the staging area
    stagingArea.removeChild(cardElement);

    // Decrement the staged card count
    stagedCardCount--;

    // Add the card back to the carousel
    var cardData = extractCardData(cardElement);
    addCardToCarousel(cardData);
}

// Function to create and append cards to the card container
function displayCards(startIndex) {
    // Clear previous cards
    cardContainer.innerHTML = '';

    // Display three cards at a time
    for (var i = startIndex; i < startIndex + displayLimit && i < exampleCards.length; i++) {
        var cardData = exampleCards[i];
        var createdCard = createTradingCard(cardData);

        // Add a click event to the created card for moving it to the staging area
        addClickEventToCard(createdCard, cardData);

        cardContainer.appendChild(createdCard);
    }

    // Update the current index
    currentIndex = startIndex;

    // Update navigation button visibility
    updateNavigationButtons();

    // Update carousel counter
    var currentSet = Math.floor((currentIndex + 1) / displayLimit) + 1;
    carouselCounter.textContent = currentSet;
}

// Function to remove a card from the carousel
function removeCardFromCarousel(cardData) {
    // Implement the logic to remove the card from the carousel
    exampleCards = exampleCards.filter(function (card) {
        return card !== cardData;
    });

    // Redisplay the remaining cards in the carousel
    displayCards(currentIndex);
}

// Function to add a card back to the carousel
//TODO: Implement this so that it works, need db connection
function addCardToCarousel(cardData) {
    // Implement the logic to add the card back to the carousel
    exampleCards.push(cardData);

    // Redisplay the cards in the carousel
    displayCards(currentIndex);
}

// Function to navigate through cards
function navigateCards(offset) {
    var newIndex = currentIndex + offset;
    displayCards(newIndex);
}

// Update navigation button visibility
function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + displayLimit >= exampleCards.length;
}

// Function to reset the game
// TODO: Make reset repopulate the carousel with db cards
function resetGame() {
    // Clear the staging area
    clearStagingArea();

    // Reset the exampleCards array (replace with db link)
    // exampleCards = [...initialExampleCards];

    // Redisplay the cards in the carousel
    displayCards(currentIndex);
}

// Function to clear the staging area
function clearStagingArea() {
    // Remove all cards from the staging area
    while (stagingArea.firstChild) {
        stagingArea.removeChild(stagingArea.firstChild);
    }

    // Reset the staged card count
    stagedCardCount = 0;
}

// Display initial set of cards
displayCards(0);


//TODO: Integrate connections with db
// TODO: Pull cards from user card library and eliminate them once staged for the deck
// TODO: Add completion button to finalize deck layout
// TODO: Address scalability - what if the deck is 20 cards? what if the user library is 100 cards deep?