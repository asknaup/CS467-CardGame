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
const { consoleLog } = require('@ngrok/ngrok');

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

app.get('/cards', async (req, res) => {
  try {
    // Retrieve the user ID from the request query parameters
    // const userId = req.query.userId;
    // Needs collection and game info
    // const user = req.session.user;
    const user = { userId: 1001, username: 'admin' }; //FIXME
    // Call the database function to get card data based on userId
    const cardData = await dbFunc.getCardIdByUser(user.userId);
    const cardsDict = hf.convertListToDict(cardData);
    // Send card data as reponse
    res.json(cardsDict);
  } catch (error) {
    // Handle errors that occur during data retrival
    console.error('Error fetching card data:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
});

app.get('/userProfile', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const userProf = await dbFunc.getUserProfile(user.userId);
    const valList = await dbFunc.getAllGeneratedGames();
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

// Route handler for rendering the game play page
app.get('/gamePlayPage', async (req, res) => {
  // const user = { userId: 1001, username: 'admin' }; 
  const user = req.session.user;
  if (user) {
    const userDecks = await dbFunc.gatherUserDecks(user.userId);
    res.render('gamePlayPage', { decks: userDecks });
  } else {
    res.redirect('/');
  }
});

// Route handler for handling form submission and generating the game
app.post('/game', async (req, res) => {
  const user = req.session.user;
  // Handle form submission, generate game, and redirect
  if(user) {
    const deckId = req.body.userDeckSelect;
    console.log(deckId);
    req.session.deck = { deckId: deckId }; // Save the deck ID in the session
    const gameId = await dbFunc.insertNewGameIntoGames(user.userId, deckId); // Generate a new game ID, or fetch it from where it's stored
    req.session.game = { gameId: gameId, ruleSet: req.body.ruleSet }; // Save the game ID and rule set in the session
    res.redirect(`/game/${gameId}`); // Redirect to the generated game
  }
});

app.get('/cardGenBulkPage', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const val_list = await dbFunc.getAllGeneratedGames();
    res.render('cardGenBulkPage', { vals: val_list });
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


app.get('/buildDeck', async (req, res) => {
  // Needs collection and game info
  const user = req.session.user;
  // const user = { userId: 1001, username: 'admin' };
  // FIXME: Switch back to const user = req.session.user; once buildDeck complete
  try {
    if (user) {
      const c = req.query.collectId;
      let listCards;
      const collect = await dbFunc.getAllCollectionsByUser(user.userId);

      if (c) {
        listCards = await dbFunc.grabListOfCardsFromCollection(req.query.collectId);
      } else {
        listCards = await dbFunc.grabListOfCardsFromCollection(collect[0].collectionId);
      }

      const userDecks = await dbFunc.gatherUserDecks(user.userId);
      console.log(userDecks)
      res.render('buildDeck', {
        showLogoutButton: true,
        decks: userDecks,
        userId: user.userId,
        listCards: listCards,
        collect: collect
      })
    } else {
      res.render('builDeck', { showLogoutButton: false })
    }
  } catch (err) {
    console.log(err);
  }
});

// Add to deck, delete, deck stats
app.get('/currentDeck', async (req, res) => {
  // Show user logged in user profile
  // FIXME
  // const user = { userId: 1001, username: 'admin' };
  const user = req.session.user;
  try {
    const receivedData = req.body;
    console.log(receivedData);
    dbFunc.insertNewDeck(user.userId, receivedData.deckName, JSON.stringify({ 'cardList': receivedData.deckList }));
  } catch (error) {
    console.error("Error - Deck Not Saved", error);
  }
});

// Update Deck route
app.post('/updateDeck', async (req, res) => {
  const { deckId, cards } = req.body;

  try {
    // Fetch the existing deck from the database
    const existingDeck = await Deck.findById(deckId);

    if (!existingDeck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Update the cards in the existing deck
    existingDeck.cards = cards;

    // Save the updated deck
    await existingDeck.save();

    return res.status(200).json({ message: 'Deck updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DO NOT DELETE - USED FOR DECK
app.post('/getCardInfo', async (req, res) => {
  try {
    const cardId = req.body.cardId;

    // Use the cardId to fetch card information from the database using getCardByCardId
    const cardInfo = await dbFunc.getCardByCardId(parseInt(cardId));

    // Check if cardInfo is null or undefined, and handle accordingly
    if (!cardInfo) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(cardInfo);
  } catch (error) {
    console.error('Error fetching card info:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/decksubmitted', async (req, res) => {
  const user = req.session.user;

  try {
    const receivedData = req.body;
    console.log(receivedData);
    dbFunc.insertNewDeck(user.userId, receivedData.deckName, JSON.stringify({ 'cardList': receivedData.deckList }));
  } catch (error) {
    console.error("Error - Deck Not Saved", error);
  }

});

// Deck pull from db and editing endpoints
// Endpoint to get deck names for the current user
// TODO: Why does deleting this break the dropdown? 
app.get('/deckNames', async (req, res) => {

});

app.post('/deckCards', async (req, res) => {
  const selectedDeck = req.body.deckId;
  // Store the selected deckId in the session
  req.session.deck = { deckId: parseInt(selectedDeck) };
  console.log("selectedDeck post", selectedDeck);
  console.log("session after post", req.session);
  res.json({ status: 'OK' }); // Send a JSON response
});

app.get('/getCardsForDeck', async (req, res) => {
  try {
    const selectedDeck = req.query.deckId;
    if (selectedDeck) {
      // Fetch cardIds for the selected deck and current user from the database using a Promise
      const row = await dbFunc.getUserDeck(parseInt(selectedDeck));
      if (row && row.length > 0) {
        var deckObject = JSON.parse(row[0].cardId);
        res.json(deckObject.cardList);
      } else {
        res.status(404).send("Deck not found");
        return;
      }
    } else {
      res.status(400).send("Missing deckId parameter");
      return;
    }
  } catch (error) {
    console.error('Error handling getCardsForDeck:', error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

// Endpoint to get deckId
app.get('/getDeckId', (req, res) => {
  // For simplicity, let's just return the first deck's id
  const deck = req.session.deck;

  if (deck && deck.deckId) {
    res.json({ deckId: deck.deckId });
  } else {
    res.status(404).json({ error: 'No deck found in the session' });
    return;
  }
});

// TODO: NEEDS WORK and direction
app.get('/browseGames', (req, res) => {
  const user = req.session.user;
  // const user = { userId: 1001, username: 'admin' };
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
app.get('/getAdminCardsForTrading', async (req, res) => {
  const user = req.session.user;
  const userCollectId = req.query.collectId;
  //let listCards;
  let gameIdArr;
  let gameId;
  let adminListArr;
  let adminList;

  if (user) {
    //listCards = await dbFunc.grabListOfCardsFromCollection(userCollectId);
    gameIdArr = await dbFunc.grabGameIdFromCollection(userCollectId);
    gameId = gameIdArr[0].gameId;
    adminListArr = await dbFunc.grabAdminListCards(gameId);
    adminList = JSON.parse(adminListArr[0].listCards)["cardList"];
    //console.log(adminList);
    res.json(adminList);
  }
});


// Add database logic
app.get('/trading', async (req, res) => {
  const user = req.session.user;
  const c = req.query.collectId;
  let listCards;
  let gameId;
  let adminList; 

  if (user) {
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
      //if (c) {
      //listCards = await dbFunc.grabListOfCardsFromCollection(req.query.collectId);
      //gameId = await dbFunc.grabGameIdFromCollection(req.query.collectId)
      //adminList = await dbFunc.grabAdminListCards(gameId); 
      //} else {
      listCards = await dbFunc.grabListOfCardsFromCollection(collect[0].collectionId);
      gameId = await dbFunc.grabGameIdFromCollection(collect[0].collectionId)
      adminList = await dbFunc.grabAdminListCards(gameId); 
      //}
    
    res.render('trading', {
      collect: collect //,
      //listCards: listCards,
      //adminList: adminList
     })
  } else {
    res.redirect('/');
  }
});

// Add database logic
app.post('/trading', async (req, res) => {
  const user = req.session.user;
  const c = req.query.collectId;
  let listCards;
  let gameId;
  let adminList;

  if (user) {
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    if (c) {
      listCards = await dbFunc.grabListOfCardsFromCollection(req.query.collectId);
      gameId = await dbFunc.grabGameIdFromCollection(req.query.collectId)
      adminList = await dbFunc.grabAdminListCards(gameId);
    } else {
      listCards = await dbFunc.grabListOfCardsFromCollection(collect[0].collectionId);
      gameId = await dbFunc.grabGameIdFromCollection(req.query.collectId)
      adminList = await dbFunc.grabAdminListCards(gameId);
    }

    res.render('trading', {
      collect: collect,
      listCards: listCards,
      adminList: adminList
    })
  } else {
    res.redirect('/');
  }
});

app.get('/getCollection', async (req, res) => {
  const user = req.session.user;
  if (user) {
    let collection = await dbFunc.getAllCollectionsByUser(user.userId);
    res.json(collection);
  } else {
    res.redirect('/');
  }
});


// Needs Work, collection db issue
app.get('/collect', async (req, res) => {
  const user = req.session.user;
  const c = req.query.collectId;
  //let listCards;

  if (user) {
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    /*
    if (c) {
      listCards = await dbFunc.grabListOfCardsFromCollection(req.query.collectId);
    } else {
      listCards = await dbFunc.grabListOfCardsFromCollection(collect[0].collectionId);
    }
    
    console.log(listCards);
    */
    res.render('collect', {
      collect: collect //,
      //listCards: listCards,
    })
  } else {
    res.redirect('/');
  }
});

// Get all Admin Collections
app.get('/collectAdmin', async (req, res) => {
  const user = req.session.user;
  if (user) {
    let genGames = await dbFunc.getAllGeneratedGames()

    res.render('collect', {
      collect: collect
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

app.get('/help', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('help')
  } else {
    res.redirect('/');
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
    const oneVar = await dbFunc.getAllGeneratedGames()
    const gameName = await dbFunc.grabGameName(oneVar[0].gameId);
    const userName = await dbFunc.grabUsername(user_id);
    const nameTime = `${userName[0].username}'s collection for ${gameName[0].imageLocation}`;
    const collect = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user_id, oneVar[0].gameId, nameTime);

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
      return res.send(`Something went wrong : (${err})`);
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
    return res.send(`Something went wrong: ${err}`);
  }
});

app.post('/cardViewEditPage', async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
      const generatedCards = [];
      req.session.gameId = req.body.whichgame;

      if (req.body.cardType == "Creature") {
        // Generate for Creature

        for (let i = 0; i < 1; i++) {
          let values = [];
          let newCreature = await card.createDataStructCreature(req.body.color, req.body.creatureType, req.body.theme, req.body.cardType);
          newCreature.manaCost = req.body.manaCost;
          newCreature.attack = req.body.creatureAttack;
          newCreature.defense = req.body.creatureDefense
          newCreature.rarity = req.body.rarity
          newCreature.name = req.body.cardName

          const aiCard = await card.createAICard(newCreature.creature, newCreature.place, newCreature.color, newCreature.rarity, 1);
          while (!values || values.length === 0) {
            values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
            await delay(700); // Add a delay to avoid excessive requests
          }
          console.log(values);
          newCreature.URL = values[0].url;
          newCreature.whichgame = req.body.whichgame;
          let stringed = JSON.stringify(newCreature);
          newCreature.stringed = stringed;
          generatedCards.push(newCreature);
        }

      } else if (req.body.cardType == "Spell") {
        for (let i = 0; i < 3; i++) {
          let values = [];
          let newSpell = await card.createDataStructSpell(req.body.color, req.body.theme, req.body.cardType, req.body.spellType);
          newSpell.manaCost = req.body.manaCost;
          newSpell.attack = req.body.spellAttack;
          newSpell.defense = req.body.spellDefense
          newSpell.rarity = req.body.rarity
          newSpell.name = req.body.cardName

          const aiCard = await card.createAICard("abstract spell", newSpell.places, newSpell.color, newSpell.rarity, 1);

          while (!values || values.length === 0) {
            values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
            await delay(700); // Add a delay to avoid excessive requests
          }

          newSpell.URL = values[0].url;
          newSpell.whichgame = req.body.whichgame;
          let stringed = JSON.stringify(newSpell);
          newSpell.stringed = stringed;
          generatedCards.push(newSpell);
        }
      }
      res.render('cardViewEditPage', {
        card: generatedCards,
      });
    } else {
      res.render('cardGenPage', { error: "Sorry! You cannot create a card without having an account" })
    }
  } catch (err) {
    return res.send(`Something went wrong: ${err}`);
  }
});

app.post('/cardViewPrintedPagePost', async (req, res) => {
  const user = req.session.user;
  let cardIdList = [];
  let generatedCards = [];

  try {
    const stringCard = req.body;
    console.log(stringCard);
    const cardId = await dbFunc.insertCard(stringCard.name, stringCard.cardType, user.userId, stringCard.rarity, stringCard.manaCost);
    cardIdList.push(cardId);
    await dbFunc.insertCardUrl(cardId, stringCard.URL);


    if (stringCard.cardType == "Creature") {;
      let newCard = await dbFunc.insertCreatureCard(cardId, stringCard.attack, stringCard.defense, stringCard.creatureType);
      newCard.URL = stringCard.URL;
      generatedCards.push(newCard);
    } else {
      let newCard = await dbFunc.insertSpellCard(cardId, stringCard.spellType, stringCard.ability, stringCard.attack, stringCard.defense, stringCard.utility);
      newCard.URL = stringCard.URL;
      generatedCards.push(newCard);
    }

    // Update User Collection
    const gameName = await dbFunc.grabGameName(stringCard.whichgame);
    const userName = await dbFunc.grabUsername(user.userId);
    const nameTime = `${userName[0].username}'s collection for ${gameName[0].imageLocation}`;
    console.log(nameTime);

    try {
      const collId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, stringCard.whichgame, nameTime);
      let returnList = await dbFunc.grabListOfCardsFromCollection(collId);
      let x = JSON.parse(returnList[0].cardId);
      let y = x.cardList.concat(cardIdList);
      await dbFunc.updateListOfCollection(collId, JSON.stringify({ "cardList": y }));

      let adminList = await dbFunc.grabAdminListCards(stringCard.whichgame);
      let admin = JSON.parse(adminList[0].listCards);
      let newAdminList = admin.cardList.concat(cardIdList);
      await dbFunc.updateAdminListCards(JSON.stringify({ "cardList": newAdminList }), stringCard.whichgame);

    } catch (error) {
      console.error("Error updating collection:", error);
    }

    const data = await dbFunc.getCardInfo(cardId);
    console.log("This is data in the /cardViewPrintedPage route:", data);

    res.json({ cards: [stringCard] });

  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or JSON response
    return res.status(500).json({ error: `Something went wrong: ${err}` });
  }
});

app.get('/cardViewPrintedBulkPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('cardViewPrintedBulkPage')
  } else {
    res.redirect('/');
  }
});

app.get('/cardViewPrintedPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('cardViewPrintedPage')
  } else {
    res.redirect('/');
  }
});


app.post('/cardViewPrintedBulkPagePost', async (req, res) => {
  const user = req.session.user;
  async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  try {
    let num = parseInt(req.body.number); // Assuming req.body.number contains the number of cards to generate
    if (num > 20) { num = 20 };
    let generatedCards = [];
    let cardIdList = [];

    for (let i = 0; i < num; i++) {
      if (req.body.cardType == "Creature") {
        let newCreature = await card.createDataStructCreature(req.body.colors, req.body.creatures, req.body.theme, req.body.cardType);
        console.log(newCreature);
        const aiCard = await card.createAICard(newCreature.creature, newCreature.place, newCreature.color, newCreature.rarity, 1);
        let values = [];
        while (!values || values.length === 0) {
          values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
          await delay(500); // Add a delay to avoid excessive requests 
        }
        newCreature.URL = values[0].url
        generatedCards.push(newCreature);

      } else if (req.body.cardType == "Spell") {
        let newSpell = await card.createDataStructSpell(req.body.colors, req.body.theme, req.body.cardType, "Random"); // Hard coded
        const aiCard = await card.createAICard("abstract spell", newSpell.places, newSpell.color, newSpell.name, 1);
        let values = [];
        while (!values || values.length === 0) {
          values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
          await delay(500); // Add a delay to avoid excessive requests
        }
        newSpell.URL = values[0].url
        generatedCards.push(newSpell);
      }
    };
    generatedCards.forEach(async (card) => {
      const cardId = await dbFunc.insertCard(card.name, card.cardType, user.userId, card.rarity, card.manaCost);
      cardIdList.push(cardId);
      await dbFunc.insertCardUrl(cardId, card.URL);
      if (card.cardType == "Spell") {
        await dbFunc.insertSpellCard(cardId, card.spellType, card.ability, card.attack, card.defense, card.utility);
      } else if (card.cardType == "Creature") {
        await dbFunc.insertCreatureCard(cardId, card.attack, card.defense, card.creature);
      }
    });

    const gameName = await dbFunc.grabGameName(req.body.whichgame);
    console.log(gameName);
    const userName = await dbFunc.grabUsername(user.userId);
    const nameTime = `${userName[0].username}'s collection for ${gameName[0].imageLocation}`;
    console.log(nameTime);

    try {
      const collId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, req.body.whichgame, nameTime);
      let returnList = await dbFunc.grabListOfCardsFromCollection(collId);
      let x = JSON.parse(returnList[0].cardId);
      let y = x.cardList.concat(cardIdList);
      await dbFunc.updateListOfCollection(collId, JSON.stringify({ "cardList": y }));

      let adminList = await dbFunc.grabAdminListCards(req.body.whichgame);
      let admin = JSON.parse(adminList[0].listCards);
      let newAdminList = admin.cardList.concat(cardIdList);
      await dbFunc.updateAdminListCards(JSON.stringify({ "cardList": newAdminList }), req.body.whichgame);

    } catch (error) {
      console.error("Error updating collection:", error);
    }
    res.json({ cards: generatedCards });
    console.log("This is cards in /cardViewPrintedBulkPage:", generatedCards);

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.post('/generatedGameView', async (req, res) => {
  if (req.session.user) {
    try {
      const user = req.session.user;
      const genGameId = await dbFunc.insertNewGeneratedGame(user.userId, req.body.ruleSet, '{"cardList": []}', req.body.name);
      req.session.gameId = genGameId;
      const gameStats = await dbFunc.getGeneratedGameStats(genGameId);
      console.log(genGameId, gameStats);
      res.render('generatedGameView', {
        game: gameStats,
        genGameId: genGameId
      });
    } catch (err) {
      console.error(err);
      return res.send(`Something went wrong: ${err}`);
    }
  } else {
    res.redirect('/');
  }
});

// Current Work
app.post('/collect', async (req, res) => {
  const user = req.session.user;

  if (user) {
    const gameName = await dbFunc.grabGameName(req.body.gameId);
    const userName = await dbFunc.grabUsername(user.userId);
    const nameTime = `${userName[0].username}'s collection for ${gameName[0].imageLocation}`;

    const thisCollectId = await dbFunc.insertOrSelectCollectionByUserIdandGameId(user.userId, req.body.gameId, nameTime);
    const collect = await dbFunc.getAllCollectionsByUser(user.userId);
    const listCards = await dbFunc.grabListOfCardsFromCollection(thisCollectId);
    console.log(thisCollectId, collect, listCards);

    res.render('collect', {
      collect: collect,
      listCards: listCards,
      name: nameTime
    })
  } else {
    // Authentication failed, render 'welcomePagePortal' with an error message
    res.redirect('/');
  }
});


///////////////////////////////////////////////
// GAME PLAY
///////////////////////////////////////////////
// Server initializion of game
const gameInstance = {};

// Game get - Initialize the game
// app.get('/game/', async (req, res) => {  // Keep for testing
app.get('/game/:gameId', async (req, res) => {
  const user = req.session.user;
  const deck = req.session.deck;
  const game = req.session.game;
  // const user = { userId: 1005, username: 'admin' }
  // const deck = { deckId: 7000 }
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 }

  // If user we can intialize a game
  if (user) {
    const userInstance = new User(user.userId, user.username);
    gameInstance[game.gameId] = new Game(userInstance, deck.deckId, game.ruleSet, game.gameId);

    await gameInstance[game.gameId].initialize();

    res.render('gamePlay1', {
      gameId: game.gameId,
      ruleSet: game.ruleSet,
      remainingDeckCards: gameInstance[game.gameId].deck.length,
      playerMana: gameInstance[game.gameId].user.mana,
      opponentMana: gameInstance[game.gameId].opponent.mana
    });
  }
});

// Get Hand
app.get('/getHand', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  gameInst = gameInstance[game.gameId];

  if (gameInstance[game.gameId]) {
    const handData = gameInstance[game.gameId].hand.map(card => {
      // console.log(card);
      return {
        id: parseInt(card.id),
        name: card.name,
        imagePath: card.imagePath,
        type: card.type,
        mana: parseInt(card.mana),
        attack: parseInt(card.attack),
        defense: parseInt(card.defense),
        ability: card.ability,
        spellAttack: parseInt(card.spellAttack),
        spellDefense: parseInt(card.spellDefense)
      };
    });

    res.status(200).json({ hand: handData });

  }
})

// Get Player Stage
app.get('/getPlayerStage', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  let gameInst = gameInstance[game.gameId];

  if (gameInst) {
    const playerStage = gameInst.playerStage;
    res.status(200).json({ playerStage: playerStage });
  }
})

// Get Opponent Stage
app.get('/getOpponentStage', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  const gameInst = gameInstance[game.gameId];

  if (gameInst) {
    const opponentStage = gameInst.opponent.opponentStage;
    // console.log("/opponentStage", opponentStage)
    res.status(200).json({ opponentStage: opponentStage });
  }
})

// Play Card
app.post('/playCard', async (req, res) => {
  const cardId = req.body.cardId;
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 

  if (gameInstance[game.gameId]) {
    try {
      // console.log("PLAYERSTAGE", gameInstance[game.gameId].playerStage)
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
        // console.log("UPDATED PLAYERSTAGE", gameInstance[game.gameId].playerStage)
        console.log("playerMana", playerMana)
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

app.get('/getCardHandDetails', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  const gameInst = gameInstance[game.gameId];
  const { cardId, owner } = req.query;

  if (gameInst) {
    if (owner === 'player') {
      const card = gameInst.hand.find(card => card.id === parseInt(cardId));
      console.log("card", card)
      res.json(card);
    } else if (owner === 'opponent') {
      const card = gameInst.opponent.hand.find(card => card.id === parseInt(cardId));
      res.json(card);
    } else {
      res.status(400).json({ error: 'Unknown card owner' });
    }
  }
})

app.get('/getCardDeckDetails', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  const gameInst = gameInstance[game.gameId];
  const { cardId, owner } = req.query;


  if (gameInst) {
    if (owner === 'player') {
      const card = gameInst.playerStage.find(card => card.id === parseInt(cardId));
      res.json(card);
    } else if (owner === 'opponent') {
      const card = gameInst.opponent.opponentStage.find(card => card.id === parseInt(cardId));
      res.json(card);
    } else {
      res.status(400).json({ error: 'Unknown card owner' });
    }
  }
})

// Get card details
app.get('/getCardDetails', async (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  const cardId = req.query.cardId;

  try {
    // Retrieve card details from the database based on the cardId
    const cardData = await dbFunc.getCardByCardId(parseInt(cardId));

    // Check if cardData exists
    if (cardData.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Determine the type of card and create an instance accordingly
    let card;
    if (cardData[0].cardType.toLowerCase() === 'creature') {
      card = new CreatureCard( //id, name, type, description, mana, rarity, imagePath, attack, defense
        parseInt(cardId),                 // id
        cardData[0].cardName,   // name
        cardData[0].cardType,   // type
        cardData[0].creatureType,   // description
        parseInt(cardData[0].manaCost),
        cardData[0].rarity,
        cardData[0].imagePath,
        parseInt(cardData[0].attack),
        parseInt(cardData[0].defense));
    } else if (cardData[0].cardType.toLowerCase() === 'spell') {
      // console.log("cardData", cardData[0])
      card = new SpellCard( //id, name, type, description, mana, rarity, imagePath, attack, defense, ability, utility
        parseInt(cardId),                     // id
        cardData[0].cardName,       // name
        cardData[0].cardType,      // type
        cardData[0].spellAbility,      // description
        parseInt(cardData[0].manaCost),
        cardData[0].rarity,
        cardData[0].imagePath,
        parseInt(cardData[0].spellAttack),
        parseInt(cardData[0].spellDefense),
        cardData[0].spellType,
        cardData[0].utility);
      // console.log(card)
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
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 

  if (gameInstance[game.gameId]) {
    try {
      const gameInst = gameInstance[game.gameId];
      console.log("opponentStage", gameInst.opponentStage.length)
      // Get the updated playerStage after ending the turn
      await gameInst.playNextTurn();

      let opponentStage = gameInstance[game.gameId].opponentStage; // Computers
      let updatedStage = gameInstance[game.gameId].playerStage;
      let updatedHand = gameInstance[game.gameId].hand;
      const playerMana = gameInstance[game.gameId].user.mana;
      const opponentHand = gameInstance[game.gameId].opponentHand;

      console.log("opponentStage", opponentStage.length)
      res.status(200).json({
        message: 'Computer opponent\'s turn completed',
        opponentStage,
        updatedStage,
        updatedHand,
        opponentDeckCount: gameInstance[game.gameId].opponentDeck.length,
        playerDeckCount: gameInstance[game.gameId].deck.length,
        playerMana,
        opponentHand,
        playerHealth: gameInstance[game.gameId].user.health,
        round: gameInstance[game.gameId].round
      });

    } catch (error) {
      console.log("error: ", error)
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
})

app.post('/damageOpponent', (req, res) => {
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  const { id } = req.body;

  // Get the game instance
  const games = gameInstance[game.gameId];

  // Check if the game instance exists
  if (!games) {
    return res.status(404).json({ error: 'Game not found.' });
  }

  // Perform the attack operation
  const attackResult = games.attackOpponentHealth(parseInt(id));

  // Check if the attack was successful
  if (attackResult.success) {
    // Optionally, you can send back updated opponent health or other relevant data
    res.status(200).json({ message: attackResult.message, opponentHealth: games.opponent.health, playerMana: games.user.mana });
  } else {
    // If there was an error during the attack operation, send an error response
    res.status(400).json({ error: attackResult.error });
  }
});

app.post('/updatePlayerCreatureCard', async (req, res) => {
  const { cardId, updatedCardData, spellCardId } = req.body;
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  if (gameInstance[game.gameId]) {
    try {
      const result = await gameInstance[game.gameId].playSpellCard(parseInt(spellCardId), updatedCardData, parseInt(cardId));

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

app.post('/attackCardToOpponent', async (req, res) => {
  const { playerCardId, opponentCardId } = req.body;
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 

  if (gameInstance[game.gameId]) {
    try {
      const attackResult = await gameInstance[game.gameId].attackCardToOpponent(parseInt(playerCardId), parseInt(opponentCardId));
      console.log("ATTACK RESULT", attackResult)
      if (attackResult.success) {
        // Optionally, you can send back updated opponent health or other relevant data
        res.status(200).json({ message: attackResult.message, opponentHealth: gameInstance[game.gameId].opponent.health, playerMana: gameInstance[game.gameId].user.mana });
      } else {
        // If there was an error during the attack operation, send an error response
        res.status(400).json({ error: attackResult.error });
      }
    } catch (error) {
      console.log("Error in attacking card to opponent: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
});

app.post('/attackCardToHealth', async (req, res) => {
  const { id } = req.body;
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 
  console.log("ATTACK CARD TO HEALTH", id)
  if (gameInstance[game.gameId]) {
    try {
      const attackResult = await gameInstance[game.gameId].attackOpponentHealth(parseInt(id));
      console.log("ATTACK RESULT", attackResult)
      const opponentHealth = gameInstance[game.gameId].opponent.health;
      const playerMana = gameInstance[game.gameId].user.mana;
      const playerStage = gameInstance[game.gameId].playerStage;

      if (attackResult.success) {
        // Optionally, you can send back updated opponent health or other relevant data
        res.status(200).json({
          message: attackResult.message,
          opponentHealth: opponentHealth,
          playerMana: playerMana,
          playerStage: playerStage,
          playerDeckCount: gameInstance[game.gameId].deck.length,
        });
      } else {
        // If there was an error during the attack operation, send an error response
        res.status(400).json({ error: attackResult.error });
      }
    } catch (error) {
      console.log("Error in attacking card to health: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
});

app.post('/debuffOpponent', async (req, res) => {
  // Update the attacked Card with the debuff
  const { id, targetId } = req.body;
  // const game = { ruleSet: 'ruleSet1', gameId: 1001 } 
  const game = req.session.game; 

  console.log("DEBUFF OPPONENT", id, targetId)

  if (gameInstance[game.gameId]) {
    try {
      const debuffResult = await gameInstance[game.gameId].playCard(id, targetId);
      console.log(gameInstance[game.gameId].opponentStage)
      // console.log("DEBUFF RESULT", debuffResult)
      if (debuffResult.success) {
        // Optionally, you can send back updated opponent health or other relevant data
        res.status(200).json({
          message: debuffResult.message,
          opponentStage: gameInstance[game.gameId].opponentStage,
          hand: gameInstance[game.gameId].hand,
        });
      } else {
        // If there was an error during the attack operation, send an error response
        res.status(400).json({ error: debuffResult.error });
      }
    } catch (error) {
      console.log("Error in debuffing opponent: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Send a 404 status code if the game instance is not found
    res.status(404).json({ error: "Game not found." });
  }
});