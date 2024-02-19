const configFile = require('./config');

const attributes = ['strong', 'weak', 'small', 'tall', 'fast', 'slow', 'clever', 'clumsy', 'brave', 'timid'];
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "white", "pink"];
const animals = ['dog', 'cat', 'monkey', 'parrot', 'dragon', 'unicorn', 'horse', 'lion', 'elephant', 'rabbit'];
const verbs = ['Jump', 'Sing', 'Fly', 'Eat', 'Dance', 'Run', 'Laugh', 'Sleep', 'Read', 'Swim'];


// Sends a post request to Leonardo with prompts, returns data
async function createAICard(prompt, theme, color, rarity, num) {
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
            num_images: num,
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

function createDataStructCreature(colors, creatures, places) {
    const data_struct = {
        name: 'Joe Smith',
        creature: creatures,
        place: places,
        color: colors,
        URL: null,
        description: '',
        cardType: 'Creature',
        attack: 2,
        defense: 2,
        manaCost: 3,
        enter_effect: null
    };

    let newStruct = { ...data_struct };

    if (colors == "Random") {
        newStruct.color = getRandomElement(colors1);
    } else if (colors == "None") {
        newStruct.color = "";
    } else {
        newStruct.color = colors;
    }

    if (creatures == "Random") {
        newStruct.creature = getRandomElement(creatures1);
    } else {
        newStruct.creature = creatures;
    }

    if (places == "Random") {
        newStruct.place = getRandomElement(places1);
    } else {
        newStruct.place = places;
    }
    return newStruct;
}

// Helper function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

    const places1 = [
        "Random", "African", "Ancient Babylon", "Ancient Ruins", "Ancient Egypt", "Antarctica", "Arabian", "Arctic Tundra", 
        "Amazon Rainforest", "American", "Aztec", "Chinese Dynasty", "Corrupt", "Cyberpunk Dystopia", 
        "Deep Sea Abyss", "Deep Space Outpost", "Desert Oasis", "Enchanted Castle", "Evil", "Fairy Kingdom", 
        "Fairy Ring", "Fairy Tale Forest", "Futuristic", "Futuristic Megacity", "Galactic Arena", "Galactic", 
        "Good", "Greek Mythology", "Haunted", "Himalayan", "Himalayan Mountains", "Industrial Revolution", 
        "Lost City of Atlantis", "Lost Temple", "Lunar Colony", "Mars Colony", "Mayan", "Medieval Castle", 
        "Medieval Europe", "Medieval Tournament", "Medieval Village", "Native American", "Ninjas", "Parallel Earth", 
        "Planet", "Pirate", "Polynesian Island", "Post-Apocalyptic", "Roman Colosseum", "Roman Empire", 
        "Renaissance Italy", "Robot Factory", "Samurai Dojo", "Samurai", "Space Colony Ship", "Space Exploration", 
        "Space Opera", "Space Pirate", "Space Station", "Steampunk", "Submarine", "Subterranean City", 
        "Time Travel", "Tropical Island", "Underwater", "Underworld Realm", "Viking", "Victorian London", 
        "Western Saloon"
        ];

    const creatures1 = [
        "Random", "Angel", "Banshee", "Basilisk", "Bigfoot", "Centaur", "Cerberus", "Chimera", "Chupacabra", "Cthulhu", "Cyclops",
        "Demon", "Doppelganger", "Dragon", "Dwarf", "Elf", "Fairy", "Frost Giant", "Genie", "Ghost", "Gnome",
        "Goblin", "Gremlin", "Griffin", "Harpie", "Hippogriff", "Hydra", "Imp", "Jinn", "Kelpie", "Kraken",
        "Leprechaun", "Lich", "Manticore", "Mermaid", "Minotaur", "Mothman", "Naga", "Nymph", "Ogre", "Oni",
        "Pegasus", "Peryton", "Phoenix", "Roc", "Sasquatch", "Satyr", "Sea Serpent", "Selkie", "Siren", "Skeleton",
        "Specter", "Sphinx", "Sprite", "Tanuki", "Thunderbird", "Titan", "Troll", "Unicorn", "Valkyrie", "Vampire",
        "Vampire Bat", "Vodyanoy", "Wendigo", "Werewolf", "Wight", "Will-o'-the-Wisp", "Witch", "Wizard", "Wraith",
        "Wyrm", "Wyvern", "Xorn", "Yuki-onna", "Yeti", "Zaratan", "Ziz", "Zombie"
        ];

    const colors1 = [
        "No Significant Color", "Random", "Blue", "Brown", "Gold",
        "Green", "Magenta", "Maroon",
        "Navy", "Orange", "Pink", "Purple", "Red",
        "Silver", "Turquoise", "Violet", "Yellow"
    ];






/*
(async () => {
    const aiCard = await createAICard('samurai', 'dark', 'gold', 'rare');
    console.log(aiCard.sdGenerationJob);
    const val = await getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId); // aiCard.sdGenerationJob.generationId
    console.log(val);
})();
*/

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
module.exports.createDataStructCreature = createDataStructCreature;


/*   Models available
    fetch('https://cloud.leonardo.ai/api/rest/v1/platformModels', options5)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err)); 
*/