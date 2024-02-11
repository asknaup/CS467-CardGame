const db = require('./db-connector');
const dbFunc = require('./db-functions')

function generatedGameInfo() {
    return;
};

function populateUserDeckSelection(userId) {
    dbFunc.gatherUserDecks(userId)
    .then(result => {
        // Filter based on userId
        var filteredDecks = result.filter(deck => deck.userId === userId);

        // Compile the Handlebars template
        var templateSource = document.getElementById("userDecksTemplate").innerHTML;
        var template = Handlebars.compile(templateSource);

        // Render the template with filtered data
        var renderedHtml = template({decks: filteredDecks});

        // Get the select element and update its HTML
        var selectElement = document.getElementById("userDecksSelect");
        selectElement.innerHTML = renderedHtml;
    })
    .catch(error => {
        console.error("Error fetching user decks:", error);
    });
}

function sendNewGameToDB(ownerId, listCards, numCards, imageLocation) {                  // Need DB inputs
    // Initialize a new game -> winner has not been decided
    return new Promise((resolve, reject) => {
        db.pool.query('START TRANSACTION', (beginTransactionErr) => {
            if (beginTransactionErr) {
                reject(beginTransactionErr);
                return;
            }

            const insertQueryGame = 'INSERT INTO generatedGame (ownerId, listCards, noCards, imageLocation) VALUES (?,?,?,?)';
            const valuesGame = [ownerId, listCards, numCards, imageLocation];
            const selectQuery = 'SELECT LAST_INSERT_ID() as lastGame';

            db.pool.query(insertQueryGame, valuesGame, (insertErr, insertResult) => {
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
                            resolve(selectResult[0].lastGame);
                        }
                    });
                });
            });
        });
    });
}

function grabAllGames() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from generated_games'
        db.pool.query(sql, (err, result) => {
            if (err) {
                reject(err); // Reject with the error if there is one
            } else {
                resolve(result); // Resolve with the query result
            }
        });
    })
}

function sendGameImageURLtoDB(cardId, imageURL) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE generatedGames SET imageURL = ? WHERE cardId = ?'; // Corrected SQL query
        const values = [imageURL, cardId]
        db.pool.query(sql, [card_id], (err, result) => {
            if (err) {
                reject(err); // Reject with the error if there is one
            } else {
                resolve(result); // Resolve with the query result
            }
        });
    });
}

module.exports.sendNewGameToDB = sendNewGameToDB;
module.exports.generatedGameInfo = generatedGameInfo;
module.exports.grabAllGames = grabAllGames;
module.exports.sendGameImageURLtoDB = sendGameImageURLtoDB;
module.exports.populateUserDeckSelection = populateUserDeckSelection;