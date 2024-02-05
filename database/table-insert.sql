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