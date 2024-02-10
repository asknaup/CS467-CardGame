-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- DROP TABLES
-- -----------------------------------------------------
-- Tables with no foreign keys
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS card_spell;
DROP TABLE IF EXISTS card_creature;
DROP TABLE IF EXISTS cardInstance;

-- Tables with foreign keys
DROP TABLE IF EXISTS generatedGame;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_creds;

-- -----------------------------------------------------
-- DROP TRIGGERS
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS newUser;
DROP TRIGGER IF EXISTS newCard;

-- -----------------------------------------------------
-- Create User Credentials Table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS user_creds;

CREATE TABLE IF NOT EXISTS user_creds (
    user_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    pwd VARCHAR(50) NOT NULL,   -- hashed
    email VARCHAR(100) NOT NULL,
    account_status INT NOT NULL DEFAULT 1, -- 0 = not active, 1=activated, 2=suspended
    PRIMARY KEY (user_id)
);

ALTER TABLE user_creds AUTO_INCREMENT=1001;

-- -----------------------------------------------------
-- Create User Profile table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS user_profile;

CREATE TABLE IF NOT EXISTS user_profile (
    user_id INT UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    game_count INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    PRIMARY KEY (user_id),

    FOREIGN KEY (user_id)
        REFERENCES user_creds(user_id)
        -- ON DELETE SET DELETE
        ON UPDATE CASCADE
);

-- Will trigger when user has created profile
DELIMITER $$
CREATE TRIGGER newUser AFTER INSERT ON user_creds
    FOR EACH ROW
        BEGIN
            -- Insert corresponding record
            INSERT INTO user_profile (user_id, username) VALUES
                (NEW.user_id, NEW.username);
        END $$

-- reset delim
DELIMITER ;

-- -----------------------------------------------------
-- Create User Game Table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS game;

CREATE TABLE IF NOT EXISTS game (
    gameId INT UNIQUE NOT NULL AUTO_INCREMENT,
    startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endTime TIMESTAMP NULL,
    winnerId INT,

    PRIMARY KEY (gameId),
    FOREIGN KEY (winnerId)
        REFERENCES user_profile(user_id)
        -- ON DELETE SET NULL
        -- ON UPDATE CASCADE
);

ALTER TABLE game AUTO_INCREMENT=501;

-- -----------------------------------------------------
-- Create Card table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cards;

CREATE TABLE IF NOT EXISTS cards (
    cardId INT UNIQUE NOT NULL AUTO_INCREMENT,
    cardName VARCHAR(500) NOT NULL,
    cardType VARCHAR(50) NOT NULL,
    rarity INT NOT NULL,
    max_available INT NOT NULL,

    PRIMARY KEY (cardId)
);

ALTER TABLE cards AUTO_INCREMENT=1;
-- -----------------------------------------------------
-- Create Card Instance Table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cardInstance;

CREATE TABLE IF NOT EXISTS cardInstance (
    cardInstanceId INT UNIQUE NOT NULL AUTO_INCREMENT,
    cardId INT NOT NULL,
    ownerUserId INT NOT NULL,
    
    PRIMARY KEY (cardInstanceId, cardId) ,
    INDEX (cardId),
    FOREIGN KEY (ownerUserId)
        REFERENCES user_profile(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

ALTER TABLE cardInstance AUTO_INCREMENT=5000;

-- Will trigger when user has created a new card
DELIMITER $$
CREATE TRIGGER newCard AFTER INSERT ON cards
    FOR EACH ROW
        BEGIN
            -- Insert corresponding record into cardInstance for each user
            INSERT INTO cardInstance (cardId, ownerUserId)
            SELECT NEW.cardId, user_id
            FROM user_profile;
        END $$
DELIMITER ;

-- -----------------------------------------------------
-- Create Card Creature table
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_creature;

CREATE TABLE IF NOT EXISTS card_creature (
    cardId INT UNIQUE NOT NULL,
    hp INT DEFAULT NULL,
    attack INT DEFAULT NULL,

    PRIMARY KEY (cardId),
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create card spell table
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_spell;

CREATE TABLE IF NOT EXISTS card_spell (
    cardId INT UNIQUE NOT NULL,
    spell_ability VARCHAR(500) NOT NULL,
    health_regen INT DEFAULT NULL,

    PRIMARY KEY (cardId),
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Create deck table
-- -----------------------------------------------------
DROP TABLE IF EXISTS decks;

CREATE TABLE IF NOT EXISTS decks (
    deckId INT AUTO_INCREMENT,
    playerId INT NOT NULL,
    cardId INT,
    quantity INT,

    PRIMARY KEY (deckId),
    FOREIGN KEY (playerId) REFERENCES user_profile(user_id),
    FOREIGN KEY (cardId) REFERENCES cards(cardId)
);

ALTER TABLE decks AUTO_INCREMENT=7000;
-- -----------------------------------------------------
-- Create moves table
-- -----------------------------------------------------
DROP TABLE IF EXISTS moves;

CREATE TABLE IF NOT EXISTS moves (
    moveId INT AUTO_INCREMENT,
    gameId INT,
    playerId INT,
    roundNumber INT,
    moveDetails VARCHAR(255),

    PRIMARY KEY (moveId),
    FOREIGN KEY (gameId) REFERENCES game(gameId),
    FOREIGN KEY (playerId) REFERENCES user_profile(user_id)
);

ALTER TABLE moves AUTO_INCREMENT=1;


-- -----------------------------------------------------
-- CREATE INDEX VALUES FOR FASTER QUERIES
-- -----------------------------------------------------
DROP TABLE IF EXISTS generatedGame;

CREATE TABLE IF NOT EXISTS generatedGame (
    gameId INT UNIQUE,
    imageLocation VARCHAR(1000),
    ownerId INT,
    noCards INT,
    listCards VARCHAR(5000),

    PRIMARY KEY (gameId),
    FOREIGN KEY (ownerId) REFERENCES user_profile(user_id) 
);

-- -----------------------------------------------------
-- CREATE INDEX VALUES FOR FASTER QUERIES
-- -----------------------------------------------------
CREATE INDEX idx_username ON user_creds(username);
CREATE INDEX idx_userId ON user_profile(user_id);
CREATE INDEX idx_gameId ON game(gameId);
CREATE INDEX idx_cardId ON cardInstance(cardId);
CREATE INDEX idx_playerId ON decks(playerId);
CREATE INDEX idx_gameId ON moves(gameId);
CREATE INDEX idx_playerId ON moves(playerId);

-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
