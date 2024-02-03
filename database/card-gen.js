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

module.exports.generateAiForCard = generateAiForCard;