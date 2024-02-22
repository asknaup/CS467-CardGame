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
    cardName.textContent = cardData.cardName;

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

function createTradingCardWithId(id, cardData){
    let cardContainer = createTradingCard(cardData);
    cardContainer.setAttribute('id', id);
    return cardContainer;
}