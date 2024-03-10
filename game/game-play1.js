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
        this.hasBeenOnStage = false;
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
        // If no cards left to play or health < 0, then they have lost
        if (this.health <= 0) {
            return true;
        } else if (this.deck.length === 0 && this.hand.length === 0 && this.playerStage.length === 0) {
            return true;
        } else {
            return false;
        }
    }
}

class Opponent {
    constructor(health = 100, mana = 10, player) {
        this.health = health;  // total health 
        this.mana = mana;  // mana per turn
        this.player = player;
        this.playerStage = []; // Initialize playerStage for staging creature cards
        this.opponentStage = []; // Initialize opponentStage for staging computers's creature cards
        this.opponentDiscardPile = []; // Initalize discard pile for opponent (Computer)
    }


    // Method to decrease mana
    decreaseHealth(amount) {
        this.health -= amount;
    }

    // Method to check if user has lost
    hasLost() {
        // If no cards left to play or health < 0, then they have lost
        if (this.health <= 0) {
            return true;
        } else if (this.opponentStage.length === 0 && this.opponentHand.length === 0 && this.opponentDeck.length === 0) {
            return true;
        } else {
            return false;
        }
    }
}

class ComputerOpponent extends Opponent {
    constructor(health = 100, mana = 10, player) {
        super(health, mana, player);
    }

    selectRandomCard(cards) {
        return cards[Math.floor(Math.random() * cards.length)];
    }

    async playTurn(hand, isFirstTurn) {
        let newHand = [...hand];
        // Check if it's the first turn
        if (isFirstTurn) {
            console.log("FIRST TURN")
            // If it's the first turn, play creature cards only
            hand.forEach(element => {
                if (element instanceof CreatureCard && element.mana <= this.mana && this.opponentStage.length < 5) {
                    this.opponentStage.push(element);
                    this.mana -= element.mana;
                    hand = hand.filter(card => card.id !== element.id);
                }
            });
        } else {
            if (hand.length === 0 && this.opponentStage.length > 0) {
                // If hand is empty but stage is not, prioritize attacking the player health
                const cardToAttackIndex = Math.floor(Math.random() * this.opponentStage.length);
                const cardToAttack = this.opponentStage[cardToAttackIndex];
                // Attack the player's health
                const damage = cardToAttack.attack;
                this.player.decreaseHealth(damage);
                // Remove the card from the opponent's stage
                this.opponentStage.splice(cardToAttackIndex, 1);


            } else {
                console.log("NOT FIRST TURN")
                // If cards are on the stage, prioritize attacking player health and higher attack cards
                if (this.opponentStage.length > 0) {
                    const cardToAttackIndex = Math.floor(Math.random() * this.opponentStage.length);
                    const cardToAttack = this.opponentStage[cardToAttackIndex];
                    // Attack the player's health
                    const damage = cardToAttack.attack;
                    this.player.decreaseHealth(damage);
                    // Remove the card from the opponent's stage
                    this.opponentStage.splice(cardToAttackIndex, 1);

                    // Add card to discard pile
                    this.opponentDiscardPile.push(cardToAttack);
                }

                // If it's not the first turn, play either creature or spell cards
                newHand = hand.filter(element => {
                    // Prioritize playing creature cards if the opponent's stage is not full
                    if ((element instanceof CreatureCard || element instanceof SpellCard) && element.mana <= this.mana) {
                        if (element instanceof CreatureCard && this.opponentStage.length < 5) {
                            this.opponentStage.push(element);

                            const cardToAttackIndex = Math.floor(Math.random() * this.playerStage.length);
                            const cardToAttack = this.playerStage[cardToAttackIndex];
                            // Attack the player's creature card
                            if (cardToAttack) {
                                const damage = element.attack;
                                cardToAttack.defense -= damage;
                                // Remove the card from the player's stage if its defense is 0 or less
                                if (cardToAttack.defense <= 0) {
                                    this.playerStage.splice(cardToAttackIndex, 1);
                                } else {
                                    // Update player stage with new card data
                                    this.playerStage[cardToAttackIndex] = cardToAttack;
                                }
                                return false; // Filter out the played card
                            }
                        } else if (element instanceof SpellCard) {
                            this.applySpellCardEffects(hand, element);

                            // add card to discard pile
                            this.opponentDiscardPile.push(element);

                            return false; // Filter out the played card
                        }
                        this.mana -= element.mana;
                    }
                    return true; // Keep the card
                });
            }
        }
        return newHand;
    }

