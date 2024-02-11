class Card{
    constructor(primaryKey, cardName, imageSrc, description, additionalText, attributes){
        this.primaryKey = primaryKey;
        this.cardName = cardName;
        this.imageSrc = imageSrc;
        this.description = description;
        this.additionalText = additionalText;
        this.attributes = attributes;
    }
}

function appendTitle(cardObj, scrollCard){
    // this creates the image for the card
    let cardTitle = document.createElement("h3");
    cardTitle.innerHTML = cardObj.cardName;
    cardTitle.style.margin = "0vh 1vh";
    scrollCard.appendChild(cardTitle);
}

function appendImage(cardObj, scrollCard){
    let frame = document.createElement("div");
    frame.style.margin = "0vh .5vh";
    // this creates the image for the card
    let cardImage = document.createElement("img");
    cardImage.style.border = "3px solid black";
    cardImage.src = cardObj.imageSrc;
    frame.appendChild(cardImage);
    scrollCard.appendChild(frame);
}

function appendAttributes(cardObj, scrollCard){
    // create attributes list 
    var attributesList = document.createElement('ul');
    attributesList.style.listStyle = "none";
    attributesList.style.fontSize = "1em";
    attributesList.classList.add('attributes');
    var attributes = cardObj.attributes;
    var attributeItem = document.createElement("li");
    attributeItem.innerHTML = `<strong> hp: </strong> ${attributes.hp} &nbsp;&nbsp; <strong> gold: </strong> ${attributes.goldCost}`;
    attributesList.append(attributeItem);
    var attributeItem = document.createElement("li");
    attributeItem.innerHTML = `<strong> atk: </strong> ${attributes.atk} &nbsp;&nbsp; <strong> def: </strong> ${attributes.def}`;
    attributesList.append(attributeItem);
    scrollCard.appendChild(attributesList);
}

function appendDescription(cardObj, scrollCard){
    var description = document.createElement("p");
    description.innerHTML = `<strong> ${cardObj.description} </strong>`;
    description.style.padding = "0vh .5vh";
    description.style.fontSize = "1em";
    scrollCard.appendChild(description);
}

// TODO: Standardize card form format
function createCardElement(position, width, height, zIndex, cardObj){
    // create the div that becomes the card
    var scrollCard = document.createElement("div");
    scrollCard.setAttribute("class", "newCard");
    scrollCard.setAttribute('id', cardObj.primaryKey);
    appendTitle(cardObj, scrollCard);
    appendImage(cardObj, scrollCard);
    // this is all the css for this card
    scrollCard.style.position = position;
    scrollCard.style.bottom = "0vw";
    scrollCard.style.width = (width).toString() + "vw";
    scrollCard.style.height = (height).toString() + "vw";
    scrollCard.style.backgroundColor = "beige";
    scrollCard.style.border = "3px solid black";
    scrollCard.style.borderRadius = "5px";
    scrollCard.style.zIndex = zIndex;
    appendAttributes(cardObj, scrollCard);
    appendDescription(cardObj, scrollCard);
    // creates the same affect as #id.hover { z-index: [value goes here]}
    scrollCard.onmouseenter = function(){this.style.zIndex = "9999"};
    scrollCard.onmouseleave = function(){this.style.zIndex = zIndex};
    return scrollCard;
}

function setCardPlacement(left, bottom, scrollCard){
    scrollCard.style.left = (left).toString() + "vw";
    scrollCard.style.bottom = (bottom).toString() + "vw";
}

function displayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var scrollDeck = document.getElementById("cardSlots");
    var width = 10;
    var height = 19;
    var left = .25;
    var bottom = 0;
    var zIndex = 0;
    for (let i = startIndex; i <= endIndex; i++){
        scrollCard = createCardElement("absolute", width, height, zIndex, cardArr[i]);
        setCardPlacement(left, bottom, scrollCard)
        scrollDeck.appendChild(scrollCard);
        zIndex += 1;
        left += 6.25;
    }
}

/* Create Example Dummy Cards */
// Example cards data (you can add more)
var exampleCards = [
    /*params: primaryKey,   cardName,       imageSrc,                   description,
            additionalText, attributes){    */
    new Card("primaryKey0", "Goblin", 'images/goblin-willow-tree.jpg', 'A small forest goblin.', 
            'Creature', {hp:50, atk:50, def:30, specialAbility:'Cooking', goldCost:5}),
    /*params: primaryKey,   cardName,       imageSrc,                   description,
            additionalText, attributes){    */
    new Card("primaryKey1", 'Fire Ball Scroll', 'images/dark-wizard.png',  'A powerful fire ball.',
            'Spell', {hp:80, atk:60, def:20, specialAbility:'Fire Ball', goldCost:7}),
    /*params: primaryKey,   cardName,       imageSrc,               description,
            additionalText, attributes){    */
    new Card("primaryKey2", 'Ice Dragon', 'images/ice-dragon.png', 'An ice dragon from the North.', 
            'Creature', {hp:120, atk:100, def:80, specialAbility:'Flying', goldCost:9})
    // Add more cards as needed
];
cardArr = [];
for (let i = 0; i<=33; i++){
    let numCards = exampleCards.length;
    let exampleCardsIndex = Math.floor(Math.random() * numCards);
    cardArr.push(exampleCards[exampleCardsIndex]);
}


/* main code for tradeAndCollect */
var numScrollCards = 12;
var startIndex = 0;
var endIndex = numScrollCards - 1;
displayScrollCards(startIndex, endIndex, cardArr);

var scrollRightButton = document.getElementById("scrollRight");
scrollRightButton.addEventListener("click", () => {
    if (endIndex < cardArr.length - 1){
        startIndex = endIndex + 1;
        endIndex += numScrollCards;
        if (endIndex > cardArr.length - 1){
            endIndex = cardArr.length - 1
        }
        console.log(startIndex);
        console.log(endIndex);
        displayScrollCards(startIndex, endIndex, cardArr);
    }
});

var scrollLeftButton = document.getElementById("scrollLeft");
scrollLeftButton.addEventListener("click", () => {
    if (startIndex > 0){
        endIndex = startIndex - 1;
        startIndex -= numScrollCards;
        if(startIndex < 0){
            startIndex = 0;
        }
        console.log(startIndex);
        console.log(endIndex);
        displayScrollCards(startIndex, endIndex, cardArr);
    }
});

//TODO: add function that puts card into stage area
/* I think it should move the card from scrolldeck and not clone it. 
Meaning there's an empty slot in scroll deck */
