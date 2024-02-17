dbFunc = require('./db-functions');
helper = require('./helper-funcs')
// Using RuleSet1

// TODO get user deck and shuffle

class Game{
    constructor(userId, deckId) {
        this.userId = userId;
        this.deckId = deckId;
        this.hand = [];
        this.deck = [];
        this.playerStage = [];
    }

    async initialize() {
        this.deck = await this.getDeck();
        this.drawInitialHand();
    }

    async getDeck() {
        // Get the deck from the database
        try {
            var deckList = await dbFunc.getUserDeck(this.deckId);
            if (!deckList || deckList.length == 0 || !deckList[0].cardId) {
                console.log("Error: No valid deck data found.")
                return [];
            }

            var deckJsonObject = JSON.parse(deckList[0].cardId);
            var cardList = deckJsonObject.cardList;

            // Shuffle the deck
            if (cardList && Array.isArray(cardList)) {
                return this.shuffleDeck(cardList);
            }
        } catch (error) {
            console.error("Error while parsing deck data:", error)
            return [];
        }
    }

    shuffleDeck(deck) {
        // Fischer-Yates Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
        }
        return deck;
    }

    drawInitialHand() {
        // Draw initial hand with 7 cards
        while (this.hand.length < 7 && this.deck.length > 0) {
            this.hand.push(this.deck.pop());
        }
    }

    playNextTurn() {
        // Draw cards for the next turn
        const result = this.drawCardsPerTurn();
        // Other game logic for the next turn
    }

    drawCardsPerTurn() {
        // Draw cards for the turn
        const updatedHand = [...this.hand]; // Create a copy of the hand array
        const updatedDeck = [...this.deck]; // Create a copy of the deck array

        while (updatedHand.length < 7 && updatedDeck.length > 0) {
            updatedHand.push(updatedDeck.pop());
        }

        this.hand = updatedHand; // Update the hand
        this.deck = updatedDeck; // Update the deck

        return { updatedHand, updatedDeck }; // Return the updated hand and deck as an object
    }

    playCard(cardId) {
        // Play a card
        let updatedHand = [...this.hand];
        let updatedStage = [...this.playerStage];

        if (!updatedHand.includes(cardId)) {
            console.log("Error: Card is not in hand.");
            return;
        }

        updatedHand = updatedHand.filter(card => card !== cardId);
        updatedStage.push(cardId);

        this.hand = updatedHand; // Update the hand
        this.playerStage = updatedStage; // Update the player stage
    }
};

// Usage:
// const userId = 'user123';
// const deckId = 'deck456';
// const game = new Game(userId, deckId);
// game.initialize().then(() => {
//     // Game initialized, start playing
//     game.playNextTurn();
// });


module.exports.getDeck = getDeck;