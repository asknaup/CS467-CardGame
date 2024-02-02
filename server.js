// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const app = express();                          // Routing 
const bodyParser = require('body-parser');
const port = 3000;

const db = require('./database/db-connector');
const dbFunc = require('./database/db-functions')
const cardGen = require('./database/card-gen');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs.engine(                  
  { extname: "hbs", defaultLayout: false, layoutsDir: "views/layouts/"}
  ));

app.set('view engine', 'handlebars');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

/*
ROUTES
*/

app.get('/', (req, res) => {
  res.render('welcome-page-portal/index');
});

app.get('/current-deck-page/index', (req, res) => {
  res.render('current-deck-page/index')
});

app.get('/welcome-page-portal/index', (req, res) => {
  res.render('welcome-page-portal/index')
});

app.get('/user-profile-page/index', async (req, res) => {
    const val = await dbFunc.getUserProfileInfo(req.body.newUserName, req.body.inputNewPassword)
    console.log(val.user_id);
    res.render('user-profile-page/index', {
    user_id: val
  })
});

app.get('/game-generation-page/index', (req, res) => {
  res.render('game-generation-page/index')
});

app.get('/look-at-games-page/index', (req, res) => {
  res.render('look-at-games-page/index')
});

app.get('/new-user-page/index', (req, res) => {
  res.render('new-user-page/index')
});

app.get('/reset-password-page/index', (req, res) => {
  res.render('reset-password-page/index')
});

app.get('/game-play-page/index', (req, res) => {
  res.render('game-play-page/index')
});

app.get('/generate-card-page/index', (req, res) => {
  res.render('generate-card-page/index')
});
 
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// POST ROUTES

app.post('/user-profile-page/index', async (req, res) => {
  //console.log("hello", req.body);
  try {
      await dbFunc.insertNewUserIntoDB(req.body.newUserName, req.body.inputNewPassword, req.body.inputEmail);
      const user_id = await dbFunc.getUserId(req.body.newUserName, req.body.inputNewPassword);
      //console.log(JSON.stringify(user_id[0]));
      const val = await dbFunc.getUserProfileInfo(user_id[0].user_id);
      //console.log(val[0].game_count);
      res.render('user-profile-page/index', {
        user_id: req.body.newUserName, game_count: val[0].game_count,
        wins: val[0].wins, losses: val[0].losses
    });
  }
  catch(err) {
    res.send(`Something went wrong : (${err}`);
  }
});

app.post('/generatecardpage', (req, res) => {
  try {
      const stuff = cardGen.generateAiForCard(req.body.inputAiImage);
      console.log(stuff[0], stuff[1]);
      res.render('generate-card-page/index', {
          animal: stuff[1],
          attr: stuff[2] 
      });
  } catch(err) {
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

