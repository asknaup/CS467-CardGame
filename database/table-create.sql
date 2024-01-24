-- --------------------------------
-- Create User Credentials Table --
-- --------------------------------
DROP TABLE IF EXISTS 'user_creds';

CREATE TABLE IF NOT EXISTS 'user_creds' (
    'user_id' INT UNIQUE NOT NULL AUTO_INCREMENT,
    'username' VARCHAR(50) UNIQUE NOT NULL,
    'password' VARCHAR(50) NOT NULL,
    PRIMARY KEY ('user_id')
);

ALTER TABLE 'user_creds' AUTO_INCREMENT=1000;

--
-- Create User Credentials Change table
-- <pk> Username
-- Old Password
-- New Password
-- Date

-- ----------------------------
-- Create User Profile table --
-- ----------------------------
DROP TABLE IF EXISTS 'user_profile';

CREATE TABLE IF NOT EXISTS 'user_profile' (
    'user_id' INT UNIQUE NOT NULL,
    'username' VARCHAR(50) UNIQUE NOT NULL,
    'game_count' INT DEFAULT 0,
    'wins' INT DEFAULT 0,
    'losses' INT DEFAULT 0,
    PRIMARY KEY ('user_id'),
    CONSTRAINT 'fk_user_profile_creds'
        FOREIGN KEY ('user_id')
        REFERENCES 'user_creds' ('user_id')
        ON DELETE SET NULL
        ON UPDATE CASCADE
)

--
-- Create User Game Table --
-- -------------------------
DROP TABLE IF EXISTS 'game';

CREATE TABLE IF NOT EXISTS 'game' (
    'game_id' INT UNIQUE NOT NULL,
    'user_id' INT UNIQUE NOT NULL,
    'date' INT DEFAULT 0,
    'wins' INT DEFAULT 0,
    'losses' INT DEFAULT 0,
    PRIMARY KEY ('user_id'),
    CONSTRAINT 'fk_user_profile_creds'
        FOREIGN KEY ('user_id')
        REFERENCES 'user_creds' ('user_id')
        ON DELETE SET NULL
        ON UPDATE CASCADE
)
-- User_game:
-- <pk> Username
-- <pk> Date
-- <pk><fk> game_id
-- <fk> Opponent 
-- Game cards
-- User_cards:
-- <pk> User
-- Card Name
-- Valid
-- Delete_flag: 0 -> valid 1 -> deleted from set.
-- Cards:
-- <pk> Name
-- HP
-- Attack
-- Health_Regen
-- Rarity
-- Max_available
-- <attributes tbd>
-- Card_change:
-- <pk> card_name
-- Date
-- Param
-- value
-- Games:
-- <pk> game id
-- Date
-- Players
-- Winner
-- <game attributes tbd>
