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
const cardGen = require('./database/card-gen');
const gameGen = require('./database/game-gen');

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
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

/*
ROUTES
*/
// TODO Home button should go to user's specifc profile
// TODO CardGenPage - sends the card generates the image, need image urls for cardGen, for userProfile
// TODO createNewCollection - needs further development
// TODO Need to create cards that insert into cards Table
// TODO fix redundency for req.session.user and others
// TODO CardGenPage
// TODO Database
// TODO footer adjustments
// TODO add color to htmls
// TODO inputs for cardGen such as create, spell, userid, gameid
// TODO cardview page bulk - bulk generation?
// TODO homepage that's not the welcome page
// TODO Need better navigation -> navigation to card generation page as maybe a subclass under make. route to make game, make card

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
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('currentDeck', { showLogoutButton: true })
  } else {
    res.render('currentDeck', { showLogoutButton: false })
  }
});

// TODO routing between gameGeneration, card Generation
// TODO Work on corresponding edit pages, corresponding bulk pages
// TODO Work on generating inputs
// TODO (Amanda) database connection and card generation
// TODO (Amanda) change auto-increment for game generation
app.get('/gameGenPage', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
    res.render('gameGenPage', { showLogoutButton: true })
  } else {
    res.render('gameGenPage', { showLogoutButton: false })
  }
});

// TODO Deck generation page
// Add to deck, delete, deck stats
app.get('/currentDeck', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  if (user) {
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

// TODO DB variables, other elements on an iterative basis
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

app.get('/tradeAndCollect', (req, res) => {
  // Show user logged in user profile
  const user = req.session.user;
  res.render('tradeAndCollect', { showLogoutButton: true })
  if (user) {
    res.render('tradeAndCollect', { showLogoutButton: true })
  } else {
    res.render('tradeAndCollect', { showLogoutButton: false })
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
  const val = await cardGen.grabCardFromDB(1);             // Hard Coded
  console.log(val[0]);
  if (user) {
    res.render('cardViewPage', { showLogoutButton: true, value: val })
  } else {
    res.render('cardViewPage', { showLogoutButton: false, value: val })
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
      } else if (errCodeObject === "email"){
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
      req.session.user = { userId: user.userId, username: user.username};

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


app.post('/generateCard', async (req, res) => {
  const user = req.session.user;
  // const user = { userId: 1002, username: 'aknaup' }
  try {
    // console.log(user);
    if (user) {
      // const attr = cardGen.generateAiForCard(req.body.inputAiImage);
      const cardType = req.body.cardType;
      const cardName = req.body.cardName;
      const cardId = await cardGen.sendCardToDB(cardName, cardType, user.userId);    // returns cardId?
      
      // TODO specific card variables
      if (cardType === "Creature") {
        await dbFunc.insertCreatureCard(cardId);
      } else {
        await dbFunc.insertCreatureCard(cardId);
      }
      
      // const url = await cardGen.generateImageForCard(attr, object1);
      // await cardGen.sendImageURLtoDB(object1, url)
      // res.render('cardGenPage', {
      //   animal: animal, attr: attr, object1: object1
      // });


      res.redirect('/cardGenPage');
    } else {
      // Authentication failed, render 'welcomePagePortal' with an error message
      // res.render('welcomePagePortal', {
      //   error: 'Invalid credentials. Please try again.'
      // });
      // res.redirect('/cardGenPage');
      res.render('cardGenPage', {error: "Sorry! You cannot create a card without having an account"})
    }
  } catch (err) {
    // Handle errors that may occur during card generation, database interaction, or rendering
    res.send(`Something went wrong: ${err}`);
  }
});

app.post('/gameGenerationPageAction', async (req, res) => {
  try {
    if (req.session.user) {
      const object2 = await gameGen.sendNewGameToDB(req.session.user.userId, 0, 0, 'tbd');           // (ownerId, listCards, noCards, imageLocation) VALUES (?,?,?,?)';
      console.log(object2);                     // gameId?
      res.render('generatedGameView', {
        object2: object2
      });
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