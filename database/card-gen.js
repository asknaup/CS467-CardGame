const db = require('./db-connector');
const OpenAI = require('openai');
const configFile = require('./config');
const fs = require('fs');

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
        const sql = 'SELECT * FROM cards WHERE cardId = ?'; // Corrected SQL query
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

function sendImageURLtoDB(cardId, imageURL) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE cards SET imageURL = ? WHERE cardId = ?'; // Corrected SQL query
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

async function generateImageForCard(prompt1, object1) {
    try {
        const openai = new OpenAI({ apiKey: configFile.password });
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt1,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        if (response.data.length > 0) {
            const b64 = response.data[0]['b64_json'];
            const buffer = Buffer.from(b64, "base64");
            const filename = `image_${object1}.png`;
            console.log("Writing Image: " +  filename);
            fs.writeFileSync(filename, buffer);
            return filename;
        } else {
            throw new Error("No image data received from OpenAI.");
        }
    } catch (error) {
        console.log(error);
        return null; // Return null if there's an error
    }
}


    


/*
const result = "your image URL";
  const fetchFile = await fetch(result);
  const responseBlob = await fetchFile.blob();
  const arrayBuffer = await responseBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
 const filePath = path.join(__dirname, './' + new Date() + ".png");

 const writeFileToDisc = fs.writeFileSync(filePath, buffer);

*/

module.exports.generateAiForCard = generateAiForCard;
module.exports.generateImageForCard = generateImageForCard;
module.exports.sendCardToDB = sendCardToDB;
module.exports.grabCardFromDB = grabCardFromDB;
module.exports.sendImageURLtoDB = sendImageURLtoDB;