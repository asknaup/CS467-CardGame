class Card{
    constructor(primaryKey, imageSrc){
        this.primaryKey = primaryKey;
        this.imageSrc = imageSrc;
        this.staged = false;
    }
}

function displayScrollCards(startIndex, endIndex, cardArr){
    var cardId = 0;
    var left = 0;
    var scrollDeck = document.getElementById("cardSlots");
    for (let i = startIndex; i <= endIndex; i++){
        var cardId = cardId.toString();
        // create the div that becomes the card
        var scrollCard = document.createElement("div");
        scrollCard.setAttribute("class", "newCard");
        scrollCard.setAttribute('id', cardId);
        // this creates the image for the card
        let cardImage = document.createElement("img");
        cardImage.src = cardArr[i].imageSrc;
        cardImage.style.margin = "2px";
        scrollCard.appendChild(cardImage);
        // this is all the css for this card
        scrollCard.style.position = "absolute";
        scrollCard.style.bottom = "0vw";
        scrollCard.style.left = (left + 3).toString() + "vw";
        scrollCard.style.height = "14.5vw";
        scrollCard.style.width = "8.8vw";
        scrollCard.style.backgroundColor = "beige";
        scrollCard.style.borderStyle = "solid";
        scrollCard.style.borderColor = "black";
        scrollCard.style.borderWidth = "2px";
        scrollCard.style.borderRadius = "5px";
        scrollCard.style.zIndex = i.toString();
        // creates the same affect as #id.hover { z-index: [value goes here]}
        scrollCard.onmouseenter = function(){this.style.zIndex = "999"};
        scrollCard.onmouseleave = function(){this.style.zIndex = i.toString()};
        // remove old card before adding new one
        var oldCard = document.getElementById(cardId);
        if(oldCard !== null){
            oldCard.remove();
        }
        scrollDeck.appendChild(scrollCard);
        cardId += 1;
        left += 6;
    }
}

/* main code for tradeAndCollect */
var cardArr = [];
for (let i = 0; i<=27; i++){
    var newCard = null;
    if(i <= 13){
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


var startIndex = 0;
var endIndex = 13;
displayScrollCards(startIndex, endIndex, cardArr);
var scrollRightButton = document.getElementById("scrollRight");
scrollRightButton.addEventListener("click", () => {
    if (cardArr.length - endIndex < 14){
        endIndex = cardArr.length
        startIndex = startIndex + (cardArr.length - endIndex)
    }else{
        endIndex += 14;
        startIndex += 14;
    }
    displayScrollCards(startIndex, endIndex, cardArr);
});


var scrollLeftButton = document.getElementById("scrollLeft");
scrollLeftButton.addEventListener("click", () => {
    if (startIndex < 14){
        startIndex = 0;
        endIndex = endIndex - startIndex;
    }else{
        endIndex -= 14;
        startIndex -= 14;
    }
    displayScrollCards(0, 13, cardArr);
});




/*
var scrollLeftButton = document.getElementById("scrollLeft");
scrollLeftButton.addEventListener("click", () => {
    for(let i = 0; i <= 13; i++){
        document.getElementById("card" + i.toString()).remove();
    }
});
*/