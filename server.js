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

app.use('/trading', express.static(path.join(__dirname, 'public'), 
{
  'extensions': ['js'],
  'index': false,
  'Content-Type': 'text/javascript'
}));

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

app.get('/', (req, res) => {                       
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
  const user = req.session.user;
  if (user) {
    // If user is defined, user shown will be loggedin user
    const userProf = await dbFunc.getUserProfile(user.userId);
    res.render('userProfile', {
      username: user.username, gameCount: userProf[0].game_count,
      wins: userProf[0].wins, losses: userProf[0].losses,
      showLogoutButton: true
      // Collections, Decks, Games
    })
  } else {
    // Route to homepage (index) to login
    res.redirect('/')
  }
});

app.get('/userDeck/:username', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('currentDeck', { showLogoutButton: true })
  } else {
    res.render('/')
  }
});

app.get('/gamePlayPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('gamePlayPage');
  } else {
    // Redirect to homepage (index) to log in
    res.redirect('/');
  }
});


app.get('/cardGenBulkPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('cardGenBulkPage');
  } else {
    // Redirect to homepage (index) to log in
    res.redirect('/');
  }
});

app.get('/gameGenPage', async (req, res) => {
  const user = req.session.user;
  try {
    if (user) {
      const userDecks = await dbFunc.gatherUserDecks(user.userId);
      res.render('gameGenPage', { showLogoutButton: true, decks: userDecks })
    } else {
      res.render('/')
    }
  } catch (err) {
    console.log(err);
  }
});

app.get('/buildDeck', (req, res) => {
  // Needs collection and game info
  const user = req.session.user;
  if (user) {
    res.render('buildDeck', { showLogoutButton: true})
  } else {
    res.render('/');
  }
});

// NEEDS WORK
app.get('/browseGames', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('browseGames', { showLogoutButton: true })
  } else {
    res.render('/');
  }
});

app.get('/newUser', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('newUser', { showLogoutButton: true })
  } else {
    res.render('/')
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


app.get('/cardGenPage', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('cardGenPage', { showLogoutButton: true })
  } else {
    res.redirect('/');
  }
});

app.get('/trading', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('trading', { showLogoutButton: true })
  } else {
    res.redirect('/');
  }
});

app.get('/collect', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render('collect', { showLogoutButton: true })
  } else {
    res.render('/')
  }
});

app.get('/userProfile', (req, res) => {
  // Redirects to userProfile/:username
  const user = req.session.user;
  if (user) {
    res.redirect('/userProfile/' + req.session.user.username)
  } else {
    res.redirect('/')
  }
});

// Log out
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
      const aiCard = await card.createAICard(req.body.creatureType, req.body.theme, req.body.color, req.body.rarity, 3);      
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
      
      res.render('cardGenPage', { error: "Sorry! You cannot create a card without having an account" })
    }
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
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
      newCreature = card.createDataStructCreature(req.body.colors, req.body.creatures, req.body.places);
      const aiCard = await card.createAICard(newCreature.creature, newCreature.place, newCreature.color, newCreature.rarity, 1);
    
      let values = [];
      while (values.length === 0) {
        values = await card.getImageUrlFromLeonardo(aiCard.sdGenerationJob.generationId);
        await delay(500); // Add a delay to avoid excessive requests
      }
      newCreature.URL = values
      generatedCards.push(newCreature);
    }   
    // console.log(generatedCards);

    generatedCards.forEach( async (card) => {
      try {
        const cardId = await dbFunc.insertCard("Sir Gwendyn", card.cardType, user.userId, "rare", card.manaCost);
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
    const cardId = await dbFunc.insertCard(req.body.cardName, req.body.cardType, user.userId, req.body.rarity, req.body.manaCost);
    
    if (req.body.cardType === "Creature") {
      await dbFunc.insertCreatureCard(cardId, req.body.creatureAttack, req.body.creatureDefense, "samurai" );     // Hard coded
    } else {
      await dbFunc.insertSpellCard(cardId, req.body.spellType, req.body.spellAbility, req.body.spellAttack, req.body.spellDefense, req.body.utility);
    }

    await dbFunc.insertCardUrl(cardId, req.body.url);
    const data = await dbFunc.getCardInfo(cardId);
    //console.log(req.body.url, data[0].rarity);
    
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