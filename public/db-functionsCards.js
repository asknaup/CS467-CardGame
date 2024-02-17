// const db = require('./db-connectorCards');
import {pool} from './db-connectorCards.js'
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// *** Must Module.exports at bottom

function insertCard(name, type, user, rarity, manaCost) {
    return new Promise((resolve, reject) => {
        pool.query('START TRANSACTION', (startTransactionErr) => {
            if (startTransactionErr) {
                connection.release();
                reject(startTransactionErr);
                return;
            }

            const insertCardQuery = 'INSERT INTO cards (cardName, cardType, rarity, manaCost) VALUES (?, ?, ?, ?)';
            const insertCardInstanceQuery = 'INSERT INTO cardInstance (cardId, ownerUserId) VALUES (?, ?)';

            pool.query(insertCardQuery, [name, type, rarity, manaCost], (insertCardErr, insertCardResult) => {
                if (insertCardErr) {
                    pool.query('ROLLBACK', () => {
                        reject(insertCardErr);
                    });
                    return;
                }

                const lastInsertedId = insertCardResult.insertId;

                pool.query(insertCardInstanceQuery, [lastInsertedId, user], (insertInstanceErr, insertInstanceResult) => {
                    if (insertInstanceErr) {
                        pool.query('ROLLBACK', () => {
                            reject(insertInstanceErr);
                        });
                        return;
                    }

                    pool.query('COMMIT', (commitErr) => {
                        if (commitErr) {
                            pool.query('ROLLBACK', () => {
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

function insertCreatureCard(cardId, creatureAttack, creatureDefense) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardCreature (cardId, attack, defense) VALUES (?, ?, ?);';
        const vars = [cardId, creatureAttack, creatureDefense];

        pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function insertSpellCard(cardId, spellType, spellAbility, spellAttack, spellDefense, utility) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardSpell (cardId, spellType, spellAbility, spellAttack, spellDefense, utility) VALUES (?, ?, ?, ?, ?, ?);';
        const vars = [cardId, spellType, spellAbility, spellAttack, spellDefense, utility];

        pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function insertCardUrl(cardId, url) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO cardUrl (cardId, imagePath) VALUES (?, ?);';
        const vars = [cardId, url];

        pool.query(query, vars, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Get all decks from user
async function gatherUserDecks(userId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT deckId, deckName FROM decks WHERE playerId = ?', userId, (selectErr, selectResult) => {
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
        pool.query(query, deckId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

export async function getCardIdByUser(userId) {
    return new Promise((resolve, reject) => {

        const query = 'select ci.cardId, cardName, imagePath, cardType, rarity, manaCost, spellType, spellAbility, spellAttack, spellDefense, utility, attack, defense from cardInstance as ci ' +
            'join cards as c on c.cardId = ci.cardId ' +
            'left join cardUrl as cu on ci.cardId = cu.cardId ' +
            'left join cardSpell as cs on ci.cardId = cs.cardId ' +
            'left join cardCreature as cc on ci.cardId = cc.cardId ' +
            'WHERE ci.ownerUserId = ?';

        pool.query(query, userId, (selectErr, selectResult) => {
            if (selectErr) {
                reject(selectErr);
            } else {
                resolve(selectResult);
            }
        });
    });
}

export function insertNewDeck(userId, deckName, cardList) {
    return new Promise((resolve, reject) => {

        const query = 'INSERT into decks (playerId, deckName, cardId) VALUES (?, ?, ?)';
        const values = [userId, deckName, cardList];
        pool.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// module.exports.insertCard = insertCard;
// module.exports.insertCreatureCard = insertCreatureCard;
// module.exports.insertSpellCard = insertSpellCard;
// module.exports.insertCardUrl = insertCardUrl;
// module.exports.gatherUserDecks = gatherUserDecks;
// module.exports.getUserDeck = getUserDeck;
// module.exports.getCardIdByUser = getCardIdByUser;