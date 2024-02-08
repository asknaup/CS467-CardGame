class Card{
    constructor(primaryKey, imageSrc){
        this.primaryKey = primaryKey;
        this.imageSrc = imageSrc;
        this.staged = false;
    }
}

function displayScrollCards(startIndex, endIndex, cardArr){
    var scrollDeck = document.getElementById("cardSlots");
    for (let i = startIndex; endIndex <= 13; i++){
        var scrollCard = document.createElement("div");
        scrollCard.setAttribute("class", "newCard");
        scrollCard.setAttribute('id', cardArr[i].primaryKey);
        let cardImage = document.createElement("img");
        cardImage.src = cardArr[i].imageSrc;
        cardImage.style.margin = "2px";
        scrollCard.appendChild(cardImage);
        scrollCard.style.position = "absolute";
        scrollCard.style.bottom = "0vw";
        scrollCard.style.left = (i * 6 + 3).toString() + "vw";
        scrollCard.style.height = "14.5vw";
        scrollCard.style.width = "8.8vw";
        scrollCard.style.backgroundColor = "beige";
        scrollCard.style.borderStyle = "solid";
        scrollCard.style.borderColor = "black";
        scrollCard.style.borderWidth = "2px";
        scrollCard.style.borderRadius = "5px";
        scrollCard.style.zIndex = i.toString();
        scrollCard.onmouseenter = function(){this.style.zIndex = "999"};
        scrollCard.onmouseleave = function(){this.style.zIndex = i.toString()};
        scrollDeck.appendChild(scrollCard);
    }
}

/* main code for tradeAndCollect */
var cardArr = [];
for (let i = 0; i<=13; i++){
    var newCard = null;
    if (i % 2 == 0){
        newCard = new Card("card" + i.toString, "images/goblin-willow-tree.jpg");
    }
    else{
        newCard = new Card("card" + i.toString, "images/dark-wizard.png");
    }
    cardArr.push(newCard);
}

displayScrollCards(0, 13, cardArr);



