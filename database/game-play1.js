const dbFunc = require('./db-functions');
const helper = require('./helper-funcs')
// Using RuleSet1

class Card {
    constructor(id, name, type, description, mana, rarity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.mana = mana;
        this.rarity = rarity;
    }
}

class CreatureCard extends Card {
    constructor(id, name, description, mana, rarity, attack, defense) {
        super(id, name, description, mana, rarity);
        this.attack = attack;
        this.defense = defense;
    }
}

class SpellCard extends Card {
    constructor(id, name, description, mana, rarity, attack, defense, ability, utility) {
        super(id, name, description, mana, rarity);
        this.attack = attack;
        this.defense = defense;
        this.ability = ability;
        this.utility = utility;
    }
}

class User {
    // Player starts with 100 Mana.
    constructor(userId, username, mana = 100) {
        this.userId = userId;
        this.username = username;
        this.mana = mana;
    }

    // Method to decrease mana
    decreaseMana(amount) {
        this.mana -= amount;
    }

    // Method to check if user has lost
    hasLost() {
        // Will return True for loss
        return this.mana <= 0;  // If mana <= 0 then they have lost 
    }
}
class Game {
    constructor(user, deckId, ruleSet, gameId) {
        this.user = user;
        this.deckId = deckId;
        this.ruleSet = ruleSet;
        this.gameId = gameId;
        this.hand = [];
        this.deck = [];
        this.playerStage = [];
    }

    // Initialize the game
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
            var cardIds = deckJsonObject.cardList;
            console.log(cardIds);
            const cardInstances = await Promise.all(cardIds.map(async cardId => {

                const cardData = await dbFunc.getCardByCardId(cardId);
                // console.log(cardData);
                if (cardData[0].cardType.toLowerCase() === 'creature') {
                    return new CreatureCard(
                        cardId,
                        cardData[0].cardName,
                        "something creature",
                        cardData[0].manaCost, 
                        cardData[0].rarity, 
                        cardData[0].attack, 
                        cardData[0].defense);
                } else {
                    return new SpellCard(
                        cardId, 
                        cardData[0].spellType,
                        cardData[0].manaCost, 
                        cardData[0].rarity, 
                        cardData[0].spellAttack, 
                        cardData[0].spellDefense, 
                        cardData[0].spellAbility, 
                        cardData[0].utility)
                }
            }))
            
            return this.shuffleDeck(cardInstances);

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

    // Method to check if game is over
    isGameOver() {
        return this.user.hasLost();
    }
};

module.exports = { Game, User, Card, CreatureCard, SpellCard };