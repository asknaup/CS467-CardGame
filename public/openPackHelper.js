async function addCardsToOpenCardDisplay(listOfCardIds, openPackCardDisplay){
    for(const cardId of  listOfCardIds){
        const cardDetailsResponse = await fetch('/getCardDetails?cardId=' + cardId);
        await cardDetailsResponse.json()
            .then((cardData) => {
                    let cardObj = null;
                    if (cardData.type == "Creature"){
                        cardObj = new collectionCreatureCard(cardData.id, cardData.name, cardData.imagePath, 
                            cardData.description, cardData.type, cardData.rarity, cardData.attack, cardData.defense, cardData.mana); 
                    }else{
                        cardObj = new collectionSpellCard(cardData.id, cardData.name, cardData.imagePath, 
                            cardData.description, cardData.type, cardData.rarity, cardData.attack, cardData.defense, cardData.mana); 
                    }
                    openPackCardDisplay.appendChild(createTradingCard(cardObj))
            })
            .catch((error) => {console.log(error)});  
    }
}

async function openPackButtonHandler(){
    let openPackCardDisplay = document.getElementById("openPackCardDisplay")
    while(openPackCardDisplay.firstChild){
        openPackCardDisplay.removeChild(openPackCardDisplay.firstChild);
        console.log("opening pack")
    }
    let dropDownSelect1 = document.getElementById("dropdownSelect1")
    console.log(dropDownSelect1.value)
    openPackPostRequestObj = {};
    openPackPostRequestObj["gameId"] = dropdownSelect1.value
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(openPackPostRequestObj)
    }
    const cardDetailsResponse =  await fetch('/openPack', options);
    await cardDetailsResponse.json()
    .then((listOfCardIds) => {  
        console.log(listOfCardIds); 
        addCardsToOpenCardDisplay(listOfCardIds, openPackCardDisplay);
    }) 
}

var openBackButton = document.getElementById("openPackButton")
openBackButton.addEventListener("click", () => { openPackButtonHandler(openBackButton)})