// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const session = require('express-session');     // Session control to save variables once a user logs in
// const bcrypt = require('bcrypt');               // Encryption
const router = new require('express').Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();                          // Routing 
const port = 3000;

const db = require('./database/db-connector');
const dbFunc = require('./database/db-functions')
const gameGen = require('./game/game-gen');         
const hf = require('./database/helper-funcs');    // Could be moved
const card = require('./database/card');
const configFile = require('./database/config');

// Import Game Classes
const { Game, User, Card, CreatureCard, SpellCard } = require('./game/game-play1'); // Import the User class if not already imported

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.engine('handlebars', exphbs.engine(
  {
    extname: "handlebars",
    defaultLayout: 'main',
    layoutsDir: 'views',
    partialDir: 'views/partials'
  }
));

app.set('view engine', 'handlebars');

// Define the view directory path for Handlebars files
app.set('views', path.join(__dirname, 'views'));

// Serve static file from public directory
app.use(express.static(path.join(__dirname, 'public'),
  {
    'extensions': ['js'],
    'index': false,
    'Content-Type': 'text/javascript'
  }));

app.use(express.static(path.join(__dirname, 'images')))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/database', express.static(path.join(__dirname, 'database')));
app.use('/game', express.static(path.join(__dirname, 'game')));

/*
ROUTES
*/
// To DO
// Generate Game Instances with Name
// Generate Collection Instances of Games per User
// Generate Decks of collection 

app.get('/', (req, res) => {                       
  const user = req.session.user
  if (user) {
    // If user then show homepage
    res.render('welcomePagePortal', {
      showLogoutButton: true,
    })
  } else {
    // If user loged out, then show login button
    res.render('welcomePagePortal', {
      showLogoutButton: false,
    })
  }
});

app.get('/userProfile', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const userProf = await dbFunc.getUserProfile(user.userId);
    const valList = await dbFunc.getAllGeneratedGamesByUser(user.userId);
    const genLen = valList ? valList.length : 0;

    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    const collectLen = collect ? collect.length : 0;

    const deck = await dbFunc.getAllDecksByUser(user.userId);
    const deckLen = deck ? deck.length : 0;

    res.render('userProfile', {
      username: user.username, gameCount: userProf[0].gameCount,
      wins: userProf[0].wins, losses: userProf[0].losses,
      showLogoutButton: true, vals: valList, gameLen: genLen, collectLength: collectLen,
      deckLen: deckLen
    })
  } else {
    res.redirect('/')
  }
});

app.get('/userDeck/:username', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('currentDeck', { showLogoutButton: true })
  } else {
    res.redirect('/')
  }
});

app.get('/gamePlayPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('gamePlayPage');
  } else {
    res.redirect('/');
  }
});


app.get('/cardGenBulkPage', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const val_list = await dbFunc.getAllGeneratedGames();
    res.render('cardGenBulkPage', { vals: val_list })
  } else {
    res.redirect('/');
  }
});

app.get('/gameGenPage', async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      res.render('gameGenPage')
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
});

// NEEDS WORK
app.get('/generatedGameView', async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      gameStats = dbFunc.getGeneratedGameStats()
      res.render('generatedGameView')
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
});

// Needs collection and game info
app.get('/buildDeck', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('buildDeck', { userId: 1001 })
  } else {
    res.redirect('/', { showLogoutButton: false })
  }
});

// NEEDS WORK and direction
app.get('/browseGames', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('browseGames')
  } else {
    res.redirect('/');
  }
});

app.get('/newUser', (req, res) => {
  // Show user logged in user profile
    res.render('newUser', { showLogoutButton: true })
});

app.get('/resetPW', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('resetPW', { showLogoutButton: true })
  } else {
    res.render('resetPW', { showLogoutButton: false })
  }
});

// Will need minor work
app.get('/cardGenPage', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const val_list = await dbFunc.getAllGeneratedGames();
    res.render('cardGenPage', { vals: val_list })
  } else {
    res.redirect('/');
  }
});

// Add stuff
app.get('/help', async (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('help')
  } else {
    res.redirect('/');
  }
});

