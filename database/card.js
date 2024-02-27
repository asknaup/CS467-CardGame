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

async function createDataStructCreature(colors, creatures, places, cardType) {
    let data_struct = {
        name: '_',
        creatureType: creatures,
        place: places,
        color: colors,
        URL: null,
        description: '_',
        cardType: cardType,
        attack: 0,
        defense: 0,
        manaCost: 0,
        enter_effect: null,
        rarity: getRandomElement(["Common", "Common", "Common", "Common", "Uncommon", "Uncommon", "Uncommon", "Rare", "Rare", "Legendary"])
    };

    let newStruct = { ...data_struct };
    newStruct.name = getRandomElement(fantasyFirstNames);
    
    if (newStruct.rarity == "Common") {
        newStruct.attack = getRandomElement([0,1,2,3]);
        newStruct.defense = getRandomElement([1,2,3]);
        newStruct.manaCost = getRandomElement([1,2,3])
    } else if (newStruct.rarity == "Uncommon") {
        newStruct.attack = getRandomElement([2,3,4,5]);
        newStruct.defense = getRandomElement([2,3,4,5]);
        newStruct.manaCost = getRandomElement([2,3,4])
    } else if (newStruct.rarity == "Rare") {
        newStruct.attack = getRandomElement([4,5,6,7]);
        newStruct.defense = getRandomElement([4,5,6,7,8]);
        newStruct.manaCost = getRandomElement([4,5,6])
    }  else if (newStruct.rarity == "Legendary") {
        newStruct.attack = getRandomElement([7,8,9]);
        newStruct.defense = getRandomElement([7,8,9]);
        newStruct.manaCost = getRandomElement([6,7,8,9])
    }  

    if (colors == "Random") {
        newStruct.color = getRandomElement(colors1);
    } else if (colors == "None") {
        newStruct.color = "";
    } else { newStruct.color = colors;} 
    
    if (creatures == "Random") {
        newStruct.creatureType = getRandomElement(creatures1);
    } else { newStruct.creature = creatures; } 
    if (places == "Random") {
        newStruct.place = getRandomElement(places1);
    } else { newStruct.place = places;}

    return newStruct;
}

async function createDataStructSpell(colors, place, cardType, spellType) {
    let data_struct = {
        name: '_',
        places: place,
        color: colors,
        URL: null,
        description: '_',
        cardType: cardType,
        attack: 0,
        defense: 0,
        manaCost: 0,
        ability: "_",
        utility: "_",
        spellType: spellType,
        rarity: getRandomElement(["Common", "Common", "Common", "Common", "Uncommon", "Uncommon", "Uncommon", "Rare", "Rare", "Legendary"])
    };

    let newStruct = { ...data_struct };
    newStruct.name = getRandomElement(spellNames);

    if (place == "Random") {
        newStruct.places = getRandomElement(places1);
    } else { newStruct.places = place;}
    
    if (colors == "Random") {
        newStruct.color = getRandomElement(colors1);
    } else if (colors == "None") {
        newStruct.color = "";
    } else { newStruct.color = colors;}

    if (spellType == "Random") {
        newStruct.spellType = getRandomElement(["Damage", "Buff", "De-Buff"]);
    } else { newStruct.spellType = spellType; } 
    
    if (newStruct.rarity == "Common") {
        newStruct.attack = getRandomElement([0,1]);
        newStruct.defense = getRandomElement([1,2]);
        newStruct.manaCost = getRandomElement([1,2])
    } else if (newStruct.rarity == "Uncommon") {
        newStruct.attack = getRandomElement([2,3,]);
        newStruct.defense = getRandomElement([2,3]);
        newStruct.manaCost = getRandomElement([2,3])
    } else if (newStruct.rarity == "Rare") {
        newStruct.attack = getRandomElement([4,]);
        newStruct.defense = getRandomElement([4,]);
        newStruct.manaCost = getRandomElement([4,])
    }  else if (newStruct.rarity == "Legendary") {
        newStruct.attack = getRandomElement([5]);
        newStruct.defense = getRandomElement([5]);
        newStruct.manaCost = getRandomElement([4])
    }  
    return newStruct;
}

