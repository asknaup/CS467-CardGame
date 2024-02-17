const configFile = require('./config');

// Sends a post request to Leonardo with prompts, returns data
async function createAICard(prompt, theme, color, rarity) {
    const option_post = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${configFile.leonardo}`
        },
        body: JSON.stringify({
            height: 768,
            modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',        
            prompt: `fantasy trading card game card, ${prompt}, ${theme}, ${rarity} ${color} card border`,
            width: 512
        })
    };

    try {
        const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', option_post);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Get's the image data from imageId
async function getImageUrlFromLeonardo(imageId) {
    const option_get = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${configFile.leonardo}`
        }};

    try {
        const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${imageId}`, option_get);
        const data = await response.json();
        return data.generations_by_pk.generated_images;
    } catch (error) {
        console.error(error);
    }
}

/*
(async () => {
    //const aiCard = await createAICard('samurai', 'dark', 'gold');
    const val = await getImageUrlFromLeonardo('8c7a0cd1-475b-4740-9f29-fa1b167cf7d5'); // aiCard.sdGenerationJob.generationId
    console.log(val);
})();
*/

//8c7a0cd1-475b-4740-9f29-fa1b167cf7d5

/*
const result = "your image URL";
  const fetchFile = await fetch(result);
  const responseBlob = await fetchFile.blob();
  const arrayBuffer = await responseBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
 const filePath = path.join(__dirname, './' + new Date() + ".png");

 const writeFileToDisc = fs.writeFileSync(filePath, buffer);

*/

module.exports.getImageUrlFromLeonardo = getImageUrlFromLeonardo;
module.exports.createAICard = createAICard;


/*   Models available
    fetch('https://cloud.leonardo.ai/api/rest/v1/platformModels', options5)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err)); 
*/