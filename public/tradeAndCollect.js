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
    let cardTitle = document.createElement("h4");
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
function createCardElement(position, width, height, cardObj){
    // create the div that becomes the card
    var scrollCard = document.createElement("div");
    scrollCard.setAttribute("class", "newCard");
    scrollCard.setAttribute('id', cardObj.primaryKey);
    appendTitle(cardObj, scrollCard);
    appendImage(cardObj, scrollCard);
    // this is all the css for this card
    scrollCard.style.position = position;
    scrollCard.style.margin = ".5vh";
    scrollCard.style.bottom = "0vw";
    scrollCard.style.width = (width).toString() + "vw";
    scrollCard.style.height = (height).toString() + "vw";
    scrollCard.style.color = "black";
    scrollCard.style.backgroundColor = "beige";
    scrollCard.style.border = "3px solid black";
    scrollCard.style.borderRadius = "5px";
    appendAttributes(cardObj, scrollCard);
    appendDescription(cardObj, scrollCard);
    // creates the same affect as #id.hover { z-index: [value goes here]}
    scrollCard.onmouseenter = function(){
        this.style.width = (width + 1).toString() + "vw";;
        this.style.height = (height + 1).toString() + "vw";
    };
    scrollCard.onmouseleave = function(){
        scrollCard.style.width = (width).toString() + "vw";
        scrollCard.style.height = (height).toString() + "vw";
    };
    scrollCard.onclick = function(){
        if(this.parentNode.id === "cardSlots"){
            this.removeAttribute("class");
            var stageAreaZero = document.getElementById("stageAreaZero");
            stageAreaZero.appendChild(this);
        };
    };
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
    var cardSlots = document.getElementById("cardSlots");
    var width = 10.5;
    var height = 18.5;
    for (let i = startIndex; i <= endIndex; i++){
        scrollCard = createCardElement("relative", width, height, cardArr[i]);
        cardSlots.appendChild(scrollCard);
    }
}

/* Create Example Dummy Cards */
// Example cards data (you can add more)
var exampleCards = [
    goblinObj = {primaryKey: "primaryKey0", cardName: "Goblin", imageSrc: 'images/goblin-willow-tree.jpg', 
            description: 'A small forest goblin.', additionalText:'Creature', 
            attributes: {hp:50, atk:50, def:30, specialAbility:'Cooking', goldCost:5}},
    wizardObj = {primaryKey: "primaryKey1", cardName: 'Fire Ball Scroll', imageSrc: 'images/dark-wizard.png',  
                description:'A powerful fire ball.', additionalText: 'Spell', 
                attributes: {hp:80, atk:60, def:20, specialAbility:'Fire Ball', goldCost:7}},
    iceDragonObj = {primaryKey: "primaryKey2", cardName: 'Ice Dragon', imageSrc: 'images/ice-dragon.png', 
                    description: 'An ice dragon from the North.', additionalText: 'Creature', 
                    attributes: {hp:120, atk:100, def:80, specialAbility:'Flying', goldCost:9}}
    // Add more cards as needed
];

cardArr = [];
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardObj = exampleCards[randomIndex];
    cardArr.push(new Card(cardObj.primaryKey, cardObj.cardName, cardObj.imageSrc,
                cardObj.description, cardObj.additionalText, cardObj.attributes));
}


/* main code for tradeAndCollect */
var numScrollCards = 8;
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