// Helper function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

    const places1 = [
        "African", "Ancient Babylon", "Ancient Ruins", "Ancient Egypt", "Antarctica", "Arabian", "Arctic Tundra", 
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
        "Angel", "Banshee", "Basilisk", "Bigfoot", "Centaur", "Cerberus", "Chimera", "Chupacabra", "Cthulhu", "Cyclops",
        "Demon", "Doppelganger", "Dragon", "Dwarf", "Elf", "Fairy", "Frost Giant", "Genie", "Ghost", "Gnome",
        "Goblin", "Gremlin", "Griffin", "Harpie", "Hippogriff", "Hydra", "Imp", "Jinn", "Kelpie", "Kraken",
        "Leprechaun", "Lich", "Manticore", "Mermaid", "Minotaur", "Mothman", "Naga", "Nymph", "Ogre", "Oni",
        "Pegasus", "Peryton", "Phoenix", "Roc", "Sasquatch", "Satyr", "Sea Serpent", "Selkie", "Siren", "Skeleton",
        "Specter", "Sphinx", "Sprite", "Tanuki", "Thunderbird", "Titan", "Troll", "Unicorn", "Valkyrie", "Vampire",
        "Vampire Bat", "Vodyanoy", "Wendigo", "Werewolf", "Wight", "Will-o'-the-Wisp", "Witch", "Wizard", "Wraith",
        "Wyrm", "Wyvern", "Xorn", "Yuki-onna", "Yeti", "Zaratan", "Ziz", "Zombie"
        ];

    const colors1 = [
        "Blue", "Brown", "Gold",
        "Green", "Magenta", "Maroon",
        "Navy", "Orange", "Pink", "Purple", "Red",
        "Silver", "Turquoise", "Violet", "Yellow"
    ];

    const fantasyFirstNames = [
        "Aelar", "Lyra", "Tharin", "Elowen", "Draven", "Sylas", "Isolde", "Finnian", "Seraphina", "Rowan",
        "Alaric", "Aurora", "Caelum", "Elysia", "Galadriel", "Tristan", "Lysander", "Aria", "Kael", "Elara",
        "Thalia", "Orion", "Aerin", "Amara", "Roran", "Eowyn", "Arion", "Isolde", "Lirael", "Darian",
        "Eira", "Branwen", "Icarus", "Eirwyn", "Morrigan", "Eirlys", "Finley", "Eirian", "Thorne",
        "Auriel", "Riven", "Selene", "Thaddeus", "Keira", "Elric", "Valerian", "Drystan", "Oberon", "Iseult",
        "Lyric", "Kaelan", "Arianwen", "Niamh", "Riordan", "Eirwen", "Aurelia", "Caius", "Eirika", "Ronan",
        "Ferelith", "Taliesin", "Eira", "Ailith", "Eirian", "Eirlys", "Elidor", "Iseabal", "Ivailo", "Ivaylo",
        "Kasim", "Iridian", "Lachtna", "Luighseach", "Meabh", "Niall", "Odran", "Sibeal", "Sibéal", "Siobhán",
        "Tuathal", "Uilliam", "Orlaith", "Rioghnach", "Roibhilín", "Róisín", "Sadbh", "Saoirse", "Seaghán",
        "Seán", "Senán", "Síofra", "Síthmaith", "Sorcha", "Tadgh", "Tadhg", "Tadhgan", "Teagan", "Tómas",
        "Tomás", "Uinseann", "Yseult", "Adeon", "Aderyn", "Aeron", "Aidan", "Alair", "Alasdair", "Alastair",
        "Alroy", "Angus", "Aoibheann", "Beathan", "Braeden", "Brann", "Brannon", "Brennan", "Brodie", "Caelan",
        "Caelum", "Cahan", "Callum", "Ciaran", "Cormac", "Cuan", "Cuán", "Curran", "Darcy", "Diarmaid",
        "Dillon", "Donal", "Donnacha", "Dougal", "Dughall", "Dylan", "Eamonn", "Eion", "Fergus", "Finian",
        "Fionn", "Frang", "Galen", "Gareth", "Gavin", "Gillean", "Greagoir", "Gregor", "Guaire", "Guillem",
        "Hamish", "Iagan", "Iain", "Ianto", "Ian", "Irvine", "Kade", "Kane", "Kellan", "Kieran", "Lachlan",
        "Laird", "Lathan", "Liam", "Logan", "Lorcan", "Macsen", "Mael", "Malcolm", "Math", "Mathew",
        "Murdock", "Myles", "Niall", "Nolan", "Odhran", "Oisin", "Oswyn", "Owen", "Padraig", "Padruig",
        "Pàl", "Pádraig", "Peadar", "Quinlan", "Raghnall", "Ronan", "Rory", "Rowan", "Ruairi", "Ryder",
        "Seamus", "Sean", "Sebastian", "Séimí", "Séimí Óg", "Séimíne", "Sìm", "Sloan", "Tadhg", "Tomas",
        "Torin", "Turlough", "Uilliam", "Vaughan", "Warren", "Wynne", "Zander", "Alessia", "Anya", "Arabel",
        "Arabella", "Aria", "Arianell", "Arianwen", "Ariella", "Arielle", "Aurora", "Brigid", "Bronwen",
        "Caitrìona", "Catriona", "Cordelia", "Daisy", "Eilidh", "Elara", "Elena", "Elspeth", "Enid", "Felicity",
        "Ffion", "Fiona"];

    const spellNames = [
        "Fireball", "Lightning Bolt", "Healing Touch", "Summon Familiar", "Ice Shard",
        "Teleport", "Invisibility", "Explosion", "Earthquake", "Arcane Missile",
        "Frost Nova", "Chain Lightning", "Holy Smite", "Shadow Cloak", "Meteor Shower",
        "Poison Cloud", "Mind Control", "Divine Shield", "Time Warp", "Gravity Surge"
    ];

module.exports.getImageUrlFromLeonardo = getImageUrlFromLeonardo;
module.exports.createAICard = createAICard;
module.exports.createDataStructCreature = createDataStructCreature;
module.exports.createDataStructSpell = createDataStructSpell;