    evaluateBoardState(opponentStage) {
        const boardState = {
            playerHealth: this.user.health,
            opponentHealth: this.health,
            playerCreatureStats: this.calculateCreatureStats(opponentStage),
            opponentCreatureStats: this.calculatedCreatureStats(this.opponentStage),
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

        return selectedCards;
    }

    applySpellCardEffects(hand, spellCard, targetCreatureCard = null) {
        let newHand = [...hand];

        // Apply effects based on the type of spell card
        switch (spellCard.ability.toLowerCase()) {
            case "damage":
                console.log("DAMAGE");
                // Deal damage to opponent
                this.player.decreaseHealth(spellCard.attack);
                // Move played card to discard pile
                this.opponentDiscardPile.push(spellCard);
                // Remove spell card from hand
                newHand = newHand.filter(card => card.id !== spellCard.id);
                break;

            case "buff":
                console.log("BUFF");
                newHand = this.buffCreatures(newHand, spellCard);
                break;

            case "debuff":
                console.log("DEBUFF");
                // Randomly select a creature card from the player's stage to debuff
                const randomIndex = Math.floor(Math.random() * this.playerStage.length);
                const targetCreatureCard = this.playerStage[randomIndex];

                newHand = this.debuffOpponentCreatures(newHand, spellCard, targetCreatureCard);
                break;

            default:
                // Handle unknown spell card types
                console.error("Unknown spell card type:", spellCard.ability);
                break;
        }

        return newHand;
    }

    buffCreatures(hand, spellCard) {
        console.log("Buffing creature on opponent's stage");
        let newHand = [];
        // Apply the buff to a random creature on the opponent's stage
        if (this.opponentStage.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.opponentStage.length);
            const creature = this.opponentStage[randomIndex];
            creature.attack += spellCard.attack;
            creature.defense += spellCard.defense;

            // Move played card to discard pile
            this.opponentDiscardPile.push(spellCard);
            // Remove the spell card from the player's hand
            newHand = hand.filter(handCard => handCard.id !== spellCard.id);
            return newHand;
        } else {
            console.error("No creatures on the opponent's stage to buff.");
        }
    }

    debuffOpponentCreatures(hand, spellCard, targetCreatureCard) {
        console.log("Debuffing creature on player's stage");
        // Apply the debuff to the target creature card
        if (targetCreatureCard) {
            targetCreatureCard.attack -= spellCard.attack;
            targetCreatureCard.defense -= spellCard.defense;

            if (targetCreatureCard.defense <= 0) {
                let tempStage = this.playerStage.filter(card => card.defense > 0);
                this.playerStage = tempStage;
                this.player.playerStage = tempStage;
            }

            // Move played card to discard pile
            this.opponentDiscardPile.push(spellCard);
            // Remove the spell card from the player's hand
            const newHand = hand.filter(handCard => handCard.id !== spellCard.id);
            return newHand;
        }
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
        this.playerDiscardPile = [];
        this.opponentDiscardPile = [];
    }

