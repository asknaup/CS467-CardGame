const db = require('./db-connector');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// *** Must Module.exports at bottom

function insertNewUserIntoDB(username, password, email) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user_creds (username, pwd, email) VALUES (?, ?, ?)';
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

            const insertQuery = 'INSERT INTO user_creds (username, pwd, email) VALUES (?, ?, ?)';
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
        const sql = 'SELECT user_id, username, pwd FROM user_creds WHERE username=?';
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
                    userId: user.user_id,
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
        const sql = 'SELECT user_id FROM user_creds WHERE username = ? and pwd = ?';
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

function getUserProfile(user_id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT game_count, wins, losses FROM user_profile WHERE user_id = ?'
        const val = [user_id]
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

function renderUserLibrary(userId) {
    
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


// function confirmUserExists(username, password) {
//     return new Promise(
//         (resolve, reject) => {
//             db.pool.query('SELECT USER WHERE PASSWORD'), (err, result) => {
//                 if (err) return reject(err);
//                 return resolve(result);
//             }
//         });
// }

// function createCard({ params }) {
//     return new Promise(
//         (resolve, reject) => {
//             db.pool.query('INSERT INTO '), (err, result) => {
//                 if (err) return reject(err);
//                 return resolve(result);
//             }
//         });
// }



module.exports.insertNewUserIntoDB = insertNewUserIntoDB;
module.exports.getUserProfile = getUserProfile;
module.exports.getUserId = getUserId;
module.exports.insertNewGameIntoGames = insertNewGameIntoGames;
module.exports.insertNewUser = insertNewUser;
module.exports.authenticateUser = authenticateUser;