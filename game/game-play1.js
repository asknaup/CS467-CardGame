const dbFunc = require('../database/db-functions');
const helper = require('../database/helper-funcs')
// Using RuleSet1

class Card {
    constructor(id, name, type, description, mana, rarity, imagePath) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.mana = mana;
        this.rarity = rarity;
        this.imagePath = imagePath;
    }
}

class CreatureCard extends Card {
    constructor(id, name, type, description, mana, rarity, imagePath, attack, defense) {
        super(id, name, type, description, mana, rarity, imagePath);
        this.attack = attack;
        this.defense = defense;
    }
}

class SpellCard extends Card {
    constructor(id, name, type, description, mana, rarity, imagePath, attack, defense, ability, utility) {
        super(id, name, type, description, mana, rarity, imagePath);
        this.attack = attack;
        this.defense = defense;
        this.ability = ability;
        this.utility = utility;
    }
}

class User {
    // Player starts with 100 Mana.
    constructor(userId, username, health = 100, mana = 10) {
        this.userId = userId;
        this.username = username;
        this.health = health;  // total health 
        this.mana = mana;  // mana per turn
    }

    // Method to decrease mana
    decreaseHealth(amount) {
        this.health -= amount;
    }

    // Method to check if user has lost
    hasLost() {
        // Will return True for loss
        return this.health <= 0;  // If mahealthna <= 0 then they have lost 
    }
}

// TODO finish filling out opponent
class Opponent {
    constructor(health = 100, mana = 10) {
        this.health = health;  // total health 
        this.mana = mana;  // mana per turn
    }

    async playTurn() {
        // TODO
    }
}

class ComputerOpponent extends Opponent{
    constructor(health, mana) {
        super(health, mana);
    }

    async playTurn() {
        // TODO
    }
}

class HumanOpponent extends Opponent{
    constructor(health, mana) {
        super(health, mana);
    }

    async playTurn() {
        // TODO
    }
}


class Game {
    constructor(user, deckId, ruleSet, gameId) {
        this.user = user;
        this.opponent = null; // initialize as null
        this.deckId = deckId;
        this.ruleSet = ruleSet;
        this.gameId = gameId;
        this.hand = [];
        this.opponentHand = [];
        this.deck = [];
        this.playerStage = [];
        this.opponentHand = [];
    }

    // Initialize the game
    async initialize(computer = true, opponentId, opponentUsn) {
        if (computer) {
            // if computer is opponent
            this.opponent = new ComputerOpponent();
        } 

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
            // console.log(cardIds);
            const cardInstances = await Promise.all(cardIds.map(async cardId => {

                const cardData = await dbFunc.getCardByCardId(cardId);
                console.log(cardData);
                if (cardData[0].cardType.toLowerCase() === 'creature') {
                    return new CreatureCard( //id, name, type, description, mana, rarity, imagePath, attack, defense
                        cardId,                 // id
                        cardData[0].cardName,   // name
                        "something creature",   // type
                        cardData[0].cardType,   // description
                        cardData[0].manaCost, 
                        cardData[0].rarity, 
                        cardData[0].imagePath,
                        cardData[0].attack, 
                        cardData[0].defense);
                } else if (cardData[0].cardType.toLowerCase() === 'spell') {
                    return new SpellCard( //id, name, type, description, mana, rarity, imagePath, attack, defense, ability, utility
                        cardId,                     // id
                        cardData[0].cardName,       // name
                        cardData[0].spellType,      // type
                        cardData[0].cardType,      // description
                        cardData[0].manaCost, 
                        cardData[0].rarity, 
                        cardData[0].imagePath,
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

    async playNextTurn() {
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

    async playCard(cardId) {
        // Find the card instance in hand based on cardId
        const card = this.hand.find(card => card.id === cardId);

        if (!card) {
            console.log("Error: Card is not in hand.");
            return;
        }
        
        if (card.mana > this.user.mana) {
            console.log("Error: Insufficient mana to play this card.");
            return;
        }

        let updatedHand = this.hand.filter(handCard => handCard.id !== cardId);
        let updatedStage = [...this.playerStage];
    
        // Check type of card
        if (card instanceof CreatureCard){
            updatedStage.push(cardId);
        } else if (card instanceof SpellCard){
            // Handle playing spell
            // TODO add logic for card type spell
        } else {
            console.log("Error: unknown card type.");
            return;
        }
    
        this.hand = updatedHand; // Update the hand
        this.playerStage = updatedStage; // Update the player stage
        this.user.mana -= card.mana;
    }

    // Method to check if game is over
    isGameOver() {
        return this.user.hasLost();
    }
};

module.exports = { Game, User, Card, CreatureCard, SpellCard };