const db = require('./db-connector');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// *** Must Module.exports at bottom

function insertNewUserIntoDB(username, password, email) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO userCreds (username, pwd, email) VALUES (?, ?, ?)';
        const val = [username, password, email];
        db.pool.query(sql, val, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function insertNewUser(username, password, email) {
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', async (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            // const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertQuery = 'INSERT INTO userCreds (username, pwd, email) VALUES (?, ?, ?)';
            const selectQuery = 'SELECT LAST_INSERT_ID() as newUserId';

            const values = [username, password, email];

            db.pool.query(insertQuery, values, (insertErr, insertResult) => {
                if (insertErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertErr);
                    });
                    return;
                }

                db.pool.query(selectQuery, (selectErr, selectResult) => {
                    if (selectErr) {
                        db.pool.query('ROLLBACK', () => {
                            reject(selectErr);
                        });
                        return;
                    }

                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                        } else {
                            resolve(selectResult[0].newUserId);
                        }
                    });
                });
            });
        });
    });
}

function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT userId, username, pwd FROM userCreds WHERE username=?';
        const val = [username];

        db.pool.query(sql, val, async (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length === 0) {
                // No user found
                resolve(null);
                return;
            }
            const user = result[0];
            // compare passwords 
            // const passwordsMatch = await bcrypt.compare(password, user.pwd);
            const passwordsMatch = password === user.pwd;

            console.log('passwordMatch:', passwordsMatch);
            if (passwordsMatch) {
                // Passwords match, returns userId and username
                resolve({
                    userId: user.userId,
                    username: user.username
                });
            } else {
                // Passwords do not match
                resolve(null);
            }
        })
    });
}

function getUserId(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT userId FROM userCreds WHERE username = ? and pwd = ?';
        const val = [username, password];
        db.pool.query(sql, val, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getUserProfile(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT gameCount, wins, losses FROM userProfile WHERE userId = ?'
        const val = [userId]
        db.pool.query(sql, val, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function insertNewGameIntoGames() {
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            const insertQuery = 'INSERT INTO game (startTime, endTime, winnerID) VALUES (CURRENT_TIMESTAMP, NULL, NULL)';
            const selectQuery = 'SELECT LAST_INSERT_ID() as newGameId';

            db.pool.query(insertQuery, (insertErr, insertResult) => {
                if (insertErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertErr);
                    });
                    return;
                }

                db.pool.query(selectQuery, (selectErr, selectResult) => {
                    if (selectErr) {
                        db.pool.query('ROLLBACK', () => {
                            reject(selectErr);
                        });
                        return;
                    }

                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                        } else {
                            resolve(selectResult[0].newGameId);
                        }
                    });
                });
            });
        });
    });
}

function createNewCollection(userId) {
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            const insertQuery = 'INSERT INTO decks (playerId) VALUES (?)';
            const selectQuery = 'SELECT LAST_INSERT_ID() as newGameId';

            db.pool.query(insertQuery, userId, (insertErr, insertResult) => {
                if (insertErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertErr);
                    });
                    return;
                }

                db.pool.query(selectQuery, (selectErr, selectResult) => {
                    if (selectErr) {
                        db.pool.query('ROLLBACK', () => {
                            reject(selectErr);
                        });
                        return;
                    }

                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                        } else {
                            resolve(selectResult[0].newGameId);
                        }
                    });
                });
            });
        });
    });
}

async function insertCard(name, type, user, rarity, manaCost) {
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (startTransactionErr) => {
            if (startTransactionErr) {
                connection.release();
                reject(startTransactionErr);
                return;
            }

            const insertCardQuery = 'INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES (?, ?, ?, ?)';
            const insertCardInstanceQuery = 'INSERT INTO cardInstance (cardId, ownerUserId) VALUES (?, ?)';

            db.pool.query(insertCardQuery, [name, type, rarity, manaCost], (insertCardErr, insertCardResult) => {
                if (insertCardErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertCardErr);
                    });
                    return;
                }

                const lastInsertedId = insertCardResult.insertId;

                db.pool.query(insertCardInstanceQuery, [lastInsertedId, user], (insertInstanceErr, insertInstanceResult) => {
                    if (insertInstanceErr) {
                        db.pool.query('ROLLBACK', () => {
                            reject(insertInstanceErr);
                        });
                        return;
                    }

                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                            return;
                        }
                        resolve(lastInsertedId);
                    });
                });
            });
        });
        // });
    });
}

