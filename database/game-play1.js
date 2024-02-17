dbFunc = require('./db-functions');
// Using RuleSet1

// TODO get user deck and shuffle
async function getDeck(userId, deckId) {
    try {
        var deckList = await dbFunc.getUserDeck(deckId);
        
        if (!deckList || deckList.length === 0 || !deckList[0].cardId) {
            console.log("Error: No valid deck data found.");
            return; 
        }

        var deckJsonObject = JSON.parse(deckList[0].cardId);
        var cardList = deckJsonObject.cardList;
        

        // Shuffle Deck
        if (cardList && Array.isArray(cardList)) {
            cardList = shuffleDeck(cardList);
        }
        
        // Return shuffled Deck
        return cardList;
    } catch (error) {
        console.error("Error while parsing deck data:", error);
    }
}

function shuffleDeck(deck) {
    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [deck[i], deck[j]] = [deck[j], deck[i]]; 
    }
    return deck;
}

// Initalize Hand with 7 cards
function drawCardsPerTurn(deck, hand) {  
    const updatedHand = [...hand]; // Create a copy of the hand array
    const updatedDeck = [...deck]; // Create a copy of the deck array

    while (updatedHand.length < 7 && updatedDeck.length > 0) {
        updatedHand.push(updatedDeck.pop());
    }

    return { updatedHand, updatedDeck }; // Return the updated hand and deck as an object
}

// Will draw to minimum number of cards per turn
function playNextTurn(deck, hand) {
    const {updatedHand, updatedDeck} = drawCardsPerTurn(deck, hand);
    return drawCardsPerTurn(deck, hand);
}

function playCard(hand, cardId) {
    const updatedHand = hand.filter(card => card !== cardId);
    return updatedHand; 
}

// var hand = [];  // start off empty
// var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18];
// console.log("Initial hand:", hand);

// var result = playNextTurn(deck, hand);
// console.log("Updated hand:", result.updatedHand);
// console.log("Updated deck:", result.updatedDeck);

// hand = playCard(result.updatedHand, 16);
// console.log("Updated hand:", hand);

// var result = playNextTurn(result.updatedDeck, hand);
// console.log("Updated hand:", result.updatedHand);
// console.log("Updated deck:", result.updatedDeck);
// hand = playCard(result.updatedHand, 16);
// hand = playCard(hand, 11);
// hand = playCard(hand, 17);
// hand = playCard(hand, 13);
// hand = playCard(hand, 12);
// var result = playNextTurn(result.updatedDeck, hand);
// console.log("Updated hand2:", result.updatedHand);
// console.log("Updated deck2:", result.updatedDeck);


module.exports.getDeck = getDeck;