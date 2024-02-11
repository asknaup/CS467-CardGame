dbFunc = require('./db-functions');

// TODO get user deck and shuffle
function getDeck(userId, deckId) {
    const deckList = dbFunc.getUserDeck(deckId);

    

    return deckList;
}
// TODO get user hand
// TODO user plays card


module.exports.getDeck = getDeck;