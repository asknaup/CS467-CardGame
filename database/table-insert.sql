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
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Elemental Resonance', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Unleashes the power of the elements to create a harmonious balance, influencing both offensive and defensive magic', 10);

-- Example 2 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Elemental Resonance', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 7, 4);

-- Example 3 - spell
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Arctic Wind', 'spell', 0, 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Blasts cold wind at opponent or creature.', 10);

-- Example 4 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Woods Spider', 'creature', 0, 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 2, 1);

-- Example 5 - spell
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Minor-Heal', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Heals self or creature by 1 point', 1);

-- Example 6 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Armored Elephant', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 3, 3);

-- Example 7 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Cave Bat', 'creature', 0, 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 5, 4);

-- Example 8 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Flaming Dragon', 'creature', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 5, 9);

-- Example 9 - creature
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Spiked Turtle', 'creature', 0, 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardCreature (cardId, hp, attack)
    VALUES (@lastCardId, 7, 7);

-- Example 10 - spell
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Quick Freeze', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Player can not move for a turn', 0);

-- Example 11 - spell
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Poison', 'spell', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Creature it is applied to loses 1 hp every turn', 0);

-- Example 12 - spell
INSERT INTO cards (cardName, cardType, rarity, maxAvailable) VALUES
    ('Cure', 'spell', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO cardSpell (cardId, spellAbility, healthRegen)
    VALUES (@lastCardId, 'Removes status like poisoned', 0);