
import { createTradingCard } from "./generalCardCode.mjs";

class Card{
    constructor(primaryKey, cardName, image, description, cardType, attributes){
        this.primaryKey = primaryKey;
        this.cardName = cardName;
        this.image = image;
        this.description = description;
        this.cardType = cardType;
        this.attributes = attributes;
        this.isStaged = false;
    }
}

function addStagedCardFunctionality(cardArrIndex, cardArr){
    var startIndex = Math.floor(cardArrIndex / numScrollCards) * numScrollCards;
    var endIndex = startIndex + (numScrollCards - 1);
    if (endIndex > cardArr.length - 1){
        endIndex = cardArr.length - 1
    }
    displayScrollCards(startIndex, endIndex, cardArr);
}

function addScrollCardFunctionality(cardArrIndex, cardArr, scrollCard){
    scrollCard.onclick = function(){
        if (cardArr[cardArrIndex].isStaged == false){
            if(stagedCardCount < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var stageArea = document.getElementById("stageAreaZero");
                var newId = scrollCard.id + "StagedCard";
                let stagedCard = createTradingCard(newId, cardArr[cardArrIndex]);
                stagedCard.onclick = function(){addStagedCardFunctionality(cardArrIndex, cardArr)};
                stageArea.appendChild(stagedCard);
                cardArr[cardArrIndex].isStaged = true;
                //stagedCardCount is a global variable
                stagedCardCount += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(scrollCard.id + "StagedCard");
            stagedCard.remove();
            cardArr[cardArrIndex].isStaged = false;
            //stagedCardCount is a global variable
            stagedCardCount -= 1;
        }
    };
}

function displayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById("cardSlots");
    for (let index = startIndex; index <= endIndex; index++){
        var elementId = cardArr[index].primaryKey;
        let scrollCard = createTradingCard(elementId, cardArr[index]);
        scrollCard.classList.add('newCard');
        addScrollCardFunctionality(index, cardArr, scrollCard);
        if (cardArr[index].isStaged == true){
            scrollCard.style.border = "6px solid #4caf50";
        }else{
            scrollCard.style.border = "3px solid black";
        }
        cardSlots.appendChild(scrollCard);
    }
}

/* Create Example Dummy Cards */
// Example cards data (you can add more)
var exampleCards = [
    {primaryKey: "goblin", cardName: "Goblin", image: 'images/goblin-willow-tree.jpg', 
            description: 'A small forest goblin.', cardType:'Creature', 
            attributes: {hp:50, atk:50, def:30, specialAbility:'Cooking', goldCost:5}},
    {primaryKey: "wizard", cardName: 'Fire Ball Scroll', image: 'images/dark-wizard.png',  
                description:'A powerful fire ball.', cardType: 'Spell', 
                attributes: {hp:80, atk:60, def:20, specialAbility:'Fire Ball', goldCost:7}},
    {primaryKey: "iceDragon", cardName: 'Ice Dragon', image: 'images/ice-dragon.png', 
                description: 'An ice dragon from the North.', cardType: 'Creature', 
                attributes: {hp:120, atk:100, def:80, specialAbility:'Flying', goldCost:9}}
    // Add more cards as needed
];


let cardArr = [];
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    cardArr.push(new Card(cardData.primaryKey + index.toString(), cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes));
}


/* main code for tradeAndCollect */
var stagedCardCount = 0;
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