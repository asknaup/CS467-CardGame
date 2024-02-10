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

function authenticateUser(username, password){
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


module.exports.insertNewUserIntoDB = insertNewUserIntoDB;
module.exports.getUserProfile = getUserProfile;
module.exports.getUserId = getUserId;
module.exports.insertNewGameIntoGames = insertNewGameIntoGames;
module.exports.insertNewUser = insertNewUser;
module.exports.authenticateUser = authenticateUser;
module.exports.createNewCollection = createNewCollection;