    // Initialize the game
    async initialize(computer = true, opponentId, opponentUsn) {
        this.deck = await this.getDeck();

        if (computer) {
            // if computer is opponent
            this.opponent = new ComputerOpponent();
            this.opponent.player = this.user;
            this.opponentDeck = this.shuffleDeck([...this.deck]);

            this.drawInitialOpponentHand();
        }

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
        let newHand = [...this.hand];
        // Execute the computer opponent's turn
        if (this.opponent instanceof ComputerOpponent) {
            this.drawOpponentsCardsPerTurn();
            if (this.round === 0) {
                this.opponent.playerStage = this.playerStage;
                newHand = await this.opponent.playTurn(this.opponentHand, true);
            } else {
                this.opponent.playerStage = this.playerStage;
                newHand = await this.opponent.playTurn(this.opponentHand, false);
            }

            this.playerStage = this.opponent.playerStage;
            this.opponentStage = this.opponent.opponentStage;
            this.opponentHand = newHand;
        }

        // Reset players mana to 10
        this.user.mana = 10;
        this.opponent.mana = 10;
        this.round += 1;


        // Check if the game is over
        console.log("CHECKING GAME OVER")
        console.log(this.deck.length === 0 && this.hand.length === 0 && this.playerStage.length === 0)
        // if opponent has no more cards to play, game is determined by player's health
        if ((this.opponentDeck.length === 0 && this.opponentHand.length === 0 && this.opponentStage.length === 0) || (this.deck.length === 0 && this.hand.length === 0 && this.playerStage.length === 0)) {
            
            if (this.user.health > this.opponent.health) {
                // player wins
                return { gameOver: true, winner: this.user.username, message: "Player wins!" };
            } else if (this.user.health < this.opponent.health) {
                // opponent wins
                return { gameOver: true, winner: "Opponent", message: "Opponent wins!" };
            }
        } 
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
        let updatedOpponentStage = [...this.opponentStage];

        if (!card) {
            return { error: "Card is not in hand." };
        }

        if (card.mana > this.user.mana) {
            return { error: "Insufficient mana to play this card." }; // Return without playing the card
        }

        if (targetCardId) {
            // Find the target creature card in the player's stage
            const targetCreatureIndex = updatedOpponentStage.findIndex(card => card.id === parseInt(targetCardId));
            if (targetCreatureIndex !== -1) {
                // Apply the spell card effects to the target creature
                this.applySpellCardEffects(card, updatedOpponentStage[targetCreatureIndex]);
                // If creature's attack if below 0, update to 0
                if (updatedOpponentStage[targetCreatureIndex].attack <= 0) {
                    updatedOpponentStage[targetCreatureIndex].attack = 0;
                }
                // Check if the target creature's defense is below 0 and remove it if necessary
                if (updatedOpponentStage[targetCreatureIndex].defense <= 0) {
                    let tempStage = updatedOpponentStage.filter(card => card.defense > 0);

                    updatedOpponentStage = tempStage;
                    this.opponentStage = updatedOpponentStage;
                    this.opponent.opponentStage = updatedOpponentStage;
                }
                this.opponentStage = updatedOpponentStage;
                this.opponent.opponentStage = updatedOpponentStage;

                this.opponentDiscardPile.push(card);

                // Remove the spell card from the player's hand
                this.hand = this.hand.filter(handCard => handCard.id !== cardId);
                // Deduct mana cost from player's mana
                this.user.mana -= card.mana;
                return {
                    success: true,
                    message: `Spell card played successfully`,
                    opponentStage: this.opponent.opponentStage,
                    hand: this.hand,
                };
            } else {
                return { error: "Target creature card not found." };
            }

        } else {
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
                        // Add the spell card to the discard pile
                        this.playerDiscardPile.push(card);
                        // Remove the spell card from the player's hand
                        this.hand = this.hand.filter(handCard => handCard.id !== cardId);
                        // Deduct mana cost from player's mana
                        this.user.mana -= card.mana;

                        return {
                            success: true,
                            message: `Spell card ${card.name} played successfully on ${updatedStage[targetCreatureIndex].name}`,
                            updatedStage: updatedStage,
                            updatedHand: this.hand,
                        };
                    } else {
                        return { error: "Target creature card not found." };
                    }
                } else {
                    return { error: "Target creature card not specified." };
                }
            } else {
                return { error: "Unknown card type." };
            }
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

    // Method to attack opponent's health with a card from the user's hand
    attackOpponentHealth(cardId) {
        // Find the card instance in hand based on cardId
        const card = this.hand.find(card => card.id === cardId);
        // display all card ids in playerStage
        const cardStage = this.playerStage.find(card => card.id === cardId);

        if (card) {
            // card is in hand
            // Check if the card is a spell card with damage type
            if (card instanceof SpellCard && card.ability.toLowerCase() === 'damage') {
                const damage = card.attack; // Assuming spellAttack contains the damage value
                const manaCost = card.mana;
                // Deduct damage from opponent's health
                this.opponent.health -= damage;

                // Remove the card from the user's hand
                this.hand = this.hand.filter(handCard => handCard.id !== cardId);
                this.user.mana -= manaCost;

                return { success: true, message: `Opponent's health reduced by ${damage}` };
            } else if (card instanceof CreatureCard && card.hasBeenOnStage) {
                const damage = card.attack; // Assuming spellAttack contains the damage value
                // Deduct damage from opponent's health
                this.opponent.health -= damage;

                // Remove card from stage
                this.playerStage = this.playerStage.filter(stageCard => stageCard.id !== cardId);

                return { success: true, message: `Opponent's health reduced by ${damage}` };

            } else {
                return { error: "Invalid card type or card does not have a damage spell." };
            }
        } else if (cardStage) {
            // card is on stage
            const damage = cardStage.attack; // Assuming spellAttack contains the damage value
            // Deduct damage from opponent's health
            this.opponent.health -= damage;

            // Remove card from stage
            this.playerStage = this.playerStage.filter(stageCard => stageCard.id !== cardId);

            return { success: true, message: `Opponent's health reduced by ${damage}` };
        } else {
            return { error: "Card not found in hand or staging." };
        }
    }


    // Example method to apply effects of a spell card
    applySpellCardEffects(spellCard, targetCreatureCard = null) {
        // Apply effects based on the type of spell card
        switch (spellCard.ability.toLowerCase()) {
            case "damage":
                console.log("DAMAGE")
                // Example: Deal damage to opponent's creatures or player
                this.player.decreaseHealth(spellCard.attack); // Adjust based on your game mechanics

                break;
            case "buff":
                console.log("BUFF")
                // Example: Increase attack or defense of creatures
                this.buffCreatures(spellCard); // Implement this method
                break;
            case "debuff":
                console.log("DEBUFF")
                // Example: Decrease attack or defense of opponent's creatures
                this.debuffOpponentCreatures(spellCard, targetCreatureCard); // Implement this method
                break;
            // Add more cases for different types of spell cards...
            default:
                // Handle unknown spell card types
                console.error("Unknown spell card type:", spellCard.type);
        }
    }

    buffCreatures(spellCard) {
        console.log("Buffing creature on opponent's stage");
        // Apply the buff to a random creature on the opponent's stage
        if (this.opponentStage.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.opponentStage.length);
            const creature = this.opponentStage[randomIndex];
            creature.attack += spellCard.attack; // Adjust based on your game mechanics
            creature.defense += spellCard.defense; // Adjust based on your game mechanics
        }
    }

    debuffOpponentCreatures(spellCard, targetCreatureCard) {
        console.log("Debuffing creature on player's stage");
        // Apply the debuff to the target creature card
        if (targetCreatureCard) {
            targetCreatureCard.attack -= spellCard.attack; // Adjust based on your game mechanics
            targetCreatureCard.defense -= spellCard.defense; // Adjust based on your game mechanics
        }
    }

    attackCardToOpponent(playerCardId, opponentCardId) {
        console.log("ATTACKING OPPONENT CARD", playerCardId, opponentCardId);

        // Create copies of the player's stage and opponent's stage
        let tempStage = [...this.playerStage];
        let tempOpponentStage = [...this.opponentStage];

        // Find the index of the player's card and opponent's card
        const playerCardIndex = tempStage.findIndex(card => parseInt(card.id) === playerCardId);
        const opponentCardIndex = tempOpponentStage.findIndex(card => parseInt(card.id) === opponentCardId);

        // Find player card in hand
        const playerCardInHand = this.hand.find(card => parseInt(card.id) === playerCardId);

        // Check if both cards exist
        if (playerCardIndex !== -1 && opponentCardIndex !== -1) {
            // Calculate the damage based on the player's card attack
            const damage = tempStage[playerCardIndex].attack;

            // Reduce opponent's card defense by the damage
            tempOpponentStage[opponentCardIndex].defense -= damage;

            // If opponent's card defense is zero or less, remove it from the stage
            if (tempOpponentStage[opponentCardIndex].defense <= 0) {
                tempOpponentStage.splice(opponentCardIndex, 1);
            }

            // Remove the player's card from the stage
            tempStage = tempStage.filter(card => card.id !== playerCardId);

            // Update the player's stage and opponent's stage
            this.playerStage = tempStage;
            this.opponentStage = tempOpponentStage;
            this.opponent.opponentStage = tempOpponentStage;

            // Return a success message
            return { success: true, message: 'Card played successfully' };
        } else if (playerCardInHand !== -1 && opponentCardIndex !== -1) {
            // If the player's card is in hand, attack the opponent's card
            const damage = playerCardInHand.attack;
            tempOpponentStage[opponentCardIndex].defense -= damage;
            // If opponent's card defense is zero or less, remove it from the stage
            if (tempOpponentStage[opponentCardIndex].defense <= 0) {
                tempOpponentStage.splice(opponentCardIndex, 1);
            }
            // Remove the player's card from the hand
            this.hand = this.hand.filter(card => card.id !== playerCardId);
            this.opponentStage = tempOpponentStage;
            this.opponent.opponentStage = tempOpponentStage;
            return { success: true, message: 'card played successfully' };
        } else {
            // Return an error message if player's card or opponent's card is not found
            return { error: "Player card or opponent card not found." };
        }
    }

};

module.exports = { Game, User, Card, CreatureCard, SpellCard };