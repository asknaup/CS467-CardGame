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
const gameGen = require('./database/game-gen');
const hf = require('./database/helper-funcs');
const card = require('./database/card');
const configFile = require('./database/config');

// Import Game Classes
const {Game, User, Card, CreatureCard, SpellCard} = require('./database/game-play1'); // Import the User class if not already imported


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
app.use('/database', express.static(path.join(__dirname, 'public')));

/*
ROUTES
*/
// TODO Home button should go to user's specifc profile
// TODO CardGenPage - sends the card generates the image, need image urls for cardGen, for userProfile
// TODO createNewCollection - needs further development
// TODO fix redundency for req.session.user and others
// TODO footer adjustments
// TODO add color to htmls
// TODO cardview page bulk - bulk generation?
// TODO homepage that's not the welcome page
// TODO Need better navigation -> navigation to card generation page as maybe a subclass under make. route to make game, make card

app.get('/cards', async (req, res) => {
  try {
      // Retrieve the user ID from the request query parameters
      // const userId = req.query.userId;
      const userId = 1001; //FIXME
      // console.log(userId);
      // Call the database function to get card data based on userId
      const cardData = await dbFunc.getCardIdByUser(userId);
      const cardsDict = hf.convertListToDict(cardData);
      // console.log(cardsDict);
      // Send card data as reponse
      res.json(cardsDict);
  } catch (error) {
      // Handle errors that occur during data retrival
      console.error('Error fetching card data:', error);
      res.status(500).json({error: 'Internal server error'})
  }
})

app.get('/favico.ico', (req, res) => {
  res.sendStatus(404);
});

app.get('/', (req, res) => {                        // This code needs work
  // Pull session user
  const user = req.session.user
  if (req.session.user) {
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

// Will change based on user logged in
// Might want to be able to view other users
app.get('/userProfile/:username', async (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    // If user is defined, user shown will be loggedin user
    const userProf = await dbFunc.getUserProfile(user.userId);
    res.render('userProfile', {
      username: user.username,
      gameCount: userProf[0].game_count,
      wins: userProf[0].wins,
      losses: userProf[0].losses,
      showLogoutButton: true
    })
  } else {
    // Route to homepage (index) to login
    res.redirect('/')
  }
});

app.get('/userDeck/:username', (req, res) => {
  // TODO show different decks
  // TODO insert deck as json into db
  // TODO handlebars
  // Show user logged in user profile
  // const user = req.session.user;
  user = {userId: 1001, username: 'admin'}
  if (user) {
    res.render('currentDeck', { showLogoutButton: true })
  } else {
    res.render('currentDeck', { showLogoutButton: false })
  }
});

// TODO routing between gameGeneration, card Generation
// TODO Work on corresponding edit pages, corresponding bulk pages
// TODO Work on generating inputs
// TODO html formatting
app.get('/gameGenPage', async (req, res) => {
  // Show user logged in user profile
  // const user = req.session.user;
  user = { userId: 1001, username: 'admin' }  // FIXME replace when ready
  try {
    if (user) {
      const userDecks = await dbFunc.gatherUserDecks(user.userId);
      console.log(userDecks)
      res.render('gameGenPage', { showLogoutButton: true, decks: userDecks })
    } else {
      res.render('gameGenPage', { showLogoutButton: false })
    }
  } catch (err) {
    console.log(err);
  }
});

// TODO Deck generation page
app.get('/buildDeck', (req, res) => {
  // Show user logged in user profile
  // FIXME
  // const user = req.session.user;
  user = {userId: 1001, username: 'admin'}
  if (user) {
    res.render('buildDeck', { showLogoutButton: true , userId : 1001})
  } else {
    res.render('buildDeck', { showLogoutButton: false })
  }
});

// Add to deck, delete, deck stats
app.get('/currentDeck', async (req, res) => {
  // Show user logged in user profile
  // FIXME
  const user = {userId: 1001, username: 'admin'};
  // const user = req.session.user;
  if (user) {
    var exampleCards = await dbFunc.getCardIdByUser(1001);
    console.log(exampleCards);
    res.render('currentDeck', { showLogoutButton: true })
  } else {
    res.render('currentDeck', { showLogoutButton: false })
  }
});

app.get('/browseGames', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('lookatGames', { showLogoutButton: true })
  } else {
    res.render('lookatGames', { showLogoutButton: false })
  }
});

app.get('/newUser', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('newUser', { showLogoutButton: true })
  } else {
    res.render('newUser', { showLogoutButton: false })
  }
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

app.get('/gamePlayPage', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('gamePlayPage', { showLogoutButton: true })
  } else {
    res.render('gamePlayPage', { showLogoutButton: false })
  }
});

