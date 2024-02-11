-- Create dummy data
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Insert into userCreds and user_profile
-- -----------------------------------------------------

INSERT IGNORE INTO userCreds (username, pwd, accountStatus, email) VALUES
    ('admin', 'admin', 1, 'admin@admin.com'),
    ('aknaup', 'qwerty123456', 1, 'knaupa@oregonstate.edu'),
    ('cs467', 'cs467pwd', 1, 'tradingcardteam@oregonstate.edu');


-- -----------------------------------------------------
-- Insert into cards tables
-- -----------------------------------------------------
-- rarity = 1-10
-- maxAvailable = 20
-- ownerUserId is admin at 1001
-- -----------------------------------------------------
-- Example 1 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Elemental Resonance', 'spell', 'Common', 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Offensive', 'Attacks player', 10, 0, 0);

-- Example 2 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Elemental Resonance', 'spell', 'Common', 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 7, 4);

-- Example 3 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Arctic Wind', 'spell', 'Rare', 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Sorcery', 'Blasts cold wind at opponent or creature.', 10, 0, 0);

-- Example 4 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Woods Spider', 'creature', 'Uncommon', 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 2, 1);

-- Example 5 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Minor-Heal', 'spell', 'Common', 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Enchantment', 'Heals self or creature by 1 point', 1, 1, 1);

-- Example 6 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Armored Elephant', 'spell', 'Legendary', 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 3, 3);

-- Example 7 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Cave Bat', 'creature', 'Common', 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 5, 4);

-- Example 8 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Flaming Dragon', 'creature', 'Legendary', 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 5, 9);

-- Example 9 - creature
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Spiked Turtle', 'creature', 'Rare', 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, attack, defense)
    VALUES (@lastCardId, 7, 7);

-- Example 10 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Quick Freeze', 'spell', 'Common', 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Scorery', 'Player can not move for a turn', 0, 0, 1);

-- Example 11 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Poison', 'spell', 'Common', 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Scorcery', 'Creature it is applied to loses 1 hp every turn', 1, 0, 0);

-- Example 12 - spell
INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES
    ('Cure', 'spell', 'Common', 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility)
    VALUES (@lastCardId, 'Utility', 'Removes status like poisoned', 0, 0, 1);

-- -----------------------------------------------------
-- Create Deck
-- -----------------------------------------------------
INSERT INTO decks (playerId, deckName, cardId) VALUES 
    (1001, "admin's first deck", "[{'cardId': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}]"),
    (1001, "admin's second deck", "[{'cardId': [1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 17, 23, 24]}]")