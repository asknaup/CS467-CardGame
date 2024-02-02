// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const app = express();                          // Routing 
const bodyParser = require('body-parser');
const port = 3000;

var db = require('./database/db-connector');
var dbFunc = require('./database/db-functions')

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

app.get('/user-profile-page/index', (req, res) => {
  res.render('user-profile-page/index')
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

app.post('/new-user-page/new-user-action', async (req, res) => {
  console.log("hello", req.body);
  try {
    await dbFunc.insertNewUserIntoDB(
      req.body.newUserName,
       req.body.inputNewPassword,
       req.body.inputEmail
      );
  res.render('user-profile-page/index', {
  });
}
  catch(err) {
    res.send(`Something went wrong : (${err}`);
  }
});



app.post('/add-user-ajax', function (req, res) {
  let data = req.body;
  console.log();
  query = "INSERT INTO user_creds (username, pwd) VALUES (?, ?)";
  db.pool.query(query, [data.username, data.password], function(error, rows, fields){
    console.log(JSON.stringify(rows));
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
});


/* app.post('generate-card-page/index'), async (req, res) => {
  try {
    await dbFunctions.
  }
}

*/



