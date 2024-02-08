var scrollDeck = document.getElementById("scrollDeck");
for (let i = 0; i <= 14; i++){
    var newCard = document.createElement("div");
    newCard.setAttribute("class", "newCard");
    newCard.setAttribute('id', 'card' + i.toString());
    if (i % 2 == 0){
        let goblinImage = document.createElement('img');
        goblinImage.src = "images/goblin-willow-tree.jpg";
        goblinImage.style.margin = "2px";
        newCard.appendChild(goblinImage);
    }
    else{
        let darkWizardImage = document.createElement('img');
        darkWizardImage.src = "images/dark-wizard.png";
        darkWizardImage.style.margin = "2px";
        newCard.appendChild(darkWizardImage);
    }
    newCard.style.position = "absolute";
    newCard.style.bottom = "0vw";
    newCard.style.left = (i * 6).toString() + "vw";
    newCard.style.height = "14.5vw";
    newCard.style.width = "8.8vw";
    newCard.style.backgroundColor = "beige";
    newCard.style.borderStyle = "solid";
    newCard.style.borderColor = "black";
    newCard.style.borderWidth = "2px";
    newCard.style.borderRadius = "5px";
    newCard.style.zIndex = i.toString();
    newCard.onmouseenter = function(){this.style.zIndex = "999"};
    newCard.onmouseleave = function(){this.style.zIndex = i.toString()};
    scrollDeck.appendChild(newCard);
}

