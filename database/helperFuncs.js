function convertListToDict(list) {
    let dict = {};
    for (let i = 0; i < list.length; i++) {
        let card = list[i];
        dict[card.cardId] = card;
    }
    return dict;
}

module.exports.convertListToDict = convertListToDict;