// Add database logic
app.get('/trading', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('trading', { showLogoutButton: true })
  } else {
    res.redirect('/');
  }
});

// Needs Work, collection db issue
app.get('/collect', async (req, res) => {
  const user = req.session.user;
  if (user) { 
    const thisCollectId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, req.body.gameId);
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    const listCards = await dbFunc.grabListOfCardsFromCollection(thisCollectId);
    console.log(collect);

    res.render('collect', { 
      thisCollectId: collect,
      collect: collect,
      listCards: listCards
    })
  } else {
    res.redirect('/');
  }
});

// Needs Work!
app.get('/openPack', async (req, res) => {
  const user = req.session.user;
  if (user) { 
    //const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    // console.log(collect);
    //const something = await dbFunc.getOneGeneratedGame(collect.gameId)   // Need to build collections
    res.render('openPack', { 
    })
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  })
})

// FIXME change to '/game/:gameId'
app.get('/game/', async (req, res) => {
  // FIXME replace
  // const user = req.session.user;
  // const deck = req.session.deck;
  // const game = req.session.game;
  const user = { userId: 1001, username: 'admin' }
  const deck = { deckId: 7001 }
  const game = { ruleSet: 'ruleSet1', gameId: 1001 }
  // TODO game handlebars file
  // TODO game logic
  if (user) {
    // const deckList = await game1.getDeck(user.userId, deck.deckId);
    // console.log(deckList);
    const userInstance = new User(user.userId, user.username);
    const gameInstance = new Game(userInstance, deck.deckId, game.ruleSet, game.gameId);

    await gameInstance.initialize();

    res.render('gamePlay1', {
      gameId: game.gameId,
      ruleSet: game.ruleSet,
      hand: game.hand,
      remainingDeckCards: gameInstance.deck.length
    });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// POST ROUTES 
app.post('/newUserPost', async (req, res) => {
  // New User
  try {
    const user_id = await dbFunc.insertNewUser(req.body.inputUserName, req.body.inputNewPassword, req.body.inputEmail);
    const userProfile = await dbFunc.getUserProfile(user_id);
    if (user_id) {          // save relevant user information in the session
      req.session.user = {
        userId: user_id,
        username: req.body.inputUserName
      };
    }
    res.redirect('/userProfile');

  } catch (err) {
    console.log(err);
    if (err.code === 'ER_DUP_ENTRY') {
      // determine duplicate error username or email
      let errCodeObject = err.sqlMessage.split("'").slice(-2)[0];
      if (errCodeObject == "username") {
        res.render("newUser", {
          usnError: 'Username already in use. Please try another.'
        });
      } else if (errCodeObject === "email") {
        res.render("newUser", {
          emailError: 'Email already in use. Please try another.'
        });
      }
    } else {
      // Handle other errors if needed
      res.send(`Something went wrong : (${err})`);
    }
  }
});

// Post route for login -> once logged in, user should be directed to /userProfile/:username
app.post('/login', async (req, res) => {
  try {
    const username = req.body.usernameWpp;
    const enteredPassword = req.body.passwordWpp;
    const user = await dbFunc.authenticateUser(username, enteredPassword);
    if (user) {
      req.session.user = { userId: user.userId, username: user.username };
      res.redirect('userProfile');
    } else {
      // Authentication failed
      res.render('welcomePagePortal', {
        error: 'Invalid credentials. Please try again.'
      });
    }
  } catch (err) {
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/cardViewEditPage', async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
      const generatedCards = [];
      const collectId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, req.body.whichgame)
      req.session.collectId = collectId;
      req.session.gameId = req.body.whichgame;

      for (let i = 0; i < 3; i++) {
        let values = [];
        let newCreature = await card.createDataStructCreature(req.body.color, req.body.creatureType, req.body.theme, req.body.cardType);
        const aiCard = await card.createAICard(newCreature.creature, newCreature.place, newCreature.color, newCreature.rarity, 1);
        
        newCreature.manaCost = req.body.manaCost;
        newCreature.attack = req.body.creatureAttack;
        newCreature.defense = req.body.creatureDefense
        newCreature.rarity = req.body.rarity
        newCreature.name = req.body.cardName

        while (values.length === 0) {
          values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
          await delay(500); // Add a delay to avoid excessive requests
        }
        newCreature.URL = values
        let stringed = JSON.stringify(newCreature);
        newCreature.stringed = stringed;
        generatedCards.push(newCreature);
      }   
      console.log(generatedCards);

      res.render('cardViewEditPage', {
        card: generatedCards
      });
    } else {
      res.render('cardGenPage', { error: "Sorry! You cannot create a card without having an account" })
    }
  } catch (err) {
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/cardViewPrintedBulkPage', async (req, res) => {
  const user = req.session.user;
  async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  try {
    const num = parseInt(req.body.number); // Assuming req.body.number contains the number of cards to generate
    const generatedCards = [];

    for (let i = 0; i < num; i++) {
      let newCreature = await card.createDataStructCreature(req.body.colors, req.body.creatures, req.body.places, req.body.cardType);
      const aiCard = await card.createAICard(newCreature.creature, newCreature.place, newCreature.color, newCreature.rarity, 1);

      let values = [];
      while (values.length === 0 || values === null){
        values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
        await delay(500); // Add a delay to avoid excessive requests
      }
      newCreature.URL = values
      generatedCards.push(newCreature);
    }   
    console.log(generatedCards);
    generatedCards.forEach( async (card) => {
      try {
        const cardId = await dbFunc.insertCard(card.name, card.cardType, user.userId, card.rarity, card.manaCost);
        await dbFunc.insertCreatureCard(cardId, card.attack, card.defense, card.creatureType);
        await dbFunc.insertCardUrl(cardId, card.URL);
      } catch (err) {
        console.error(err);
      }
    })
    
    res.render('cardViewPrintedBulkPage', { cards: generatedCards });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.post('/cardViewPrintedPage', async (req, res) => {
  const user = req.session.user;
  try {
    const stringCard = JSON.parse(req.body.cardstring);
    const cardId = await dbFunc.insertCard(stringCard.name, stringCard.cardType, user.userId, stringCard.rarity, stringCard.manaCost); 

    if (req.body.cardType === "Creature") {
      await dbFunc.insertCreatureCard(cardId, stringCard.creatureAttack, stringCard.creatureDefense, stringCard.creatureType );     // Hard coded
    } else { // Needs Work
      await dbFunc.insertSpellCard(cardId, req.body.spellType, req.body.spellAbility, req.body.spellAttack, req.body.spellDefense, req.body.utility); // Needs work
    }

    await dbFunc.updateListOfCollection(req.session.collectionId, cardId);                // New Function
    await dbFunc.insertCardUrl(cardId, stringCard.URL[0].url);
    const data = await dbFunc.getCardInfo(cardId);
    console.log(data);
    res.render('cardViewPrintedPage', {
      card: stringCard,
      data: data
    });
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});

// ??
app.post('/generatedGameView', async (req, res) => {
  if (req.session.user) {
    try {
      const user = req.session.user;
      const genGameId = await dbFunc.insertNewGeneratedGame(user.userId, req.body.ruleSet, '[]', req.body.name);
      req.session.gameId = genGameId;
      const gameStats = await dbFunc.getGeneratedGameStats(genGameId);
      console.log(genGameId, gameStats);
      res.render('generatedGameView', {
        game: gameStats,
        genGameId: genGameId
      });
    } catch (err) {
      console.error(err);
      res.send(`Something went wrong: ${err}`);
    }
  } else {
    res.redirect('/');
  }
});

// Current Work
app.post('/collect', async (req, res) => {
  const user = req.session.user;
  if (user) { 
    const thisCollectId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, req.body.gameId);
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    const listCards = await dbFunc.grabListOfCardsFromCollection(thisCollectId);
    console.log(collect, listCards);

    res.render('collect', { 
      thisCollectId: collect,
      collect: collect,
      listCards: listCards
    })
  } else {
    res.redirect('/');
  }
});


///////////////////////////////////////////////
// GAME PLAY
///////////////////////////////////////////////
// Server initializion of game
const gameInstance = {};

// Game get - Initialize the game
// FIXME change to '/game/:gameId'
app.get('/game/', async (req, res) => {
  // FIXME replace
  // const user = req.session.user;
  // const deck = req.session.deck;
  // const game = req.session.game;
  const user = { userId: 1001, username: 'admin' }
  const deck = { deckId: 7001 }
  const game = { ruleSet: 'ruleSet1', gameId: 1001 }

  // If user we can intialize a game
  if (user) {
    const userInstance = new User(user.userId, user.username);
    gameInstance[game.gameId] = new Game(userInstance, deck.deckId, game.ruleSet, game.gameId);

    await gameInstance[game.gameId].initialize();
    // console.log(gameInstance[game.gameId].hand)
    res.render('gamePlay1', {
      gameId: game.gameId,
      ruleSet: game.ruleSet,
      hand: gameInstance[game.gameId].hand,
      remainingDeckCards: gameInstance[game.gameId].deck.length,
      playerMana: gameInstance[game.gameId].user.mana,
      opponentMana: gameInstance[game.gameId].opponent.mana
    });
  }
});

// Play Card
app.post('/playCard', async (req, res) => {
  const cardId = req.body.cardId;
  const game = { ruleSet: 'ruleSet1', gameId: 1001 } //FIXME

  if (gameInstance[game.gameId]) {
    try {
      const result = await gameInstance[game.gameId].playCard(parseInt(cardId));

      if (result && result.error) {
        if (result.error === 'Insufficient mana to play this card.') {
          res.json({ message: 'Insufficient mana to play this card.' });
        } else {
          res.status(400).json({ error: result.error });
        }
      } else {

        // Include playerMana in the response
        const playerMana = gameInstance[game.gameId].user.mana;
        const playerStage = gameInstance[game.gameId].playerStage; // Get the updated playerStage

        console.log(playerStage);

        res.json({ message: 'card played successfully', cardId, playerMana, playerStage });
      }

    } catch (error) {
      // Check if the error message is related to insufficient mana
      if (error.message === "Insufficient mana to play this card.") {
        // Send a 422 status code for unprocessable entity due to insufficient mana
        res.status(422).json({ error: error.message });
      } else {
        // For other errors, send a 400 status code
        res.status(400).json({ error: error.message });
      }
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
});

// Get card details
app.get('/getCardDetails', async (req, res) => {
  const cardId = req.query.cardId;

  try {
    // Retrieve card details from the database based on the cardId
    const cardData = await dbFunc.getCardByCardId(cardId);

    // Check if cardData exists
    if (cardData.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Determine the type of card and create an instance accordingly
    let card;
    if (cardData[0].cardType.toLowerCase() === 'creature') {
      card = new CreatureCard( //id, name, type, description, mana, rarity, imagePath, attack, defense
        cardId,                 // id
        cardData[0].cardName,   // name
        cardData[0].cardType,   // type
        "something creature",   // description
        cardData[0].manaCost,
        cardData[0].rarity,
        cardData[0].imagePath,
        cardData[0].attack,
        cardData[0].defense);
    } else if (cardData[0].cardType.toLowerCase() === 'spell') {
      card = new SpellCard( //id, name, type, description, mana, rarity, imagePath, attack, defense, ability, utility
        cardId,                     // id
        cardData[0].cardName,       // name
        cardData[0].cardType,       // type
        cardData[0].spellType,      // description
        cardData[0].manaCost,
        cardData[0].rarity,
        cardData[0].imagePath,
        cardData[0].spellAttack,
        cardData[0].spellDefense,
        cardData[0].spellAbility,
        cardData[0].utility)
    } else {
      return res.status(400).json({ error: 'Unknown card type' });
    }

    // Send the card details as JSON response
    res.json(card);
  } catch (error) {
    console.error('Error fetching card details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// End turn
app.post('/endTurn', async (req, res) => {
  const game = { ruleSet: 'ruleSet1', gameId: 1001 } //FIXME

  if (gameInstance[game.gameId]) {
    try {
      let gameInstance = gameInstance[game.gameId];

      const result = await gameInstance.playComputerTurn();
      console.log(result);
      res.status(200).json({ message: 'Computer opponent\'s turn completed' });
    } catch {
      console.log("catch something")
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
})