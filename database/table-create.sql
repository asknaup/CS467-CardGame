-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- DROP TABLES
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_spell;
DROP TABLE IF EXISTS card_creature;
DROP TABLE IF EXISTS card_instance;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_creds;


-- -----------------------------------------------------
-- DROP TRIGGERS
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS new_user;

-- -----------------------------------------------------
-- Create User Credentials Table 
-- -----------------------------------------------------
DROP TABLE IF EXISTS user_creds;

CREATE TABLE IF NOT EXISTS user_creds (
    user_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    pwd VARCHAR(50) NOT NULL,   -- hashed
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
    username VARCHAR(50) UNIQUE NOT NULL,
    game_count INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    PRIMARY KEY (user_id),

    FOREIGN KEY (user_id)
        REFERENCES user_creds(user_id)
        -- ON DELETE SET DELETE
        ON UPDATE CASCADE,
    FOREIGN KEY (username)
        REFERENCES user_creds(username)
        ON UPDATE CASCADE
);

-- Will trigger when user has created profile
DELIMITER $$
CREATE TRIGGER new_user AFTER INSERT ON user_creds
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
    game_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    player_id INT UNIQUE NOT NULL,
    game_date DATE,
    winner_id INT DEFAULT 0,
    loser_id INT DEFAULT 0,
    PRIMARY KEY (game_id) ,
    FOREIGN KEY (player_id)
        REFERENCES user_profile (user_id)
        -- ON DELETE SET NULL
        ON UPDATE CASCADE
);

ALTER TABLE game AUTO_INCREMENT=501;

-- -----------------------------------------------------
-- Create Card table
-- -----------------------------------------------------
DROP TABLE IF EXISTS cards;

CREATE TABLE IF NOT EXISTS cards (
    card_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    card_name VARCHAR(500) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    rarity INT NOT NULL,
    max_available INT NOT NULL,

    PRIMARY KEY (card_id)
);

ALTER TABLE cards AUTO_INCREMENT=1;
-- -----------------------------------------------------
-- Create Card Instance Table
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_instance;

CREATE TABLE IF NOT EXISTS card_instance (
    card_instance_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    card_id INT NOT NULL,
    owner_user_id INT NOT NULL,
    
    PRIMARY KEY (card_instance_id, card_id) ,
    INDEX (card_id),
    FOREIGN KEY (owner_user_id)
        REFERENCES user_profile(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (card_id)
        REFERENCES cards(card_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

ALTER TABLE card_instance AUTO_INCREMENT=5000;

-- -----------------------------------------------------
-- Create Card Creature table
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_creature;

CREATE TABLE IF NOT EXISTS card_creature (
    card_id INT UNIQUE NOT NULL,
    hp INT DEFAULT NULL,
    attack INT DEFAULT NULL,

    PRIMARY KEY (card_id),
    FOREIGN KEY (card_id)
        REFERENCES cards(card_id)
    --     ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- -----------------------------------------------------
-- Create games table
-- -----------------------------------------------------
DROP TABLE IF EXISTS card_spell;

CREATE TABLE IF NOT EXISTS card_spell (
    card_id INT UNIQUE NOT NULL,
    spell_ability VARCHAR(500) NOT NULL,
    health_regen INT DEFAULT NULL,

    PRIMARY KEY (card_id),
    FOREIGN KEY (card_id)
        REFERENCES cards(card_id)
    --     ON DELETE CASCADE
    --     ON UPDATE CASCADE
);



-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
