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

class ComputerOpponent extends Opponent {
    constructor(health = 100, mana = 10) {
        super(health, mana);
        this.playerStage = []; // Initialize playerStage for staging creature cards
    }

    async playTurn(hand) {
        // Iterate through the computer opponent's hand
        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];

            // Check if the card is a creature card and if there's enough mana to play it
            if (card instanceof CreatureCard && card.mana <= this.mana) {
                // Play the creature card to the staging area
                this.playerStage.push(card);
                this.mana -= card.mana;

                // Remove the card from the hand
                hand.splice(i, 1);

                // Adjust index since we removed a card from the hand
                i--;
            }
        }
    }
}


class HumanOpponent extends Opponent {
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
        this.opponentDeck = [];
        this.playerStage = [];
        this.opponentStage = [];
    }

    // Initialize the game
    async initialize(computer = true, opponentId, opponentUsn) {
        this.deck = await this.getDeck();
        this.drawInitialHand();

        if (computer) {
            // if computer is opponent
            this.opponent = new ComputerOpponent();
            this.opponentDeck = this.shuffleDeck([...this.deck]);

            this.drawInitialOpponentHand();
        }

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
            const cardInstances = await Promise.all(cardIds.map(async cardId => {

                const cardData = await dbFunc.getCardByCardId(cardId);
                if (cardData[0].cardType.toLowerCase() === 'creature') {
                    return new CreatureCard( //id, name, type, description, mana, rarity, imagePath, attack, defense
                        cardId,                 // id
                        cardData[0].cardName,   // name
                        cardData[0].cardType,   // type
                        cardData[0].creatureType,   // description
                        cardData[0].manaCost,
                        cardData[0].rarity, 
                        cardData[0].imagePath,
                        cardData[0].attack,
                        cardData[0].defense);
                } else if (cardData[0].cardType.toLowerCase() === 'spell') {
                    return new SpellCard( //id, name, type, description, mana, rarity, imagePath, attack, defense, ability, utility
                        cardId,                     // id
                        cardData[0].cardName,       // name
                        cardData[0].cardType,      // type
                        cardData[0].spellType,      // description
                        cardData[0].manaCost,
                        cardData[0].rarity,
                        cardData[0].imagePath,
                        cardData[0].spellAttack,
                        cardData[0].spellDefense,
                        cardData[0].spellAbility,
                        cardData[0].utility);
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


    async drawInitialOpponentHand() {
        // Draw initial hand with 7 cards for the opponent
        while (this.opponentHand.length < 7 && this.opponentDeck.length > 0) {
            this.opponentHand.push(this.opponentDeck.pop());
        }
    }

    async playNextTurn() {
        // Draw cards for the next turn for user
        this.drawCardsPerTurn();
        console.log(this.hand.length)

        // Execute the computer opponent's turn
        if (this.opponent instanceof ComputerOpponent) {
            this.drawOpponentsCardsPerTurn();
            await this.opponent.playTurn(this.opponentHand);
            this.opponentStage = this.opponent.playerStage;
        }

        // Reset players mana to 10
        this.user.mana = 10;
        this.opponent.mana = 10;
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
    }

    drawOpponentsCardsPerTurn() {
        // Draw cards for the turn
        const updatedHand = [...this.opponentHand]; // Create a copy of the hand array
        const updatedDeck = [...this.opponentDeck]; // Create a copy of the deck array

        while (updatedHand.length < 7 && updatedDeck.length > 0) {
            updatedHand.push(updatedDeck.pop());
        }

        this.opponentHand = updatedHand; // Update the hand
        this.opponentDeck = updatedDeck; // Update the deck
    }

    async playCard(cardId) {
        // Find the card instance in hand based on cardId
        const card = this.hand.find(card => card.id === cardId);
        let updatedStage = [...this.playerStage];

        if (!card) {
            // console.log("Error: Card is not in hand.");
            // return;
            return { error: "Card is not in hand." };
        }

        if (card.mana > this.user.mana) {
            // console.log("Insufficient mana to play this card.")
            return { error: "Insufficient mana to play this card." }; // Return without playing the card
        }

        // Check type of card
        if (card instanceof CreatureCard) {
            if (updatedStage.length < 5) {
                console.log(cardId)
                updatedStage.push(cardId);
            } else {
                // console.log("Error: Maximum limit reached on the board");
                return { error: "Maximum limit reached on the board" };
            }
        } else if (card instanceof SpellCard) {
            // Handle playing spell
            // TODO add logic for card type spell
        } else {
            // console.log("Error: unknown card type.");
            return { error: "unknown card type." }
        }

        // remove card from hand
        let updatedHand = this.hand.filter(handCard => handCard.id !== cardId);

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