// TODO other image ai sources
// TODO prompt restriction for better image generation
app.get('/cardGenPage', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('cardGenPage', { showLogoutButton: true })
  } else {
    res.render('cardGenPage', { showLogoutButton: false })
  }
});

app.get('/trading', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  res.render('trading', { showLogoutButton: true })
  if (user) {
    res.render('trading', { showLogoutButton: true })
  } else {
    res.render('trading', { showLogoutButton: false })
  }
});

app.get('/userProfile', (req, res) => {
  // Redirects to userProfile/:username
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.redirect('/userProfile/' + req.session.user.username)
  } else {
    res.redirect('/')
  }
});

app.get('/cardViewPage', async (req, res) => {
  // TODO card currently hardcoded
  const user = req.session.user;
  
  console.log(val[0]);
  if (user) {
    res.render('cardViewEditPage', { showLogoutButton: true, value: val })
  } else {
    res.render('cardViewEditPage', { showLogoutButton: false, value: val })
  }
});

// Log out
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.redirect('/');
    } else {
      // Redirect to welcome page
      res.redirect('/');
    }
  })
})

// Game
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
    res.redirect('/userProfile/' + req.session.user.username);

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

      // Redirects to userProfile
      res.redirect('userProfile');
    } else {
      // Authentication failed, return results stating so
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
      const aiCard = await card.createAICard(req.body.creatureType, req.body.theme, req.body.color, req.body.rarity);      
      let values = [];
      async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      while (values.length == 0) {
          values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId); //aiCard.sdGenerationJob.generationId
          // console.log(values);
          await delay(1000);
      }      
      res.render('cardViewEditPage', {
        val: values,
        cardName: req.body.cardName,
        cardType: req.body.cardType,
        rarity: req.body.rarity,
        manaCost: req.body.manaCost,
      });
    } else {
      // Authentication failed, render 'cardGenPage' with an error message
      res.render('cardGenPage', { error: "Sorry! You cannot create a card without having an account" })
    }
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/cardViewPrintedPage', async (req, res) => {
  try {
    const user = req.session.user;
    console.log(req.body.url, req.body.cardName);
    const cardId = await dbFunc.insertCard(req.body.cardName, req.body.cardType, user.userId, req.body.rarity, req.body.manaCost);    // returns cardId
    console.log(cardId, req.body.rarity)
    if (req.body.cardType === "Creature") {
      await dbFunc.insertCreatureCard(cardId, req.body.creatureAttack, req.body.creatureDefense);
    } else {
      await dbFunc.insertSpellCard(cardId, req.body.spellType, req.body.spellAbility, req.body.spellAttack, req.body.spellDefense, req.body.utility);
    }
    await dbFunc.insertCardUrl(cardId, req.body.url);
    console.log(req.body.url);
    const data = await dbFunc.getCardInfo(cardId);
    console.log(data[0].rarity);
    res.render('cardViewPrintedPage', {
      url: req.body.url,
      rarity: data[0].rarity,
      cardName: data[0].cardName,
      manaCost: data[0].manaCost
    });
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/gameGenerationPageAction', async (req, res) => {
  try {
    if (req.session.user) {
      const ruleSet = req.body.ruleSet;
      const userDeckId = req.body.userDeckSelect;

      // save deck and game inforamtion
      req.session.deck = { deckId: userDeckId }
      req.session.game = { ruleSet: ruleSet, gameId: 1001 }  // FIXME once table has been generated and returned gameId

      console.log(ruleSet);
      console.log(userDeckId);
      
      // TODO insert into new game to get gameId

      // redirects to app.get('/game/:gameId)
      // res.redirect('/game/' + req.session.game.gameId);

      // const object2 = await gameGen.sendNewGameToDB(req.session.user.userId, 0, 0, 'tbd');           // (ownerId, listCards, noCards, imageLocation) VALUES (?,?,?,?)';
      // console.log(object2);                     // gameId?
      // res.render('generatedGameView', {
      //   object2: object2
      // });
    } else {
      // Authentication failed, render 'welcomePagePortal' with an error message
      res.render('welcomePagePortal', {
        error: 'Invalid credentials. Please try again.'
      });
    }
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/createNewCollection', async (req, res) => {
  try {
    if (req.session.user.userId) {
      const gameId = await dbFunc.createNewCollection(req.session.user.userId);
      console.log(gameId);
      res.render('currentDeck', {
        gameId: gameId
      });
    }
    else {
      // Authentication failed, render 'welcomePagePortal' with an error message
      res.render('welcomePagePortal', {
        error: 'Invalid credentials. Please try again.'
      });
    }
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});