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

function createNewCollection(userId, gameId) {
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            const insertQuery = 'INSERT INTO collections (gameId, playerId, cardId) VALUES (?, ?, ?)';
            const selectQuery = 'SELECT LAST_INSERT_ID() as newCollectId';
            const vals = [gameId, userId, '[]']

            db.pool.query(insertQuery, vals, (insertErr, insertResult) => {
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
                            resolve(selectResult[0].newCollectId);
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

async function insertCreatureCard(cardId, creatureAttack, creatureDefense, cardType) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardCreature (cardId, attack, defense, cardType) VALUES (?, ?, ?, ?);';
        const vars = [cardId, creatureAttack, creatureDefense, cardType];

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

// Hacked, inserting ruleSet into noCards, and gameName into imageLocation
async function insertNewGeneratedGame(ownerId, numCards, listCards, gameName) {
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr)
                return;
            }

            const insertQuery = 'INSERT into generatedGame (ownerId, noCards, listCards, imageLocation) VALUES (?, ?, ?, ?)';;
            const selectQuery = 'SELECT LAST_INSERT_ID() as genGameId';
            const values = [ownerId, numCards, listCards, gameName];

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
                            resolve(selectResult[0].genGameId);
                        }
                    });
                });
            });
        });
    });
}

// Hacked, inserting ruleSet into noCards, and gameName into imageLocation
async function getGeneratedGameStats(genGameId) {
    return new Promise((resolve, reject) => {

        const query = 'SELECT ownerId, noCards as ruleSet, listCards, imageLocation as gameName FROM generatedGame WHERE gameId = ?'
        db.pool.query(query, genGameId, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function getAllGeneratedGames() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM generatedGame';
        db.pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getAllGeneratedGamesByUser(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM generatedGame where ownerId = ?';
        db.pool.query(query, userId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getOneGeneratedGame(gameId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM generatedGame where gameId = ?';
        db.pool.query(query, gameId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getAllCollectionsByUser(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM collections where playerId = ?';
        db.pool.query(query, userId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getAllDecksByUser(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM decks where playerId = ?';
        db.pool.query(query, userId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


//   '{"cardList": []}' MAYBE
//   console.log(collectionDataObject); 
async function insertOrSelectCollectionByUserIdandGameId(userId, gameId, collectName) {
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (startTransactionErr) => {
            if (startTransactionErr) {
                connection.release();
                reject(startTransactionErr);
                return;
            }

            const checkCollectionQuery = 'SELECT collectionId FROM collections WHERE playerId = ? AND gameId = ?';
            const insertQuery = 'INSERT INTO collections (playerId, gameId, cardId, collectionName) VALUES (?, ?, ?, ?)';
            const selectLastInsertIdQuery = 'SELECT LAST_INSERT_ID() as newCollectId';
            const vals = [userId, gameId, '{"cardList": []}', collectName];

            db.pool.query(checkCollectionQuery, [userId, gameId], (checkCollectionErr, checkCollectionResult) => {
                if (checkCollectionErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(checkCollectionErr);
                    });
                    return;
                }
                if (checkCollectionResult.length > 0) {
                    // Collection exists, return collectionId
                    const collectionId = checkCollectionResult[0].collectionId;
                    db.pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(commitErr);
                            });
                            return;
                        }
                        resolve(collectionId);
                    });
                } else {
                    // Collection doesn't exist, create a new one
                    db.pool.query(insertQuery, vals, (insertErr, insertResult) => {
                        if (insertErr) {
                            db.pool.query('ROLLBACK', () => {
                                reject(insertErr);
                            });
                            return;
                        }
                        db.pool.query(selectLastInsertIdQuery, (selectErr, selectResult) => {
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
                                    resolve(selectResult[0].newCollectId);
                                }
                            });
                        });
                    });
                }
            });
        });
    });
}

// CardId is json list of cards
async function grabListOfCardsFromCollection(collectId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT cardId FROM collections where collectionId = ?';
        db.pool.query(query, collectId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// You already have new list of cards to add
async function updateListOfCollection(collectId, cardIds) {
    return new Promise((resolve, reject) => {
        const updateQuery = 'UPDATE collections SET cardId = ? WHERE collectionId = ?';
        db.pool.query(updateQuery, [cardIds, collectId], (err, updateResult) => {
            if (err) {
                reject(err);
            } else {
                resolve(updateResult);
            }
        });
    });
}

// Json list of cards
async function grabAdminListCards(gameId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT listCards FROM generatedGame where gameId = ?';
        db.pool.query(query, gameId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function updateAdminListCards(listCards, gameId) {
    return new Promise((resolve, reject) => {
        const updateQuery = 'UPDATE generatedGame SET listCards = ? WHERE gameId = ?';
        db.pool.query(updateQuery, [listCards, gameId], (err, updateResult) => {
            if (err) {
                reject(err);
            } else {
                resolve(updateResult);
            }
        });
    });
}

async function grabUsername(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT username FROM userProfile where userId = ?';
        db.pool.query(query, userId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function grabGameName(gameId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT imageLocation FROM generatedGame where gameId = ?';
        db.pool.query(query, gameId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function grabListOfCardsFromCollection(collectId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT cardId FROM collections where collectionId = ?';
        db.pool.query(query, collectId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function grabGameIdFromCollection(collectId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT gameId FROM collections where collectionId = ?';
        db.pool.query(query, collectId, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function updateDeckById(cardList, deckId) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE decks SET cardId = ? WHERE deckId = ?';
        // Pass an array of values as the second parameter to the query function
        db.pool.query(query, [cardList, deckId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


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
module.exports.insertNewGeneratedGame = insertNewGeneratedGame;
module.exports.getGeneratedGameStats = getGeneratedGameStats;
module.exports.getAllGeneratedGames = getAllGeneratedGames;
module.exports.getAllGeneratedGamesByUser = getAllGeneratedGamesByUser;
module.exports.getAllCollectionsByUser = getAllCollectionsByUser;
module.exports.getOneGeneratedGame = getOneGeneratedGame;
module.exports.getAllDecksByUser = getAllDecksByUser;
module.exports.insertOrSelectCollectionByUserIdandGameId = insertOrSelectCollectionByUserIdandGameId;
module.exports.grabListOfCardsFromCollection = grabListOfCardsFromCollection;
module.exports.updateListOfCollection = updateListOfCollection;
module.exports.insertNewDeck = insertNewDeck;
module.exports.grabUsername = grabUsername;
module.exports.grabGameName = grabGameName;
module.exports.grabAdminListCards = grabAdminListCards;
module.exports.updateAdminListCards = updateAdminListCards;
module.exports.grabGameIdFromCollection = grabGameIdFromCollection;
module.exports.updateDeckById = updateDeckById;