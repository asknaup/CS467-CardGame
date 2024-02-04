// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const session = require('express-session');     // Session control to save variables once a user logs in
// const bcrypt = require('bcrypt');               // Encryption
const app = express();                          // Routing 
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const fs = require('fs');

const db = require('./database/db-connector');
const dbFunc = require('./database/db-functions')
const cardGen = require('./database/card-gen');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))

app.engine('handlebars', exphbs.engine(
  { extname: "hbs", defaultLayout: false, layoutsDir: "views/layouts/" }
));

app.set('view engine', 'handlebars');

// Define the view directory path for Handlebars files
app.set('views', path.join(__dirname, 'views'));

// Serve static file from public directory
app.use(express.static('public'));

/*
ROUTES
*/

app.get('/current-deck-page/index', (req, res) => {
  res.render('currentDeck')
});

app.get('/', (req, res) => {
  res.render('welcomePagePortal')
});

app.get('/welcomePagePortal', (req, res) => {
  res.render('welcomePagePortal');
});

app.get('/user-profile-page/index', async (req, res) => {
    const val = await dbFunc.getUserProfileInfo(req.body.inputUserName, req.body.inputNewPassword)
    res.render('user-profile-page/index', {
    'userProfile', {
    user_id: val
  })
});

app.get('/userProfile', async (req, res) => {
  /// ERROR HANDLING IF USER NOT IN DB
  const val = await dbFunc.getUserId(req.body.inputUserName, req.body.inputNewPassword)
  console.log(val);
  const more = await dbFunc.getUserProfileInfo(val)
  console.log(val[0]);
  res.render('userProfile', {
  user_id: val,
  statusbar: more
})
});

app.get('/gameGenPage', (req, res) => {
  res.render('gameGenPage')
});

app.get('/lookatGames', (req, res) => {
  res.render('lookatGames')
});

app.get('/resetPW', (req, res) => {
  /// User_id / Password needed
  res.render('resetPW')
});

app.get('/newUserPage', (req, res) => {
  res.render('newUser')
});

app.get('/resetPasswordPage', (req, res) => {
  res.render('resetPW')
});

app.get('/gamePlayPage', (req, res) => {
  res.render('gamePlayPage')
});

app.get('/generateCardPage', (req, res) => {
  res.render('cardGenPage')
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// POST ROUTES

app.post('/userProfile', async (req, res) => {
  try {
    const user_id = await dbFunc.insertNewUser(req.body.inputUserName, req.body.inputNewPassword, req.body.inputEmail);
    const userProfile = await dbFunc.getUserProfileInfo(user_id);

    if (user_id) {
      // save relevant user information in the session
      req.session.user = {
        userId: user_id,
        username: req.body.inputUserName,
        gameCount: userProfile[0].game_count,
        wins: userProfile[0].wins,
        losses: userProfile[0].losses
      };
      console.log(req.session.user);
    }
    
    res.render('userProfile', {
      user_id: req.body.inputUserName, game_count: userProfile[0].game_count,
      wins: userProfile[0].wins, losses: userProfile[0].losses
    });
  } catch (err) {
    res.send(`Something went wrong : (${err})`);
  }
});

app.post('/generateCardPage', (req, res) => {
  try {
    const stuff = cardGen.generateAiForCard(req.body.inputAiImage);
    console.log(stuff[0], stuff[1]);
    res.render('generateCardPage/index', {
      animal: stuff[1],
      attr: stuff[2]
    });
  } catch (err) {
    console.error('Error:', err);
    res.send(`Something went wrong: ${err}`);
  }
});

/* app.post('/gameGenerationPageAction', async(req, res) => {
  try { 
    await dbFunc.insertNewGameIntoGames(req.body); 
    const game = 

  }
}
*/

