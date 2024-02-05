const db = require('./db-connector');

// Generate AI things

const list_attributes = ['big', 'weak', 'little', 'tall', 'fast', 'slow'];
const animals = ['dog', 'cat', 'monkey', 'parrot', 'dragon', 'unicorn', 'horse'];

function generateAiForCard(input) {
    const randomAttr = Math.floor(Math.random() * list_attributes.length);
    const randomAnimal = Math.floor(Math.random() * animals.length);

    const attr = list_attributes[randomAttr];
    const animal = animals[randomAnimal];
    return [attr, animal];
}

function grabCardFromDB(card_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM card WHERE cardId = ?'; // Corrected SQL query
        db.pool.query(sql, [card_id], (err, result) => {
            if (err) {
                reject(err); // Reject with the error if there is one
            } else {
                resolve(result); // Resolve with the query result
            }
        });
    });
}

// update card

function sendCardToDB(name, type, user) {
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr);
                return;
            }

            const insertQueryCard = 'INSERT INTO cards (cardName, cardType, rarity, max_available) VALUES (?,?,?,?)';
            const insertQueryCardInstance = 'INSERT INTO cardInstance (cardId, ownerUserId) VALUES (?,?)';
            const valuesCard = [name, type, 2, 2];
            const selectQuery = 'SELECT LAST_INSERT_ID() as lastCard';

            db.pool.query(insertQueryCard, valuesCard, (insertErr, insertResult) => {
                if (insertErr) {
                    db.pool.query('ROLLBACK', () => {
                        reject(insertErr);
                    });
                    return;
                }
                const insertId = insertResult.insertId;
                const valuesCardInstance = [insertId, user];

                db.pool.query(insertQueryCardInstance, valuesCardInstance, (insertErr, insertResult) => {
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
                        resolve(selectResult[0].lastCard);
                    }
                });
                    });
                });
            });
        });
    });
}        
module.exports.generateAiForCard = generateAiForCard;
module.exports.sendCardToDB = sendCardToDB;