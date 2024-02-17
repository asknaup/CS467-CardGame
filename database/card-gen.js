const db = require('./db-connector');
const OpenAI = require('openai');
// const configFile = require('./config');
const fs = require('fs');
const path = require('path');

// Generate AI things

const attributes = ['strong', 'weak', 'small', 'tall', 'fast', 'slow', 'clever', 'clumsy', 'brave', 'timid'];
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "white", "pink"];
const animals = ['dog', 'cat', 'monkey', 'parrot', 'dragon', 'unicorn', 'horse', 'lion', 'elephant', 'rabbit'];
const verbs = ['Jump', 'Sing', 'Fly', 'Eat', 'Dance', 'Run', 'Laugh', 'Sleep', 'Read', 'Swim'];


function generateAiForCard(input) {
    let string = '';
    let num = Math.floor(Math.random() * attributes.length);
    string.concat(" ", attributes[num])
    num = Math.floor(Math.random() * attributes.length);
    string.concat(" ", colors[num])
    num = Math.floor(Math.random() * attributes.length);
    string.concat(" ", animals[num])
    num = Math.floor(Math.random() * attributes.length);
    string = string.concat(" ", verbs[num])
    return string;
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
            const fullPath = path.join(__dirname, 'images', filename)
            console.log("Writing Image: " +  filename);
            fs.writeFileSync(fullPath, buffer);
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
module.exports.grabCardFromDB = grabCardFromDB;