document.addEventListener('DOMContentLoaded', function () {
    const cardList = document.getElementById('cardList');
    const stagingArea = document.getElementById('stagingArea');
    const cardContainer = document.getElementById('cardContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentPage = 0;
    const cardsPerPage = 6;
    const cardsPerRow = 6;

    let selectedCards = [];

    // Fetch user's cards from the server
    fetch('/cards')
        .then(response => response.json())
        .then(userCards => {
            const totalCards = Object.keys(userCards).length;
            const totalPages = Math.ceil(totalCards / cardsPerPage);

            updateCardDisplay(userCards);

            // Add event listeners for pagination buttons
            prevBtn.addEventListener('click', () => navigatePage(-1));
            nextBtn.addEventListener('click', () => navigatePage(1));

            function navigatePage(direction) {
                currentPage += direction;

                if (currentPage < 0) {
                    currentPage = 0;
                } else if (currentPage >= totalPages) {
                    currentPage = totalPages - 1;
                }

                updateCardDisplay(userCards);
            }

            function updateCardDisplay(userCards) {
                // Clear existing cards
                cardContainer.innerHTML = '';

                // Calculate start and end indices for the current page
                const startIndex = currentPage * cardsPerPage;
                const endIndex = startIndex + cardsPerPage;

                // Display cards for the current page
                Object.keys(userCards).slice(startIndex, endIndex).forEach(cardId => {
                    const card = userCards[cardId];
                    const cardElement = createTradingCard(card);
                    cardElement.dataset.cardId = cardId; // Add a dataset for identifying the card
                    cardElement.draggable = true;
                    cardElement.addEventListener('click', () => selectCard(cardId));
                    cardContainer.appendChild(cardElement);
                });
            }

            function selectCard(cardId) {
                const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);

                if (selectedCards.includes(cardId)) {
                    // Deselect the card and return it to the card carousel
                    cardElement.classList.remove('selected');
                    const index = selectedCards.indexOf(cardId);
                    selectedCards.splice(index, 1);
                    cardContainer.appendChild(cardElement);
                } else {
                    // Select the card and move it to the staging area
                    if (selectedCards.length < cardsPerRow) {
                        cardElement.classList.add('selected');
                        selectedCards.push(cardId);
                        stagingArea.appendChild(cardElement);
                    } else {
                        // Start a new row in the staging area
                        const newRow = document.createElement('div');
                        newRow.classList.add('staging-row');
                        selectedCards.forEach(selectedCardId => {
                            const selectedCardElement = document.querySelector(`[data-card-id="${selectedCardId}"]`);
                            selectedCardElement.classList.remove('selected');
                            cardContainer.appendChild(selectedCardElement);
                        });
                        selectedCards = [cardId];
                        cardElement.classList.add('selected');
                        newRow.appendChild(cardElement);
                        stagingArea.appendChild(newRow);
                    }
                }
            }
        });
});

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

    // Name
    var cardName = document.createElement('h2');
    cardName.classList.add('cardName');
    cardName.textContent = cardData.cardName;

    cardHeader.appendChild(cardName);

    // Card image
    var cardImage = document.createElement('div');
    cardImage.classList.add('cardImage');

    var imageElement = document.createElement('img');
    imageElement.src = cardData.imagePath;
    imageElement.alt = 'Card Image';

    cardImage.appendChild(imageElement);

    // Card details
    var cardDetails = document.createElement('div');
    cardDetails.classList.add('cardDetails');

    var cardType = document.createElement('p');
    cardType.textContent = cardData.cardType;

    var rarity = document.createElement('p');
    rarity.textContent = cardData.rarity;

    var manaCost = document.createElement('p');
    manaCost.innerHTML = `<strong>Mana Cost:</strong> ${cardData.manaCost}`;

    var attributesList = document.createElement('ul');
    attributesList.classList.add('attributes');

    if (cardData.cardType == "spell") {
        var spellType = document.createElement('li');
        spellType.innerHTML = `<strong>Spell Type:</strong> ${cardData.spellType}`;

        var spellAbility = document.createElement('li');
        spellAbility.innerHTML = `<strong>Spell Ability:</strong> ${cardData.spellAbility}`;

        var spellAttack = document.createElement('li');
        spellAttack.innerHTML = `<strong>Spell Attack:</strong> ${cardData.spellAttack}`;

        var spellDefense = document.createElement('li');
        spellDefense.innerHTML = `<strong>Spell Defense:</strong> ${cardData.spellDefense}`;

        attributesList.appendChild(spellType);
        attributesList.appendChild(spellAbility);
        attributesList.appendChild(spellAttack);
        attributesList.appendChild(spellDefense);
    }

    var attack = document.createElement('li');
    attack.innerHTML = `<strong>Attack:</strong> ${cardData.attack}`;

    var defense = document.createElement('li');
    defense.innerHTML = `<strong>Defense:</strong> ${cardData.defense}`;

    attributesList.appendChild(attack);
    attributesList.appendChild(defense);

    // Build card body
    cardDetails.appendChild(cardType);
    cardDetails.appendChild(rarity);
    cardDetails.appendChild(manaCost);
    cardDetails.appendChild(attributesList);

    // Append elements to card content
    cardContent.appendChild(cardHeader);
    cardContent.appendChild(cardImage);
    cardContent.appendChild(cardDetails);

    // Append card content to card container
    cardContainer.appendChild(cardContent);

    return cardContainer;
}
