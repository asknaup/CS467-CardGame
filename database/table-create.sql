-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- DROP TABLES
-- -----------------------------------------------------
-- Tables with no foreign keys
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS cardSpell;
DROP TABLE IF EXISTS cardCreature;
DROP TABLE IF EXISTS cardInstance;
DROP TABLE IF EXISTS cardUrl;

-- Tables with foreign keys
DROP TABLE IF EXISTS gameInstance;
DROP TABLE IF EXISTS generatedGame;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS userProfile;
DROP TABLE IF EXISTS userCreds;

-- -----------------------------------------------------
-- DROP TRIGGERS
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS newUser;

-- -----------------------------------------------------
-- Create User Credentials Table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS userCreds;

CREATE TABLE IF NOT EXISTS userCreds (
    userId INT UNIQUE NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    pwd VARCHAR(50) NOT NULL,   -- hashed
    email VARCHAR(100) UNIQUE NOT NULL,
    accountStatus INT NOT NULL DEFAULT 1, -- 0 = not active, 1=activated, 2=suspended
    PRIMARY KEY (userId)
);

ALTER TABLE userCreds AUTO_INCREMENT=1001;

-- -----------------------------------------------------
-- Create User Profile table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS userProfile;

CREATE TABLE IF NOT EXISTS userProfile (
    userId INT UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    gameCount INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    PRIMARY KEY (userId),

    FOREIGN KEY (userId)
        REFERENCES userCreds(userId)
        -- ON DELETE SET DELETE
        ON UPDATE CASCADE
);

-- Will trigger when user has created profile
DELIMITER $$
CREATE TRIGGER newUser AFTER INSERT ON userCreds
    FOR EACH ROW
        BEGIN
            -- Insert corresponding record
            INSERT INTO userProfile (userId, username) VALUES
                (NEW.userId, NEW.username);
        END $$

-- reset delim
DELIMITER ;

-- -----------------------------------------------------
-- Create User Game Table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS gameInstance;

CREATE TABLE IF NOT EXISTS gameInstance (
    gameId INT UNIQUE NOT NULL AUTO_INCREMENT,
    startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endTime TIMESTAMP NULL,
    winnerId INT,

    PRIMARY KEY (gameId),
    FOREIGN KEY (winnerId)
        REFERENCES userProfile(userId)
        -- ON DELETE SET NULL
        -- ON UPDATE CASCADE
);

ALTER TABLE gameInstance AUTO_INCREMENT=501;

-- -----------------------------------------------------
-- Create Card table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cards;

CREATE TABLE IF NOT EXISTS cards (
    cardId INT UNIQUE NOT NULL AUTO_INCREMENT,
    cardName VARCHAR(500) NOT NULL,
    cardType VARCHAR(50) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    manaCost INT NOT NULL,

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
        REFERENCES userProfile(userId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

ALTER TABLE cardInstance AUTO_INCREMENT=5000;

-- -----------------------------------------------------
-- Create Card Creature table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cardCreature;

CREATE TABLE IF NOT EXISTS cardCreature (
    cardId INT UNIQUE NOT NULL,
    attack INT DEFAULT NULL,
    defense INT DEFAULT NULL,
    creatureType VARCHAR(100),

    PRIMARY KEY (cardId),
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create card spell table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cardSpell;

CREATE TABLE IF NOT EXISTS cardSpell (
    cardId INT UNIQUE NOT NULL,
    spellType VARCHAR(500),
    spellAbility VARCHAR(5000),
    spellAttack INT DEFAULT NULL,
    spellDefense INT DEFAULT NULL,
    utility BOOLEAN,

    PRIMARY KEY (cardId),
    FOREIGN KEY (cardId)
        REFERENCES cards(cardId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Create Image URL table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cardUrl;

CREATE TABLE IF NOT EXISTS cardUrl (
    cardId INT UNIQUE NOT NULL,
    imagePath VARCHAR(1000) NOT NULL,

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
    deckName VARCHAR(200),
    cardId VARCHAR(5000),  --json of list of card {"cardList": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
    -- quantity INT,

    PRIMARY KEY (deckId),
    FOREIGN KEY (playerId) REFERENCES userProfile(userId)
    -- FOREIGN KEY (cardId) REFERENCES cards(cardId)
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
    FOREIGN KEY (gameId) REFERENCES gameInstance(gameId),
    FOREIGN KEY (playerId) REFERENCES userProfile(userId)
);

ALTER TABLE moves AUTO_INCREMENT=1;

-- -----------------------------------------------------
-- CREATE generateGame Table
-- -----------------------------------------------------
DROP TABLE IF EXISTS game;

CREATE TABLE IF NOT EXISTS game (
    gameId INT,
    playerId INT,
    deckId INT,

    PRIMARY KEY (gameId, playerId, deckId),
    FOREIGN KEY (gameId) REFERENCES gameInstance(gameId),
    FOREIGN KEY (playerId) REFERENCES userProfile(userId),
    FOREIGN KEY (deckId) REFERENCES decks(deckId)
);

-- -----------------------------------------------------
-- CREATE generateGame Table
-- -----------------------------------------------------
DROP TABLE IF EXISTS generatedGame;

CREATE TABLE IF NOT EXISTS generatedGame (
    gameId INT UNIQUE AUTO_INCREMENT,
    ownerId INT,
    noCards INT,
    listCards VARCHAR(5000),
    imageLocation VARCHAR(1000),

    PRIMARY KEY (gameId),
    FOREIGN KEY (ownerId) 
        REFERENCES userProfile(userId) 
);

ALTER TABLE generatedGame AUTO_INCREMENT=5000;

-- -----------------------------------------------------
-- CREATE INDEX VALUES FOR FASTER QUERIES
-- -----------------------------------------------------
CREATE INDEX idx_username ON userCreds(username);
CREATE INDEX idx_userId ON userProfile(userId);
CREATE INDEX idx_gameId ON game(gameId);
CREATE INDEX idx_cardId ON cardInstance(cardId);
CREATE INDEX idx_playerId ON decks(playerId);
CREATE INDEX idx_gameId ON moves(gameId);
CREATE INDEX idx_playerId ON moves(playerId);

-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