async function insertCreatureCard(cardId, creatureAttack, creatureDefense) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardCreature (cardId, attack, defense) VALUES (?, ?, ?);';
        const vars = [cardId, creatureAttack, creatureDefense];

        db.pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function insertSpellCard(cardId, spellType, spellAbility, spellAttack, spellDefense, utility) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility) VALUES (?, ?, ?, ?, ?, ?);';
        const vars = [cardId, spellType, spellAbility, spellAttack, spellDefense, utility];

        db.pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function insertCardUrl(cardId, url) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardUrl (cardId, imagePath) VALUES (?, ?);';
        const vars = [cardId, url];

        db.pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function getCardInfo(cardId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM cards where cardId = ?'
        db.pool.query(query, cardId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        })
    });
}

// Get all decks from user
async function gatherUserDecks(userId) {
    return new Promise((resolve, reject) => {
        db.pool.query('SELECT deckId, deckName FROM decks WHERE playerId = ?', userId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
                return;
            } else {
                resolve(selectResult);
            }
        });
    });
}

// Get specific deck
async function getUserDeck(deckId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT cardId FROM decks WHERE deckId = ?';
        db.pool.query(query, deckId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

async function getCardById(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT cardId FROM cardInstance WHERE ownerUserId = ?';
        db.pool.query(query, deckId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

// Generate new game
async function createNewGame(ruleSet, userId, userDeckId) {
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            const insertQuery = 'INSERT INTO decks (playerId) VALUES (?)';
            const selectQuery = 'SELECT LAST_INSERT_ID() as newGameId';

            db.pool.query(insertQuery, userId, (insertErr, insertResult) => {
                if (insertErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertErr);
                    });
                    return;
                }

                db.pool.query(selectQuery, (selectErr, selectResult) => {
                    if (selectErr) {
                        db.pool.query('ROLLBACK', () => {
                            reject(selectErr);
                        });
                        return;
                    }

                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                        } else {
                            resolve(selectResult[0].newGameId);
                        }
                    });
                });
            });
        });
    });
}

//function insertIntoCollection(deckId, userId, cardId) { }

// function updateGameWinner({ params }) {
//     // Initialize a new game -> winner has not been decided
//     return new Promise((resolve, reject) => {
//         const sql = 'INSERT INTO game (startTime, endTime, winnerID) VALUES (CURRENT_TIMESTAMP, NULL, NULL)'                                // Games Database
//         const vals = params
//         db.pool.query(sql, vals, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

async function getCardIdByUser(userId) {
    return new Promise((resolve, reject) => {

        const query = `select ci.cardId, cardName, imagePath, c.cardType as cardType, rarity, manaCost, spellType, spellAbility, spellAttack, spellDefense, utility, cc.cardType as creatureType, attack, defense from cardInstance as ci 
            join cards as c on c.cardId = ci.cardId 
            left join cardUrl as cu on ci.cardId = cu.cardId 
            left join cardSpell as cs on ci.cardId = cs.cardId 
            left join cardCreature as cc on ci.cardId = cc.cardId 
            WHERE ci.ownerUserId = ?`;

        db.pool.query(query, userId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

async function getCardByCardId(cardId) {
    return new Promise((resolve, reject) => {

        const query = `select ci.cardId, cardName, imagePath, c.cardType as cardType, rarity, manaCost, spellType, spellAbility, spellAttack, spellDefense, utility, cc.cardType as creatureType, attack, defense from cardInstance as ci 
            join cards as c on c.cardId = ci.cardId 
            left join cardUrl as cu on ci.cardId = cu.cardId 
            left join cardSpell as cs on ci.cardId = cs.cardId 
            left join cardCreature as cc on ci.cardId = cc.cardId 
            WHERE ci.cardId = ?`

        db.pool.query(query, cardId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

function insertNewDeck(userId, deckName, cardList) {
    return new Promise((resolve, reject) => {

        const query = 'INSERT into decks (playerId, deckName, cardId) VALUES (?, ?, ?)';
        const values = [userId, deckName, cardList];
        db.pool.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.insertNewUserIntoDB = insertNewUserIntoDB;
module.exports.getUserProfile = getUserProfile;
module.exports.getUserId = getUserId;
module.exports.insertNewGameIntoGames = insertNewGameIntoGames;
module.exports.insertNewUser = insertNewUser;
module.exports.authenticateUser = authenticateUser;
module.exports.createNewCollection = createNewCollection;
module.exports.insertCard = insertCard;
module.exports.getCardInfo = getCardInfo;
module.exports.insertCreatureCard = insertCreatureCard;
module.exports.insertSpellCard = insertSpellCard;
module.exports.insertCardUrl = insertCardUrl;
module.exports.gatherUserDecks = gatherUserDecks;
module.exports.getUserDeck = getUserDeck;
module.exports.getCardById = getCardById;
module.exports.createNewGame = createNewGame;
module.exports.getCardIdByUser = getCardIdByUser;
module.exports.getCardByCardId = getCardByCardId;