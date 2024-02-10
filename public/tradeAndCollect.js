class Card{
    constructor(primaryKey, imageSrc){
        this.primaryKey = primaryKey;
        this.imageSrc = imageSrc;
        this.staged = false;
    }
}

function createCardElement(idString, leftVal, cardObj){
    // create the div that becomes the card
    var scrollCard = document.createElement("div");
    scrollCard.setAttribute("class", "newCard");
    scrollCard.setAttribute('id', "card" + idString);
    // this creates the image for the card
    let cardImage = document.createElement("img");
    cardImage.src = cardObj.imageSrc;
    cardImage.style.margin = "2px";
    scrollCard.appendChild(cardImage);
    // this is all the css for this card
    scrollCard.style.position = "absolute";
    scrollCard.style.bottom = "0vw";
    scrollCard.style.left = (leftVal).toString() + "vw";
    scrollCard.style.height = "14.5vw";
    scrollCard.style.width = "8.8vw";
    scrollCard.style.backgroundColor = "beige";
    scrollCard.style.borderStyle = "solid";
    scrollCard.style.borderColor = "black";
    scrollCard.style.borderWidth = "2px";
    scrollCard.style.borderRadius = "5px";
    scrollCard.style.zIndex = idString;
    // creates the same affect as #id.hover { z-index: [value goes here]}
    scrollCard.onmouseenter = function(){this.style.zIndex = "999"};
    scrollCard.onmouseleave = function(){this.style.zIndex = idString};
    return scrollCard;
}

function displayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var scrollDeck = document.getElementById("cardSlots");
    var cardId = 0;
    var left = 0;
    for (let i = startIndex; i <= endIndex; i++){
        scrollCard = createCardElement(cardId.toString(), left, cardArr[i]);
        scrollDeck.appendChild(scrollCard);
        cardId += 1;
        left += 5;
    }
}

/* Create Example Dummy Cards */
var cardArr = [];
for (let i = 0; i<=27; i++){
    var newCard = null;
    if(i <= 14){
        if (i % 2 == 0){
            newCard = new Card("card" + i.toString(), "images/goblin-willow-tree.jpg");
        }
        else{
            newCard = new Card("card" + i.toString(), "images/dark-wizard.png");
        }
    }else{
        newCard = new Card("card" + i.toString(), "images/ice-dragon.png")
    }
    cardArr.push(newCard);
}

/* main code for tradeAndCollect */
var startIndex = 0;
var endIndex = 14;
displayScrollCards(startIndex, endIndex, cardArr);
var scrollRightButton = document.getElementById("scrollRight");
scrollRightButton.addEventListener("click", () => {
    if (cardArr.length - endIndex < 14){
        endIndex = cardArr.length
        startIndex = startIndex + (cardArr.length - endIndex)
    }else{
        endIndex += 15;
        startIndex += 15;
    }
    displayScrollCards(startIndex, endIndex, cardArr);
});

var scrollLeftButton = document.getElementById("scrollLeft");
scrollLeftButton.addEventListener("click", () => {
    if (startIndex < 15){
        startIndex = 0;
        endIndex = endIndex - startIndex;
    }else{
        endIndex -= 15;
        startIndex -= 15;
    }
    displayScrollCards(startIndex, endIndex, cardArr);
});