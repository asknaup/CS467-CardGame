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
    constructor(health = 100, mana = 10, player) {
        this.health = health;  // total health 
        this.mana = mana;  // mana per turn
        this.player = player;
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
    constructor(health = 100, mana = 10, player) {
        super(health, mana, player);
        this.playerStage = []; // Initialize playerStage for staging creature cards
    }

    async playTurn(hand, isFirstTurn) {
        // Check if it's the first turn
        if (isFirstTurn) {
            // If it's the first turn, play creature cards only
            for (let i = 0; i < hand.length; i++) {
                const card = hand[i];
                if (card instanceof CreatureCard && card.mana <= this.mana) {
                    this.playerStage.push(card);
                    this.mana -= card.mana;
                    hand.splice(i, 1);
                    i--;
                }
            }
        } else {
            // If it's not the first turn, play either creature or spell cards
            for (let i = 0; i < hand.length; i++) {
                const card = hand[i];
                if ((card instanceof CreatureCard || card instanceof SpellCard) && card.mana <= this.mana) {
                    if (card instanceof CreatureCard) {
                        this.playerStage.push(card);
                    } else if (card instanceof SpellCard) {
                        this.applySpellCardEffects(card);
                    }
                    this.mana -= card.mana;
                    hand.splice(i, 1);
                    i--;
                }
            }
        }
    }

    evaluateBoardState(playerStage) {
        const boardState = {
            playerHealth: this.user.health,
            opponentHealth: this.health,
            playerCreatureStats: this.calculateCreatureStats(playerStage),
            opponentCreatureStats: this.calculatedCreatureStats(this.playerStage),
            playerMana: this.user.mana
        };

        return boardState;
    }

    calculateCreatureStats(stage) {
        let totalAttack = 0;
        let totalDefense = 0;

        for (const card of stage) {
            if (card instanceof CreatureCard) {
                totalAttack += card.attack;
                totalDefense += card.defense;
            }
        }

        return { totalAttack, totalDefense };
    }

    defineStrategy(boardState) {
        // Initialize an empty strategy object
        const strategy = {
            playAggressively: false, // Whether to play aggressively (e.g., prioritize attacking)
            playDefensively: false, // Whether to play defensively (e.g., prioritize defending)
            playCards: [], // Array to store selected cards to play
            targetCardIds: [] // Array to store target card IDs (if any)
        };

        // Example: If opponent's health is low, play aggressively to finish them off
        if (boardState.opponentHealth <= 10) {
            strategy.playAggressively = true;
        }

        // Example: If opponent has a strong board presence, prioritize playing defensively
        if (boardState.opponentCreatureStats.totalAttack >= 20) {
            strategy.playDefensively = true;
        }

        // Example: If player has a low health, prioritize attacking them
        if (boardState.playerHealth <= 20) {
            strategy.playAggressively = true;
        }

        /// Example: If the player's board is full and there are spell cards in hand, prioritize applying spells to creatures
        if (boardState.playerCreatureStats.length === 5) {
            const spellCardsInHand = boardState.hand.filter(card => card instanceof SpellCard);
            if (spellCardsInHand.length > 0) {
                // Logic to select spell cards and target creature cards
                // You can implement this logic based on specific criteria, such as maximizing damage or defense, or countering opponent's strategy
                strategy.playCards = spellCardsInHand;
                strategy.targetCardIds = this.selectTargetCreatureCards(boardState.playerStage);
            }
        }

        // Add more strategy logic based on specific game conditions...

        return strategy;
    }

    selectCardsToPlay(hand, strategy) {
        const selectedCards = [];

        // If the strategy is to play aggressively, prioritize creature cards with high attack
        if (strategy.playAggressively) {
            const creatureCards = hand.filter(card => card instanceof CreatureCard);
            creatureCards.sort((a, b) => b.attack - a.attack); // Sort by attack in descending order
            selectedCards.push(...creatureCards.slice(0, 5 - strategy.targetCardIds.length)); // Play up to 5 cards
        }

        // If the strategy is to play defensively, prioritize creature cards with high defense
        if (strategy.playDefensively) {
            const creatureCards = hand.filter(card => card instanceof CreatureCard);
            creatureCards.sort((a, b) => b.defense - a.defense); // Sort by defense in descending order
            selectedCards.push(...creatureCards.slice(0, 5 - strategy.targetCardIds.length)); // Play up to 5 cards
        }

        // Add more logic for other strategies...

        return selectedCards;
    }

    async playSelectedCards(selectedCards) {
        for (const card of selectedCards) {
            // Deduct mana cost
            this.mana -= card.mana;

            if (card instanceof CreatureCard) {
                // Apply effects of creature cards (if any)
                // This might involve adding the card to the player's stage or triggering any related effects
                // Example: this.playerStage.push(card);

                // Update game state (if necessary)
                // Example: this.updateGameStateAfterCreatureCardPlayed(card);
            } else if (card instanceof SpellCard) {
                // Apply effects of spell cards (if any)
                // This might involve modifying the stats of creature cards, damaging opponents, etc.
                // Example: this.applySpellCardEffects(card);

                // Update game state (if necessary)
                // Example: this.updateGameStateAfterSpellCardPlayed(card);
            }

            // Other actions specific to the played card (if needed)

            // You may also need to await any asynchronous actions here, depending on your game mechanics
        }
    }

    // Example method to apply effects of a spell card
    applySpellCardEffects(spellCard) {
        console.log(spellCard);
        // Apply effects based on the type of spell card
        switch (spellCard.ability) {
            case "Damage":
                console.log("THIS.OPPONENT", this.player)
                // Example: Deal damage to opponent's creatures or player
                this.player.decreaseHealth(spellCard.attack); // Adjust based on your game mechanics
                
                console.log("THIS.OPPONENT", this.player)
                break;
            case "Buff":
                console.log("BUFF")
                // Example: Increase attack or defense of creatures
                this.buffCreatures(spellCard); // Implement this method
                break;
            case "Debuff":
                console.log("DEBUFF")
                // Example: Decrease attack or defense of opponent's creatures
                this.debuffOpponentCreatures(spellCard.debuffAmount); // Implement this method
                break;
            // Add more cases for different types of spell cards...
            default:
                // Handle unknown spell card types
                console.error("Unknown spell card type:", spellCard.type);
        }
    }

    buffCreatures(spellCard) {
        // Apply the buff to the player's creatures
        for (const creature of this.playerStage) {
            creature.attack += spellCard.attack; // Adjust based on your game mechanics
            creature.defense += spellCard.defense; // Adjust based on your game mechanics
        }
    }

    debuffOpponentCreatures(spellCard) {
        // Apply the debuff to the opponent's creatures
        for (const creature of this.opponent.playerStage) {
            creature.attack -= spellCard.attack; // Adjust based on your game mechanics
            creature.defense -= spellCard.defense; // Adjust based on your game mechanics
        }
    }


    updateGameStateAfterCreatureCardPlayed(creatureCard) {
        // Add the creature to the player's stage
        this.playerStage.push(creatureCard);

        // Possible: Apply any immediate effects associated with the creature
        // Example: Trigger abilities, buffs, or debuffs
    }

    updateGameStateAfterSpellCardPlayed(spellCard) {
        // Apply spell effects
        this.applySpellCardEffects(spellCard);

        // Check for any game state changes resulting from the spell card
        // Example: If a creature's stats were modified, update the corresponding creature card
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
        this.round = 0;
    }

    // Initialize the game
    async initialize(computer = true, opponentId, opponentUsn) {
        this.deck = await this.getDeck();
        this.drawInitialHand();

        if (computer) {
            // if computer is opponent
            this.opponent = new ComputerOpponent();
            this.opponent.player = this.user;
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
                        cardData[0].spellAbility,      // description
                        cardData[0].manaCost,
                        cardData[0].rarity,
                        cardData[0].imagePath,
                        cardData[0].spellAttack,
                        cardData[0].spellDefense,
                        cardData[0].spellType,
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
            if (this.round === 0) {
                await this.opponent.playTurn(this.opponentHand, true);
            } else {
                await this.opponent.playTurn(this.opponentHand, false);
            }
            this.opponentStage = this.opponent.playerStage;
        }

        // Reset players mana to 10
        this.user.mana = 10;
        this.opponent.mana = 10;
        this.round += 1;
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

    async playCard(cardId, targetCardId = null) {
        // Find the card instance in hand based on cardId
        const card = this.hand.find(card => card.id === cardId);
        let updatedStage = [...this.playerStage];

        if (!card) {
            return { error: "Card is not in hand." };
        }

        if (card.mana > this.user.mana) {
            return { error: "Insufficient mana to play this card." }; // Return without playing the card
        }

        if (card instanceof CreatureCard) {
            if (updatedStage.length < 5) {
                updatedStage.push(card);
            } else {
                return { error: "Maximum limit reached on the board" };
            }
        } else if (card instanceof SpellCard) {
            // Check if the spell card targets a creature card
            if (targetCardId) {
                // Find the target creature card in the player's stage
                const targetCreatureIndex = updatedStage.findIndex(card => card.id === targetCardId);
                if (targetCreatureIndex !== -1) {
                    // Apply the spell card effects to the target creature
                    this.applySpellCardEffects(card, updatedStage[targetCreatureIndex]);
                    // Remove the spell card from the player's hand
                    this.hand = this.hand.filter(handCard => handCard.id !== cardId);
                    // Deduct mana cost from player's mana
                    this.user.mana -= card.mana;
                    return { success: true, message: `Spell card ${card.name} played successfully on ${updatedStage[targetCreatureIndex].name}` };
                } else {
                    return { error: "Target creature card not found." };
                }
            } else {
                return { error: "Target creature card not specified." };
            }
        } else {
            return { error: "Unknown card type." };
        }

        // Remove card from hand
        let updatedHand = this.hand.filter(handCard => handCard.id !== card.id);

        this.hand = updatedHand; // Update the hand
        this.playerStage = updatedStage; // Update the player stage
        this.user.mana -= card.mana; // Deduct mana cost
        return { success: true, message: `${card.name} played successfully` };
    }


    // Method to play a spell card
    playSpellCard(spellCardId, updatedCardData, creatureCardId) {
        // Find the index of the card in the hand array
        const spellCardIndexInHand = this.hand.findIndex(card => parseInt(card.id) === parseInt(spellCardId));
        const creatureCardIndexInStage = this.playerStage.findIndex(card => parseInt(card.id) === parseInt(creatureCardId));

        let spellCard = this.hand[spellCardIndexInHand];

        // Check if the card exists in the hand
        if (spellCardIndexInHand !== -1 && creatureCardIndexInStage !== -1) {
            // Check if player has sufficient mana to play the spell card
            if (this.user.mana >= spellCard.mana) {
                // Remove the spell card from the player's hand
                this.hand.splice(spellCardIndexInHand, 1);

                // Update the corresponding creature card in the staged cards array
                this.playerStage[creatureCardIndexInStage] = updatedCardData;

                // Deduct mana cost from player's mana
                this.user.mana -= spellCard.mana;

                console.log("Spell card removed from hand and creature card updated in the staged cards.");
                console.log(`Player mana deducted by ${spellCard.mana}. Remaining mana: ${this.user.mana}`);
            } else {
                console.log("Insufficient mana to play the spell card.");
                return { error: "Insufficient mana to play the spell card." }; // Return without playing the card
            }
        } else {
            console.log("Spell card or creature card not found.");
            return { error: "Spell card or creature card not found." };
        }
    }

    // Method to check if game is over
    isGameOver() {
        return this.user.hasLost();
    }
};

module.exports = { Game, User, Card, CreatureCard, SpellCard };