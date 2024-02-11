
// TODO: Standardize card form format
// function createCardElement(idString, leftVal, cardObj) {
//     // create the div that becomes the card
//     var scrollCard = document.createElement("div");
//     scrollCard.setAttribute("class", "newCard");
//     scrollCard.setAttribute('id', "card" + idString);

//     // TODO: Plug in the text content for the card name from db
//     scrollCard.textContent = cardObj.name;

//     // this creates the image for the card
//     let cardImage = document.createElement("img");
//     cardImage.src = cardObj.imageSrc;
//     cardImage.style.margin = "2px";
//     scrollCard.appendChild(cardImage);

//     // creates the same affect as #id.hover { z-index: [value goes here]}
//     scrollCard.onmouseenter = function () { this.style.zIndex = "999" };
//     scrollCard.onmouseleave = function () { this.style.zIndex = idString };
//     return scrollCard;
// }

// function displayScrollCards(startIndex, endIndex, cardArr) {
//     // Clear out old card elements
//     var oldCards = document.getElementsByClassName("newCard");
//     for (let i = oldCards.length - 1; i >= 0; i--) {
//         oldCards[i].remove();
//     }
//     var scrollDeck = document.getElementById("cardSlots");
//     var cardId = 0;
//     var left = 0;
//     for (let i = startIndex; i <= endIndex; i++) {
//         scrollCard = createCardElement(cardId.toString(), left, cardArr[i]);
//         scrollDeck.appendChild(scrollCard);
//         cardId += 1;
//         left += 5;
//     }
// }
// Function to create a trading card
function createTradingCard(cardData) {

    // Card container
    var cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    // Card content
    var cardContent = document.createElement('div');
    cardContent.classList.add('cardContent');

    // Card header
    var cardHeader = document.createElement('div');

    var cardName = document.createElement('h2');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.name;

    cardHeader.appendChild(cardName);

    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.image;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    // Card details
    var cardDetails = document.createElement('div');
    cardDetails.classList.add('cardDetails');

    var cardDescription = document.createElement('p');
    cardDescription.classList.add('cardDescription');
    cardDescription.textContent = cardData.description;

    var additionalText = document.createElement('p');
    additionalText.textContent = cardData.cardType; // Set additional text content

    var attributesList = document.createElement('ul');
    attributesList.classList.add('attributes');

    // Iterate through card attributes to create list items
    Object.keys(cardData.attributes).forEach(function (attribute) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${attribute}:</strong> ${cardData.attributes[attribute]}`;
        attributesList.appendChild(listItem);
    });

    // Build card body
    cardDetails.appendChild(cardDescription);
    cardDetails.appendChild(additionalText);
    cardDetails.appendChild(attributesList);

    // Append elements to card content
    cardContent.appendChild(cardHeader);
    cardContent.appendChild(cardImage);
    cardContent.appendChild(cardDetails);

    // Append card content to card container
    cardContainer.appendChild(cardContent);

    return cardContainer;
}

// Example cards data (you can add more)
var exampleCards = [
    {
        name: 'Goblin',
        image: 'images/goblin-willow-tree.jpg',
        description: 'A small forest goblin.',
        additionalText: 'Creature',
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
        additionalText: 'Spell',
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
        name: 'Ice Dragon',
        image: 'images/ice-dragon.png',
        description: 'An ice dragon from the North.',
        additionalText: 'Creature',
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
        additionalText: 'Creature',
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
        additionalText: 'Spell',
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
        name: 'Ice Dragon 2!!',
        image: 'images/ice-dragon.png',
        description: 'An ice dragon from the North.',
        additionalText: 'Creature',
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
        additionalText: 'Creature',
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
        additionalText: 'Spell',
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
        additionalText: 'Creature',
        attributes: {
            HP: 50,
            Attack: 20,
            Defense: 10,
            'Special Ability': 'Flying',
            'Gold Cost': 9,
        },
    },
];

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

// Move a card to the staging area
function moveCardToStagingArea(cardData) {
    if (stagedCardCount < 5) {

        // Clone the card for the staging area using the clicked card data
        var clonedCard = createTradingCard(cardData);

        // Add click event to the cloned card for interactions
        clonedCard.addEventListener('click', function () {
            // Implement the logic for card interactions here
            // TODO: Make it so that when the user clicks on a card in the staging area, it returns to the carousel
            //TODO: Make it so that when a card moves from the carousel i.e. clicked in the carousel and to the staging area, it is no longer occupying the carousel
            console.log('Card clicked in the staging area!');
        });

        // Set class for styling and layout 
        clonedCard.classList.add('stagedCard');

        // Append the cloned card to the staging area
        stagingArea.appendChild(clonedCard);

        // Increment staged card count
        stagedCardCount++;

    } else {
        // Trade limit reached
        // TODO: Discuss if limiting is best approach UI wise
        console.log('Maximum number of cards staged reached (5 cards).');
    }
}

// Add click event to each created card for moving it to the staging area
function addClickEventToCard(createdCard, cardData) {
    createdCard.addEventListener('click', function () {
        moveCardToStagingArea(cardData);
    });
}

// Create and append cards to the card container
function displayCards(startIndex) {
    // Clear previous cards
    cardContainer.innerHTML = '';

    // Display three cards at a time
    for (var i = startIndex; i < startIndex + 3 && i < exampleCards.length; i++) {
        var cardData = exampleCards[i];
        var createdCard = createTradingCard(cardData);

        // Add click event to the created card for moving it to the staging area
        addClickEventToCard(createdCard, cardData);

        cardContainer.appendChild(createdCard);
    }

    // Update current index
    currentIndex = startIndex;

    // Update navigation button visibility
    updateNavigationButtons();

    // Update carousel counter
    var currentSet = Math.floor((currentIndex + 1) / 3) + 1;
    carouselCounter.textContent = currentSet;
}


// Function to navigate through cards
function navigateCards(offset) {
    var newIndex = currentIndex + offset;
    displayCards(newIndex);
}

// Update navigation button visibility
function updateNavigationButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + 3 >= exampleCards.length;
}

// Display initial set of cards
displayCards(0);


//TODO: Integrate connections with db