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

app.get('/', (req, res) => {
  // Pull session user
  const user = req.session.user
  if (user) {
    // If user then show homepage
    res.render('welcomePagePortal', {
      showLogoutButton: true,
      showLoginButton: false
    })
  } else {
    // If user loged out, then show login button
    res.render('welcomePagePortal', {
      showLogoutButton: false,
      showLoginButton: true
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
    const val = await dbFunc.getUserProfile(user.userId);
    res.render('userProfile', {
      username: user.username, 
      gameCount: val[0].game_count,
      wl: 0, 
      showLogoutButton: true
    })
  }
});

app.get('/userDeck/:username', (req, res) => {
  res.render('currentDeck', { showLogoutButton: true })
});

app.get('/gameGenPage', (req, res) => {
  res.render('gameGenPage', { showLogoutButton: true })
});

app.get('/currentDeck', (req, res) => {
  res.render('currentDeck', { showLogoutButton: true })
});

app.get('/browseGames', (req, res) => {
  res.render('lookatGames', { showLogoutButton: true })
});

app.get('/newUser', (req, res) => {
  res.render('newUser', { showLogoutButton: false, showLoginButton: true })
});

app.get('/resetPW', (req, res) => {
  res.render('resetPW', { showLogoutButton: true })
});

app.get('/gamePlayPage', (req, res) => {
  res.render('gamePlayPage', { showLogoutButton: true })
});

app.get('/cardGenPage', (req, res) => {
  res.render('cardGenPage', { showLogoutButton: true })
});

app.get('/cardViewPage', async (req, res) => {
  const val = await cardGen.grabCardFromDB(1);             // Hard Coded
  console.log(val[0]);
  res.render('cardViewPage', {value: val})
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
app.post('/userProfile', async (req, res) => {
  try {
    const user_id = await dbFunc.insertNewUser(req.body.inputUserName, req.body.inputNewPassword, req.body.inputEmail);
    const userProfile = await dbFunc.getUserProfile(user_id);
    if (user_id) {          // save relevant user information in the session
      req.session.user = {
      userId: user_id, username: req.body.inputUserName, gameCount: userProfile[0].game_count,
      wins: userProfile[0].wins, losses: userProfile[0].losses };
      console.log(req.session.user);
    } 
    res.redirect('/userProfile/' + req.session.user.username);

  } catch (err) {
    console.log(err);

    if (err.code === 'ER_DUP_ENTRY') {
      res.render("newUser", {
        usnError: 'Username already in use. Please try another.'
      })
    } else {
      // Handle other errors if needed
      res.send(`Something went wrong : (${err})`);
    }
  }
});

// Post route to login
app.post('/login', async (req, res) => {
  try {
    const username = req.body.usernameWpp;
    const enteredPassword = req.body.passwordWpp;
    const user = await dbFunc.authenticateUser(username, enteredPassword);
    if (user) {
      // If true, return userId and username
      req.session.user = { userId: user.userId, username: user.username };
      res.redirect('/userProfile/' + req.session.user.username);
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


app.post('/cardGenPage', async (req, res) => {
  try {
    if (req.session.user) {
      const [attr, animal] = cardGen.generateAiForCard(req.body.inputAiImage);
      const object1 = await cardGen.sendCardToDB(animal, attr, req.session.user.userId);
      const url = await cardGen.generateImageForCard();
      console.log(url);
      // console.log(object1);            cardId
      res.render('cardGenPage', {
        animal: animal, attr: attr, object1: object1
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

app.post('/gameGenerationPageAction', async(req, res) => {
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

