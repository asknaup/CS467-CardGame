-- Create dummy data
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Insert into user_creds and user_profile
-- -----------------------------------------------------

INSERT IGNORE INTO user_creds (username, pwd, account_status) VALUES
    ('admin', 'admin', 1),
    ('aknaup', 'qwerty123456', 1),
    ('cs467', 'cs467pwd', 1);


-- -----------------------------------------------------
-- Insert into cards tables
-- -----------------------------------------------------
-- rarity = 1-10
-- max_available = 20
-- ownerUserId is admin at 1001
-- -----------------------------------------------------
-- Example 1 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Elemental Resonance', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Unleashes the power of the elements to create a harmonious balance, influencing both offensive and defensive magic', 10);

-- Example 2 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Elemental Resonance', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 7, 4);

-- Example 3 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Arctic Wind', 'spell', 0, 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Blasts cold wind at opponent or creature.', 10);

-- Example 4 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Woods Spider', 'creature', 0, 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 2, 1);

-- Example 5 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Minor-Heal', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Heals self or creature by 1 point', 1);

-- Example 6 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Armored Elephant', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 3, 3);

-- Example 7 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Cave Bat', 'creature', 0, 5);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 5, 4);

-- Example 8 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Flaming Dragon', 'creature', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 5, 9);

-- Example 9 - creature
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Spiked Turtle', 'creature', 0, 15);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_creature (cardId, hp, attack)
    VALUES (@lastCardId, 7, 7);

-- Example 10 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Quick Freeze', 'spell', 0, 20);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Player can not move for a turn', 0);

-- Example 11 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Poison', 'spell', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Creature it is applied to loses 1 hp every turn', 0);

-- Example 12 - spell
INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES
    ('Cure', 'spell', 0, 10);

SET @lastCardId = LAST_INSERT_ID();

INSERT INTO cardInstance (cardId, ownerUserId)
    SELECT @lastCardId, 1001;

INSERT INTO card_spell (cardId, spell_ability, health_regen)
    VALUES (@lastCardId, 'Removes status like poisoned', 0);