
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
let cardArr1 = [];
for (let index = 0; index<=33; index++){
    let numCards = exampleCards.length;
    let randomIndex = Math.floor(Math.random() * numCards);
    let cardData = exampleCards[randomIndex];
    cardArr.push(new Card(cardData.primaryKey + index.toString(), cardData.cardName, cardData.image,
                cardData.description, cardData.cardType, cardData.attributes));
    let randomIndex1 = (randomIndex + 1) %  exampleCards.length;
    console.log(randomIndex1);
    let cardData1 = exampleCards[randomIndex1];
    cardArr1.push(new Card(cardData1.primaryKey + index.toString(), cardData1.cardName, cardData1.image,
                cardData1.description, cardData1.cardType, cardData1.attributes));
}


/* main code for tradeAndCollect */
var numScrollCards = 8;
var stagedCardCount = 0;
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


/* other players screen =======================================================================================*/
function otherAddStagedCardFunctionality(cardArrIndex, cardArr1){
    var startIndex1 = Math.floor(cardArrIndex / numScrollCards) * numScrollCards;
    var endIndex1 = startIndex1 + (numScrollCards - 1);
    if (endIndex1 > cardArr1.length - 1){
        endIndex1 = cardArr1.length - 1
    }
    otherDisplayScrollCards(startIndex1, endIndex1, cardArr1);
}

function otherAddScrollCardFunctionality(cardArrIndex, cardArr, scrollCard){
    scrollCard.onclick = function(){
        if (cardArr[cardArrIndex].isStaged == false){
            if(stagedCardCount1 < 8){
                scrollCard.style.border = "6px solid #4caf50";
                var stageArea1 = document.getElementById("stageArea1");
                var newId = scrollCard.id + "StagedCard1";
                let stagedCard = createTradingCard(newId, cardArr[cardArrIndex]);
                stagedCard.onclick = function(){otherAddStagedCardFunctionality(cardArrIndex, cardArr)};
                stageArea1.appendChild(stagedCard);
                cardArr[cardArrIndex].isStaged = true;
                //stagedCardCount1 is a global variable
                stagedCardCount1 += 1;
            }
        } else {
            scrollCard.style.border = "3px solid black";
            var stagedCard = document.getElementById(scrollCard.id + "StagedCard1");
            stagedCard.remove();
            cardArr[cardArrIndex].isStaged = false;
            //stagedCardCount1 is a global variable
            stagedCardCount1 -= 1;
        }
    };
}

function otherDisplayScrollCards(startIndex, endIndex, cardArr){
    // Clear out old card elements
    var oldCards = document.getElementsByClassName("newCard1");
    for (let i= oldCards.length - 1; i >=0; i--) {
        oldCards[i].remove();
    }
    var cardSlots = document.getElementById("cardSlots1");
    for (let index = startIndex; index <= endIndex; index++){
        var elementId = cardArr[index].primaryKey;
        let scrollCard = createTradingCard(elementId, cardArr[index]);
        scrollCard.classList.add('newCard1');
        otherAddScrollCardFunctionality(index, cardArr, scrollCard);
        if (cardArr[index].isStaged == true){
            scrollCard.style.border = "6px solid #4caf50";
        }else{
            scrollCard.style.border = "3px solid black";
        }
        cardSlots.appendChild(scrollCard);
    }
}

/* main code for tradeAndCollect */
var stagedCardCount1 = 0;
var startIndex1 = 0;
var endIndex1 = numScrollCards - 1;
otherDisplayScrollCards(startIndex1, endIndex1, cardArr1);

var scrollRightButton1 = document.getElementById("scrollRight1");
scrollRightButton1.addEventListener("click", () => {
    if (endIndex1 < cardArr1.length - 1){
        startIndex1 = endIndex1 + 1;
        endIndex1 += numScrollCards;
        if (endIndex1 > cardArr1.length - 1){
            endIndex1 = cardArr1.length - 1
        }
        console.log(startIndex1);
        console.log(endIndex1);
        otherDisplayScrollCards(startIndex1, endIndex1, cardArr1);
    }
});

var scrollLeftButton1 = document.getElementById("scrollLeft1");
scrollLeftButton1.addEventListener("click", () => {
    if (startIndex1 > 0){
        endIndex1 = startIndex1 - 1;
        startIndex1 -= numScrollCards;
        if(startIndex1 < 0){
            startIndex1 = 0;
        }
        console.log(startIndex1);
        console.log(endIndex1);
        otherDisplayScrollCards(startIndex1, endIndex1, cardArr1);
    }
});