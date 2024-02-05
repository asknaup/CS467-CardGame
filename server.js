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
  res.render('welcomePagePortal', { showLogoutButton: false })
});

app.get('/welcomePagePortal', (req, res) => {
  res.render('welcomePagePortal', { showLogoutButton: false })
});

// Will change based on user logged in
app.get('/userProfile/:username', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const val = await dbFunc.getUserProfile(user.userId);
    res.render('userProfile', {
      username: user.username, gameCount: val[0].game_count,
      wl: 0, showLogoutButton: true
    })}});

app.get('/userDeck/:username', (req, res) => {
  res.render('currentDeck')
});

app.get('/gameGenPage', (req, res) => {
  res.render('gameGenPage')
});

app.get('/currentDeck', (req, res) => {
  res.render('currentDeck')
});

app.get('/browseGames', (req, res) => {
  res.render('lookatGames')
});

app.get('/newUser', (req, res) => {
  res.render('newUser')
});

app.get('/resetPW', (req, res) => {
  res.render('resetPW')
});

app.get('/gamePlayPage', (req, res) => {
  res.render('gamePlayPage')
});

app.get('/cardGenPage', (req, res) => {
  res.render('cardGenPage')
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
    }})})

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
    res.render('userProfile', {
    });
  } catch (err) {
    res.send(`Something went wrong : (${err})`);
  }});

  // Is this a post route? Get?
app.post('/login', async (req, res) => {
  try {
    const username = req.body.usernameWpp;
    const enteredPassword = req.body.passwordWpp;
    const user = await dbFunc.authenticateUser(username, enteredPassword);
    if (user) {             // If true, return userId and username
      req.session.user = {userId: user.userId, username: user.username};
      res.render('/userProfile/' + req.session.user.username);
    } else {                // Authentication failed, return results stating so
      res.render('welcomePagePortal', {
        error: 'Invalid credentials. Please try again.'
      }); }
  } catch (err) {
    res.send(`Something went wrong: ${err}`);
}});

app.post('/cardGenPage', async (req, res) => {
  try {
    if (req.session.user) {      
    } else {                // Authentication failed, return results stating so
      res.render('welcomePagePortal', {
        error: 'Invalid credentials. Please try again.'
      }); 
    }
    const user = req.session.user;
    console.log(user
      );
    const [attr, animal] = cardGen.generateAiForCard(req.body.inputAiImage);
    const object1 = await cardGen.sendCardToDB(animal, attr, req.session.user.userId);
    res.render('cardGenPage', {
      "animal": animal,
      "attr": attr,
      "object1": object1
     });
   } catch (err) {
     res.send(`Something went wrong: ${err}`);
   } });

/* app.post('/gameGenerationPageAction', async(req, res) => {
  try { 
    await dbFunc.insertNewGameIntoGames(req.body); 
    const game = 

  }
}
*/

